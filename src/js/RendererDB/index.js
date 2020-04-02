import SQL from 'sql-template-strings';
import sqlite from 'sqlite';
import sqlite3 from 'sqlite3';
import os from 'os';
import path from 'path';
// import ro from "element-ui/src/locale/lang/ro";

// let DBFileSrc = os.homedir().toString() + '\\Roaming\\DemoAPP\\example.db';
const DBFileSrc = path.resolve(os.homedir(), 'AppData', 'Roaming', 'DemoAPP', 'example.db');

async function loadDBFile() {
    return await sqlite.open(DBFileSrc, {
        mode: sqlite3.OPEN_READONLY
    }).catch(e => {
        console.error(e, DBFileSrc);
    });
}

async function getBilllistDataByAccountId(accountId) {
    let db = await loadDBFile();
    return await db.all(SQL`SELECT * FROM bill_list WHERE account=${accountId} ORDER BY time DESC`);
}

async function getBilllistDataById(id) {
    let db = await loadDBFile();
    return (await db.all(SQL`SELECT * FROM bill_list WHERE id=${id}`))[0];
}

async function getAccountListData() {
    let db = await loadDBFile();
    let rowData = await db.all(SQL`SELECT * FROM account_list`);
    for (let node of rowData) {
        node.account_children = JSON.parse(node.account_children);
    }
    // console.log(rowData, transAccountListData(rowData));
    return transAccountListData(rowData);
}

function transAccountListData(row) {
    let data = [];
    let rootNode = {
        id: row[0].account_id,
        label: row[0].account_name,
        type: 'account',
        color: '#f56c6cbf'
    };
    data.push(rootNode);
    for (let i of row[0].account_children) {
        data.push(addAccountListNode(row, row[i]));
    }
    return data;
}

function addAccountListNode(row, rowNode) {
    let nodeData = {
        id: rowNode.account_id,
        label: rowNode.account_name,
        type: ((rowNode.account_type == 0) ? 'group' : 'account'),
        color: '#f56c6cbf'
    };
    if (rowNode.account_children !== null) {
        let childrenData = [];
        for (let i of rowNode.account_children) {
            childrenData.push(addAccountListNode(row, row[i]));
        }
        nodeData.children = childrenData;
    }
    return nodeData;
}

export {getBilllistDataByAccountId, getBilllistDataById, getAccountListData}


