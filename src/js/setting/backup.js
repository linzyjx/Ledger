import {dialog} from 'electron';
import fs from 'fs';
import os from "os";
import path from "path";
import {DBFileSrc} from '../db/index'
import sqlite from "sqlite";
import sqlite3 from "sqlite3";

const desktopSrc = path.resolve(os.homedir(), 'Desktop');

function exportDBFile(e) {
    let defaultFileSrc = path.resolve(desktopSrc, `backup_${dateFormat(new Date(), 'yyyy-MM-dd-hh-mm-ss')}.db`);
    let filePath = dialog.showSaveDialogSync({
        defaultPath: defaultFileSrc,
        title: '导出',
        buttonLabel: '导出'
    });
    if (filePath !== undefined) {
        fs.copyFile(DBFileSrc, filePath, (err) => {
            if (err) {
                console.log('copy error: ', err);
                e.sender.send('exportFallback',
                    {
                        message: '数据导出失败',
                        type: 'error'
                    });
                throw err;
            }
            console.log('copy success');
            e.sender.send('exportFallback',
                {
                    message: '导出数据成功！',
                    type: 'success'
                }
            );
        });
    } else {
        e.sender.send('exportFallback',
            {
                message: '取消导出操作',
                type: 'warning'
            }
        );
    }

}

function importDBFile(e) {
    let filePath = dialog.showOpenDialogSync({
        defaultPath: DBFileSrc,
        title: '导入',
        buttonLabel: '导入'
    })[0];

    console.log(filePath);
    checkDBFile(filePath).then((v) => {
        if (v) {
            console.log('checkDBFile ok');
            fs.copyFile(filePath, DBFileSrc, (err) => {
                if (err) {
                    console.log('copy error: ', err);
                    e.sender.send('importFallback',
                        {
                            message: '数据导入失败：无法写入文件',
                            type: 'error'
                        });
                }
                console.log('copy success');
                e.sender.send('importFallback',
                    {
                        message: '导入数据成功！',
                        type: 'success'
                    }
                );
            });
        }
    }).catch(e => {
        console.error('checkDBFileError', e);
        e.sender.send('importFallback',
            {
                message: '导入的数据库检查不通过！',
                type: 'error'
            }
        );
    });
}

function dateFormat(date, fmt) {
    let o = {
        "M+": date.getMonth() + 1,                 //月份
        "d+": date.getDate(),                    //日
        "h+": date.getHours(),                   //小时
        "m+": date.getMinutes(),                 //分
        "s+": date.getSeconds(),                 //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (let k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}


async function checkDBFile(src) {
    let db = await loadReadDBFile(src);
    let result = await db.get('PRAGMA integrity_check');
    console.log(result);
    if (result.integrity_check === 'ok') {
        console.log('OK');
        return true;
    } else {
        console.error('DBFileCheckError');
        await Promise.reject(new Error('DBFileCheckError'));
    }
}

async function loadReadDBFile(src) {
    return await sqlite.open(src, {
        mode: sqlite3.OPEN_READONLY
    }).catch(e => {
        console.error(e, src);
        throw e;
    });
}

export {exportDBFile, importDBFile};
