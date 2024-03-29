import SQL from 'sql-template-strings';
import {loadReadDBFile} from '../index'

// let DBFileSrc = os.homedir().toString() + '\\Roaming\\DemoAPP\\example.db';

async function getBilllistDataByAccountId(accountId) {
    console.log('getBilllistDataByAccountId', accountId);
    let db = await loadReadDBFile();
    accountId = Number(accountId);
    if (Number(accountId) === 0) {
        let data = await db.all(SQL`SELECT * FROM bill_list ORDER BY time ASC`);
        //账户组类型需重算余额
        let sum = 0;
        for (let item of data) {
            sum += item.amount;
            item.balance = sum;
        }
        return data;
    }
    let {type: accountType} = await db.get(SQL`SELECT account_type as type FROM account_list WHERE account_id = ${accountId}`)
    if (accountType === 1) {
        return await db.all(SQL`SELECT * FROM bill_list WHERE account=${accountId} ORDER BY time ASC`);
    } else if (accountType === 0) {
        let data = await db.all(SQL`SELECT bill_list.*
                                FROM bill_list,
                                     (SELECT value as childId
                                      FROM account_list,
                                           json_each(account_children) parent
                                      WHERE account_id = ${accountId}) list
                                WHERE account = (list.childId)
                                ORDER BY time ASC`);
        console.log(data);
        //账户组类型需重算余额
        let sum = 0;
        for (let item of data) {
            sum += item.amount;
            item.balance = sum;
        }
        return data;
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

async function getAccountListDataById(id) {
    id = Number(id);
    console.log(id);
    let db = await loadReadDBFile();
    let data = await db.get(SQL`SELECT account_id as id, account_name as name, account_type as type, account_color as color
                            FROM account_list
                            WHERE account_id = ${id}`);
    if (data.type === 1) {
        ({id: data.group} = await db.get(SQL`SELECT account_id as id
                                            FROM account_list,
                                                 json_each(account_children) parent
                                            WHERE parent.value = ${id}`));
    }
    console.log('getAccountListDataById', data);
    return data;
}

async function getAccountGroup() {
    let db = await loadReadDBFile();
    return await db.all(SQL`SELECT account_id as id, account_name as name FROM account_list WHERE account_type = 0`);
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
                    group by account) bl on account_list.account_id = bl.account`);
    for (let node of rowData) {
        node.account_children = JSON.parse(node.account_children);
    }
    // console.log(rowData, transAccountListData(rowData));
    return transAccountListData(rowData);
}

function transAccountListData(raw) {
    let data = [];
    // let rootNode = {
    //     id: row[0].account_id,
    //     label: row[0].account_name,
    //     type: 'account',
    //     color: '#f56c6cbf'
    // };
    // data.push(rootNode);
    let row = []
    for (let item of raw) {
        row[item.account_id] = item;
    }
    for (let i of row[0].account_children) {
        data.push(addAccountListNode(row, row[i]));
    }
    console.log(data);
    return data;
}

function addAccountListNode(row, rowNode, a = undefined) {
    try {
        let nodeData = {
            id: rowNode.account_id,
            label: rowNode.account_name,
            type: ((rowNode.account_type === 0) ? 'group' : 'account'),
            color: rowNode.account_color,
            balance: rowNode.account_balance
        };
        if (rowNode.account_children !== null) {
            let childrenData = [];
            for (let i of rowNode.account_children) {
                childrenData.push(addAccountListNode(row, row[i], i));
            }
            nodeData.children = childrenData;
        }
        return nodeData;
    } catch (e) {
        console.error(e, row, a);
    }
}

async function getCategoryDataById(id) {
    let db = await loadReadDBFile();
    let query = SQL`SELECT * FROM category_list WHERE category_id = ${id}`;
    let rawData = await db.get(query);
    // console.log(await db.get(`SELECT category_children FROM category_list WHERE category_id=${id}`));
    return {
        id: rawData.category_id,
        name: rawData.category_name,
        color: rawData.category_color,
        icon: rawData.category_icon
    }
}

async function getCategoryList() {
    let db = await loadReadDBFile();
    let query = SQL`SELECT * from category_list order by category_id ASC`;
    let rowData = await db.all(query);
    let data = {};
    for (let item of rowData) {
        data[item.category_id] = {
            id: item.category_id,
            name: item.category_name,
            color: item.category_color,
            icon: item.category_icon
        }
    }
    return data;
}

async function getCategoryListData(type = undefined) {
    let db = await loadReadDBFile();
    let query = SQL`SELECT * from category_list where category_type = ${type} order by category_id ASC`;
    return await db.all(query);
}

async function getCategoryListTree(type) {
    let rowData = await getCategoryListData(type);
    for (let node of rowData) {
        node.category_children = JSON.parse(node.category_children);
    }
    let data = [];
    for (let item of rowData) {
        data[item.category_id] = item;
    }
    console.log(data);
    return transCategoryListData2Tree(data, data[type]);
}

function transCategoryListData2Tree(rowData, rowNode) {
    try {
        let nodeData = {
            id: rowNode.category_id,
            label: rowNode.category_name,
            icon: rowNode.category_icon,
            color: rowNode.category_color
        }
        if (rowNode.category_children !== null) {
            let childrenData = [];
            for (let i of rowNode.category_children) {
                childrenData.push(transCategoryListData2Tree(rowData, rowData[i]));
            }
            nodeData.children = childrenData;
        }
        return nodeData;
    } catch (e) {
        console.error(e, rowNode);
    }
}

async function getBalanceSummary() {
    let db = await loadReadDBFile();
    let date = new Date(), y = date.getFullYear(), m = date.getMonth();
    let monthStart = (new Date(y, m, 1).getTime()) / 1000;
    let {netBalance: netBalance} = await db.get(SQL`SELECT (cast((sum(amount) * 1000) as integer) / 1000.0) as netBalance FROM bill_list`);
    let {monthlyIncome: monthlyIncome} = await db.get(SQL`SELECT (cast((sum(amount) * 1000) as integer) / 1000.0) as monthlyIncome
                                                        FROM bill_list WHERE time >= ${monthStart} and type=0`);
    let {monthlySpending: monthlySpending} = await db.get(SQL`SELECT (cast((sum(amount) * 1000) as integer) / 1000.0) as monthlySpending
                                                        FROM bill_list WHERE time >= ${monthStart} and type=1`);
    console.log('getBalanceSummary:', monthStart, netBalance, monthlyIncome, monthlySpending)
    return [netBalance, monthlyIncome, monthlySpending];
}


export {
    getBilllistDataByAccountId,
    getBilllistDataById,
    getAccountListDataById,
    getAccountListData,
    getAccountGroup,
    getAccountList,
    getCategoryListData,
    getCategoryListTree,
    getCategoryList,
    getCategoryDataById,
    getBalanceSummary
}


