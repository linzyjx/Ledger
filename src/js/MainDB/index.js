import SQL from 'sql-template-strings';
import sqlite from 'sqlite';
import sqlite3 from 'sqlite3';
import os from 'os';
import path from 'path';
// import ro from "element-ui/src/locale/lang/ro";

// let DBFileSrc = os.homedir().toString() + '\\Roaming\\DemoAPP\\example.db';
const DBFileSrc = path.resolve(os.homedir(), 'AppData', 'Roaming', 'DemoAPP', 'example.db');

async function loadDBFile() {
    return await sqlite.open(DBFileSrc, {}).catch(e => {
        console.error(e, DBFileSrc);
    });
}

async function updateDetailItem(id, changeData) {
    let db = await loadDBFile();
    console.log('get', id, changeData);
    let query = SQL`UPDATE bill_list SET `;
    let firstFlag = false;
    for (let item of Object.keys(changeData)) {
        // console.log(item,changeData[item]);
        query.append(firstFlag ? ',' : '').append(item).append(SQL`=${changeData[item]} `);
        firstFlag = true
    }
    query.append(SQL`WHERE id=${id}`);
    console.log(await db.run(query));
}

export {updateDetailItem}


