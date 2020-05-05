import SQL from 'sql-template-strings';
import {getNearlyNewBillId, loadDBFile} from '../index'

async function updateDetailItem(id, type, changeData) {
    let db = await loadDBFile();
    console.log('get', id, type, changeData);
    let freshBalanceID = new Set();
    //转账类型：对手交易同样要处理
    if (type === 2) {
        let b_changeData = {};
        Object.assign(b_changeData, changeData);
        delete b_changeData.account;
        let data = await db.get(SQL`SELECT transfer_deal,amount FROM bill_list WHERE id=${id}`);
        let b_id = data.transfer_deal;
        if (changeData.transfer_deal_account !== undefined) {
            console.log('transfer_deal_account get!');
            b_changeData.account = changeData.transfer_deal_account;
            delete changeData.transfer_deal_account;
            delete b_changeData.transfer_deal_account;
            freshBalanceID.add(await getNearlyNewBillId(b_id)).add(b_id);
        }
        if (changeData.amount !== undefined) {
            changeData.amount *= -1.0;
            freshBalanceID.add(b_id);
        }
        if (changeData.time !== undefined) {
            if (data.amount >= 0) {
                changeData.time += 0.1;
            } else {
                b_changeData.time += 0.1;
            }
        }
        await updateAnDetailItem(db, b_id, b_changeData);
    }
    if (changeData.account !== undefined) {
        freshBalanceID.add(await getNearlyNewBillId(id)).add(id);
    }
    if (changeData.amount !== undefined) {
        freshBalanceID.add(id);
    }

    await updateAnDetailItem(db, id, changeData);
    console.log(freshBalanceID);
    for (let item of freshBalanceID) {
        if (item === undefined) continue;
        await checkBalance(db, item);
    }
}

async function updateAnDetailItem(db, id, changeData) {
    console.log('updateAnDetailItem', id, changeData);
    let query = SQL`UPDATE bill_list SET `;
    let firstFlag = false;
    for (let item of Object.keys(changeData)) {
        // console.log(item,changeData[item]);
        query.append(firstFlag ? ',' : '').append(item).append(SQL`=${changeData[item]} `);
        firstFlag = true
    }
    if (firstFlag === false) return;
    query.append(SQL`WHERE id=${id}`);
    console.log(await db.run(query));
}

//删除账目
async function deleteDetailItem(id) {
    let db = await loadDBFile();
    let freshBalanceID = new Set();
    let data = await db.get(SQL`SELECT type,transfer_deal FROM bill_list where id=${id}`);
    freshBalanceID.add(await getNearlyNewBillId(id));
    if (data.type === 2) {
        freshBalanceID.add(await getNearlyNewBillId(data.transfer_deal));
        await db.run(SQL`DELETE FROM bill_list WHERE id=${data.transfer_deal}`);
    }
    await db.run(SQL`DELETE FROM bill_list WHERE id=${id}`);
    for (let item of freshBalanceID) {
        if (item === undefined) continue;
        await checkBalance(db, item);
    }
}

//新增账目
async function addDetailItem(data) {
    let db = await loadDBFile();
    console.log('get', data);
    if (data.type !== 2) {
        let id = await addAnDeatilItem(db, data);
        await checkBalance(db, id);
    } else {
        data.category = undefined;
        data.amount *= -1.0;
        let a_id = await addAnDeatilItem(db, data);
        data.amount *= -1.0;
        data.time += 0.1;
        data.account = data.transfer_deal_account;
        let b_id = await addAnDeatilItem(db, data);
        updateAnDetailItem(db, a_id, {transfer_deal: b_id});
        updateAnDetailItem(db, b_id, {transfer_deal: a_id});
        await checkBalance(db, a_id);
        await checkBalance(db, b_id);
    }
}

async function addAnDeatilItem(db, data) {
    let query = SQL`INSERT INTO bill_list(name, time, type, amount, balance, account, category, party_name) 
                        VALUES(${data.name},${data.time},${data.type},${data.amount},${data.balance},${data.account},${data.category},${data.party_name})`;
    await db.run(query);
    let id = (await db.all(SQL`SELECT last_insert_rowid() as id from bill_list limit 1`))[0].id;
    console.log('get id:', id);
    return id;
}

async function checkBalance(db, id) {
    console.log('checkBalance:', id);
    let query = SQL`insert or replace
into bill_list(id, balance, name, time, type, amount, party_name, party, account, category,
               transfer_deal, other)
select t1.id,
       t2.balance,
       t1.name,
       t1.time,
       t1.type,
       t1.amount,
       t1.party_name,
       t1.party,
       t1.account,
       t1.category,
       t1.transfer_deal,
       t1.other
from bill_list as t1,
     (select id                                                                  as id,
             ((select cast((sum(amount)*1000) as integer)/1000.0
               from bill_list
               where time <= (select time from bill_list where id = a.id)
                 and account = (select account from bill_list where id = a.id))) as balance
      from bill_list as a
      where id in (select id
                   from bill_list as a
                   where time >= (select time from bill_list where id = ${id})
                     and account = (select account from bill_list where id = ${id})
      )) as t2
where t1.id = t2.id`;
//     console.log(await db.get(SQL`select FLOOR(${id*2.5})`));
    await db.run(query);
}

//修改CategoryListTree
async function updateCategoryList(id, dropNodeId, dropType) {
    let db = await loadDBFile();
    await db.run(`begin transaction`);
    try {
        let {id: oldParentId, fullkey: oldParentFullKey}
            = await db.get(SQL`SELECT category_id as id,parent.fullkey as fullkey 
                                FROM category_list, json_each(category_children) parent 
                                WHERE parent.value = ${id}`);
        await db.run(SQL`UPDATE category_list
                    SET category_children=json_remove(category_children, ${oldParentFullKey})
                    WHERE category_id=${oldParentId}`);
        if (dropType === 'inner') {
            let {category_children: children} = await db.get(SQL`SELECT category_children 
                                        FROM category_list WHERE category_id=${dropNodeId}`);
            if (children === null) {
                children = '[]';
            }
            children = JSON.parse(children);
            children.push(id);
            await db.run(SQL`UPDATE category_list
                                SET category_children=${JSON.stringify(children)}
                                WHERE category_id=${dropNodeId}`);
        } else {
            let {id: parentId, children: children} = await db.get(SQL`SELECT category_id as id,category_children as children 
                                                FROM category_list, json_each(category_children) parent 
                                                WHERE parent.value = ${dropNodeId}`);
            if (children === null) {
                children = '[]';
            }
            children = JSON.parse(children);
            if (dropType === 'before') {
                for (let index in children) {
                    if (children[index] === dropNodeId) {
                        children.splice(index, 0, id);
                        break;
                    }
                }
            } else {
                //after
                for (let index in children) {
                    if (children[index] === dropNodeId) {
                        children.splice((index + 1), 0, id);
                        break;
                    }
                }
            }
            await db.run(SQL`UPDATE category_list
                                SET category_children=${JSON.stringify(children)}
                                WHERE category_id=${parentId}`);
        }
        await db.run('commit');
    } catch (e) {
        await db.run(`rollback`);
        console.log(e);
    }
}

async function addCategoryItem(type) {
    let db = await loadDBFile();
    await db.run(SQL`INSERT INTO category_list(category_name, category_icon, category_color, category_type)
                        VALUES ('New Category', 'el-icon-star-off', '#66B1FF', ${type})`);
    let {id: id} = await db.get(SQL`SELECT last_insert_rowid() AS id FROM category_list LIMIT 1`);
    let {category_children: children} = await db.get(SQL`SELECT category_children 
                                        FROM category_list WHERE category_id=${type}`);
    if (children === null) {
        children = '[]';
    }
    children = JSON.parse(children);
    children.splice(0, 0, id);
    await db.run(SQL`UPDATE category_list
                                SET category_children=${JSON.stringify(children)}
                                WHERE category_id=${type}`);
}

async function deleteCategoryItem(id) {
    let db = await loadDBFile();
    try {
        await db.run(`begin transaction`);
        console.log('deleteCategoryItem', id);
        let {category_id: parentId, fullkey: parentFullKey} = await db.get(SQL`SELECT category_id,parent.fullkey as fullkey 
                                FROM category_list, json_each(category_children) parent 
                                WHERE parent.value = ${id}`);
        await db.run(SQL`UPDATE category_list
                    SET category_children=json_remove(category_children, ${parentFullKey})
                    WHERE category_id=${parentId}`);
        await db.run(SQL`UPDATE bill_list SET category=${parentId} WHERE category = ${id}`);
        await db.run(SQL`DELETE FROM category_list WHERE category_id=${id}`);
        await db.run(`commit`);
    } catch (e) {
        await db.run(`rollback`);
        console.error(e);
    }
}

async function updateCategoryItem(id, data) {
    let db = await loadDBFile();
    await db.get(SQL`UPDATE category_list
                    SET category_name=${data.name},
                        category_color=${data.color},
                        category_icon=${data.icon}
                    WHERE category_id = ${id}`);
}

async function updateAccountList(id, dropNodeId, dropType) {
    let db = await loadDBFile();
    await db.run(`begin transaction`);
    try {
        let {id: oldParentId, fullkey: oldParentFullKey}
            = await db.get(SQL`SELECT account_id as id, parent.fullkey as fullkey
                                FROM account_list,
                                     json_each(account_children) parent
                                WHERE parent.value = ${id}`);
        await db.run(SQL`UPDATE account_list
                            SET account_children=json_remove(account_children, ${oldParentFullKey})
                            WHERE account_id = ${oldParentId}`);
        if (dropType === 'inner') {
            //组件复用
            insertAccountTreeNodeTypeInner(db, id, dropNodeId);
        } else {
            let {id: parentId, children: children}
                = await db.get(SQL`SELECT account_id as id, account_children as children
                                    FROM account_list,
                                         json_each(account_children) parent
                                    WHERE parent.value = ${dropNodeId}`);
            if (children === null) {
                children = '[]';
            }
            children = JSON.parse(children);
            if (dropType === 'before') {
                for (let index in children) {
                    if (children[index] === dropNodeId) {
                        children.splice(index, 0, id);
                        break;
                    }
                }
            } else {
                //after
                for (let index in children) {
                    if (children[index] === dropNodeId) {
                        children.splice((index + 1), 0, id);
                        break;
                    }
                }
            }
            await db.run(SQL`UPDATE account_list
                            SET account_children=${JSON.stringify(children)}
                            WHERE account_id = ${parentId}`);
        }
        await db.run(`commit`);
    } catch (e) {
        await db.run(`rollback`);
        console.log(e);
    }
}

async function insertAccountTreeNodeTypeInner(db, id, dropNodeId) {
    let {account_children: children}
        = await db.get(SQL`SELECT account_children
                                    FROM account_list
                                    WHERE account_id = ${dropNodeId}`);
    if (children === null) {
        children = '[]';
    }
    children = JSON.parse(children);
    children.push(id);
    await db.run(SQL`UPDATE account_list
                                SET account_children=${JSON.stringify(children)}
                                WHERE account_id = ${dropNodeId}`);
}

async function updateAccountItem(id, changeData) {
    let db = await loadDBFile();
    console.log(id, changeData);
    await db.run(`begin transaction`);
    try {
        let data = {};
        if (changeData.name !== undefined) data.account_name = changeData.name;
        if (changeData.type !== undefined) data.account_type = changeData.type;
        if (changeData.color !== undefined) data.account_color = changeData.color;

        let query = SQL`UPDATE account_list SET `;
        let firstFlag = false;
        for (let item of Object.keys(data)) {
            query.append(firstFlag ? ',' : '').append(item).append(SQL`=${data[item]} `);
            firstFlag = true
        }
        if (firstFlag === true) {
            query.append(SQL`WHERE account_id=${id}`);
            await db.run(query);
        }
        if (changeData.group !== undefined) {
            await updateAccountList(id, changeData.group, 'inner');
        }
        await db.run(`commit`);
    } catch (e) {
        await db.run(`rollback`);
        console.error(e, id, changeData);
    }
}

async function addAccountItem(data) {
    let db = await loadDBFile();
    await db.run(`begin transaction`);
    try {
        await db.run(SQL`INSERT INTO account_list(account_name, account_type, account_color)
                            VALUES (${data.name}, ${data.type}, ${data.color})`);
        let {id: id} = await db.get(SQL`SELECT last_insert_rowid() as id from account_list limit 1`);
        await insertAccountTreeNodeTypeInner(db, id, data.group);
        await db.run(`commit`);
    } catch (e) {
        await db.run(`rollback`);
        console.error(e, data);
    }
}

async function deleteAccountItem(id) {
    let db = await loadDBFile();
    await db.run(`begin transaction`);
    console.log('delete:', id);
    try {
        let item = {};
        ({account_name: item.name, account_type: item.type, children_length: item.children_length}
            = await db.get(SQL`SELECT account_name, account_type, json_array_length(account_children) as children_length
                        FROM account_list
                        WHERE account_id = ${id}`));
        if (item.children_length > 0) {
            console.error(item);
            throw `deleteAccountItem: id=${id} type is group & length>0 ${item.children_length}`;
        }
        let {account_id: parentId, fullkey: parentFullKey}
            = await db.get(SQL`SELECT account_id, parent.fullkey as fullkey
                                FROM account_list,
                                     json_each(account_children) parent
                                WHERE parent.value = ${id}`);
        await db.run(SQL`UPDATE account_list
                    SET account_children=json_remove(account_children, ${parentFullKey})
                    WHERE account_id=${parentId}`);
        if (item.type === 1) {
            //修改转账交易的对方账目为收入/支出
            await db.run(SQL`insert or
                        replace
                        into bill_list(id, balance, name, time, type, amount, party_name, party, account, category,
                                       transfer_deal, other)
                        select t1.id,
                               t1.balance,
                               t2.name,
                               t1.time,
                               t2.type,
                               t1.amount,
                               ${item.name},
                               t1.party,
                               t1.account,
                               t1.category,
                               null,
                               t1.other
                        from bill_list as t1,
                             (SELECT id, (CASE WHEN amount >= 0 THEN 0 ELSE 1 END) as type, (name || ' (已删除)') as name
                              FROM bill_list,
                                   (SELECT transfer_deal
                                    FROM bill_list
                                    WHERE account = ${id}
                                      AND type = 2) t2
                              WHERE id = t2.transfer_deal) as t2
                        where t1.id = t2.id`);
        }
        await db.run(SQL`DELETE FROM bill_list WHERE account=${id}`);
        await db.run(SQL`DELETE FROM account_list WHERE account_id=${id}`);
        await db.run(`commit`);
    } catch (e) {
        console.error(e, `id=${id}`, e.stack);
        await db.run(`rollback`);
    }
}

export {
    updateDetailItem,
    addDetailItem,
    deleteDetailItem,
    updateCategoryList,
    addCategoryItem,
    deleteCategoryItem,
    updateCategoryItem,
    updateAccountList,
    updateAccountItem,
    addAccountItem,
    deleteAccountItem
}


