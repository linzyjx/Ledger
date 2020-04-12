import SQL from 'sql-template-strings';
import {getNearlyNewBillId, loadDBFile} from '../index'
import el from "element-ui/src/locale/lang/el";

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
    let query = SQL`INSERT INTO bill_list(name, time, type, amount, balance, account, category) 
                        VALUES(${data.name},${data.time},${data.type},${data.amount},${data.balance},${data.account},${data.category})`;
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

export {
    updateDetailItem,
    addDetailItem,
    deleteDetailItem,
    updateCategoryList,
    addCategoryItem,
    deleteCategoryItem,
    updateCategoryItem
}


