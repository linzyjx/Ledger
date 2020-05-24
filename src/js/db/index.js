import SQL from 'sql-template-strings';
import sqlite from "sqlite";
import sqlite3 from "sqlite3";
import path from "path";
import os from "os";
import fs from 'fs';

// const DBFileSrc = path.resolve(os.homedir(), 'AppData', 'Roaming', 'DemoAPP', 'example.db');
const DBFileSrc = path.resolve(os.homedir(), 'AppData', 'Roaming', 'Ledger', 'data', 'data.db');

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
    if (data === undefined) return undefined;
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
    if (data === undefined) return undefined;
    return data.id;
}

//检查数据库文件是否存在
function checkDatabase() {
    const testFileDir = path.resolve(os.homedir(), 'AppData', 'Roaming', 'Ledger', 'data');
    try {
        fs.accessSync(DBFileSrc);
    } catch (e) {
        if (e.code === 'ENOENT') {
            console.log('no file');
            //检查是否存在目录
            try {
                fs.accessSync(testFileDir);
            } catch (dirError) {
                if (dirError.code === 'ENOENT') {
                    console.log('no dir');
                    //创建目录
                    fs.mkdirSync(testFileDir);
                } else {
                    throw new Error(dirError);
                }
            }
            //创建数据库文件
            initDatabase(DBFileSrc)
                .then(() => {
                    console.log('init database done.');
                    return 0;
                });
        } else {
            throw new Error(e);
        }
    }
    return 0;
}

async function initDatabase(dbFileSrc) {
    let db = await sqlite.open(dbFileSrc, {})
        .catch(e => {
            console.error(e, DBFileSrc);
            throw new Error(e);
        });
    await db.run(`begin transaction`);
    try {
        await db.run(`PRAGMA FOREIGN_KEYS = ON`);
        await db.run(`CREATE TABLE bill_list
                    (
                        id            integer PRIMARY KEY,
                        name          text    NOT NULL,
                        time          integer NOT NULL,
                        type          integer NOT NULL,
                        amount        real,
                        balance       real,
                        party_name    text,
                        party         integer,
                        account       integer NOT NULL,
                        category      integer,
                        transfer_deal integer,
                        other         text,
                    
                        foreign key (account) references account_list (account_id),
                        foreign key (category) references category_list (category_id),
                        foreign key (party) references party_list (party_id)
                    )`);
        await db.run(`CREATE TABLE account_list
                    (
                        account_id       integer PRIMARY KEY,
                        account_name     text,
                        account_type     integer NOT NULL,
                        account_children integer,
                        account_color    text
                    )`);
        await db.run(`CREATE TABLE category_list
                    (
                        category_id       integer PRIMARY KEY,
                        category_name     text    NOT NULL,
                        category_icon     text    NOT NULL,
                        category_color    text    NOT NULL,
                        category_children integer,
                        category_type     integer NOT NULL
                    )`);
        await db.run(`CREATE TABLE party_list
                    (
                        party_id   integer PRIMARY KEY,
                        party_name text NOT NULL
                    )`);
        await db.run(`INSERT INTO account_list(account_id, account_name, account_type, account_children)
                        VALUES (0, 'root', 0, '[]')`);
        await db.run(`INSERT INTO category_list(category_id, category_name, category_icon, category_color, category_children, category_type)
                        VALUES (0, 'root', '', '#FFFFFF', '[]', 0),
                               (1, 'root', '', '#FFFFFF', '[]', 1)`);
        await db.run(`commit`);
        return 0;
    } catch (e) {
        console.error(e, 'createDatabase Error');
        await db.run(`rollback`);
        throw new Error(e);
    }
}

export {DBFileSrc, getNearlyNewBillId, loadDBFile, loadReadDBFile, getNearlyOldBillId, checkDatabase}
