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


export {updateDetailItem, addDetailItem, deleteDetailItem}


