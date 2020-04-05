import SQL from 'sql-template-strings';
import sqlite from "sqlite";
import sqlite3 from "sqlite3";
import path from "path";
import os from "os";

const DBFileSrc = path.resolve(os.homedir(), 'AppData', 'Roaming', 'DemoAPP', 'example.db');

async function loadDBFile() {
    return await sqlite.open(DBFileSrc, {}).catch(e => {
        console.error(e, DBFileSrc);
    });
}

async function loadReadDBFile() {
    return await sqlite.open(DBFileSrc, {
        mode: sqlite3.OPEN_READONLY
    }).catch(e => {
        console.error(e, DBFileSrc);
    });
}

async function getNearlyNewBillId(id, db = undefined) {
    if (db === undefined) {
        db = await loadReadDBFile();
    }
    let query = SQL`select id
from bill_list,
     (select time, account from bill_list where id = ${id}) t1
where bill_list.time > t1.time
  and bill_list.account = t1.account
order by bill_list.time ASC
limit 1;`;
    let data = (await db.get(query));
    if (data == undefined) return undefined;
    return data.id;
}

async function getNearlyOldBillId(id, db = undefined) {
    if (db === undefined) {
        db = await loadReadDBFile();
    }
    let query = SQL`select id
from bill_list,
     (select time, account from bill_list where id = ${id}) t1
where bill_list.time < t1.time
  and bill_list.account = t1.account
order by bill_list.time DESC
limit 1;`;
    let data = (await db.get(query));
    if (data == undefined) return undefined;
    return data.id;
}

export {getNearlyNewBillId, loadDBFile, loadReadDBFile, getNearlyOldBillId}
