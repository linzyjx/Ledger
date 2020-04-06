import SQL from 'sql-template-strings';
import {loadReadDBFile} from '../index'

// let DBFileSrc = os.homedir().toString() + '\\Roaming\\DemoAPP\\example.db';

async function getBilllistDataByAccountId(accountId) {
    let db = await loadReadDBFile();
    if (Number(accountId) === 0) {
        return await db.all(SQL`SELECT * FROM bill_list ORDER BY time ASC`);
    } else {
        return await db.all(SQL`SELECT * FROM bill_list WHERE account=${accountId} ORDER BY time ASC`);
    }

}

async function getBilllistDataById(id) {
    let db = await loadReadDBFile();
    let data = (await db.all(SQL`SELECT * FROM bill_list WHERE id=${id}`))[0];
    if (data.type === 2) {
        // console.log((await db.get(SQL`SELECT * FROM bill_list WHERE id=${data.id}`)));
        data.transfer_deal_account = (await db.get(SQL`SELECT account FROM bill_list WHERE id=${data.transfer_deal}`)).account;
    }
    return data;
}

async function getAccountList() {
    let db = await loadReadDBFile();
    let rowData = await db.all(SQL`SELECT account_id as id, account_name as name FROM account_list WHERE account_type = 1`);
    let output = {};
    for (let item of rowData) {
        output[item.id] = {id: item.id, name: item.name};
    }
    return output;
}

async function getAccountListData() {
    let db = await loadReadDBFile();
    let rowData = await db.all(SQL`SELECT account_list.*, ifnull(bl.balance, 0) as account_balance
FROM account_list
         LEFT JOIN (select account, (cast((sum(amount) * 1000) as integer) / 1000.0) as balance
                    from bill_list
                    group by account) bl on account_list.account_id = bl.account;`);
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
        color: '#f56c6cbf',
        balance: rowNode.account_balance
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

export {getBilllistDataByAccountId, getBilllistDataById, getAccountListData, getAccountList}


