import message from '../AMessage/index'
import { IState } from './MainGame'
import { LINE_TYPE, DisplayLine, CommandLine, NO_IMG, DisplayCharacters, selectedBGM, LoadedChapterModel3, Option, RawScript, GameModel3 } from '../../utils/types'
interface DBModel {
    name: string,
    version: number,
    db?: IDBDatabase,
    objectStore: {
        name: string,
        key: string
    }
}
const dataBase: DBModel = {
    name: 'saveData',
    version: 1,
    objectStore: {
        name: 'saveData',//存储空间表的名字
        key: 'id'//主键
    }
}

const INDEXDB = {
    indexedDB: window.indexedDB,
    IDBKeyRange: window.IDBKeyRange,
    openDB: (dbname: string, dbversion: number, callback?: Function): Promise<boolean> => {
        return new Promise((res, rej) => {
            let version = dbversion || 1;
            let request = indexedDB.open(dbname, version)
            request.onerror = function (e) {
                rej('error on Open database')
            };
            request.onsuccess = function (e) {
                dataBase.db = request.result
                console.log('成功建立并打开数据库:' + dataBase.name + ' version' + dbversion)
                res(true)
            }
            request.onupgradeneeded = function (e) {
                let db = request.result
                let store
                if (!db.objectStoreNames.contains(dataBase.objectStore.name)) {
                    store = db.createObjectStore(dataBase.objectStore.name, { keyPath: 'quickSave' })
                    console.log('成功建立对象存储空间：' + dataBase.objectStore.name)
                }
                res(true)
            }
        })

    },
    deletedb: function (dbname: string) {
        let self = this;
        self.indexedDB.deleteDatabase(dbname);
    },
    closeDB: function (db: IDBDatabase) {
        db.close();
    },
    addData: function (db: IDBDatabase, storename: string, data: any) {
        //添加数据，重复添加会报错
        let store = db.transaction(storename, 'readwrite').objectStore(storename), request;
        request = store.add(data);
        request.onerror = function () {
            console.error('add添加数据库中已有该数据')
        };
        request.onsuccess = function () {
            console.log('add添加数据已存入数据库')
        };

    },
    putData: function (db: IDBDatabase, storename: string, data: any): Promise<boolean> {
        return new Promise((res, rej) => {
            let store = db.transaction(storename, 'readwrite').objectStore(storename), request;
            request = store.put(data)
            request.onerror = () => rej(false)
            request.onsuccess = () => res(false)
        })
    },
    getDataByKey: function (db: IDBDatabase, storename: string, key: any): Promise<SaveData> {
        return new Promise((res, rej) => {
            let store = db.transaction(storename, 'readwrite').objectStore(storename);
            let request = store.get(key)
            request.onerror = function () {
                rej()
            };
            request.onsuccess = function (e: any) {
                res(request.result)
            };
        })
    },
    deleteData: function (db: IDBDatabase, storename: string, key: string) {
        //删除某一条记录
        let store = db.transaction(storename, 'readwrite').objectStore(storename);
        store.delete(key)
        console.log('已删除存储空间' + storename + '中' + key + '记录');
    },
    clearData: function (db: IDBDatabase, storename: string) {
        //删除存储空间全部记录
        let store = db.transaction(storename, 'readwrite').objectStore(storename);
        store.clear();
        console.log('已删除存储空间' + storename + '全部记录');
    }
}

interface SaveData {
    auto: boolean,
    background: string,
    bgm: selectedBGM,
    cg: string,
    chooseKey?: string,
    isNextChoose?: true,
    clickDisable: boolean,
    currentChapterName: string,
    displayName: string,
    displayText: string,
    displaycharacters: DisplayCharacters,
    gameVariables: any,
    linePointer: number,
    quickSave: 1,
    stop: boolean
}

const actions = {
    skipThisLine: () => message.info('skipThisLine'),
    save: async (state: IState) => {
        const { auto, displayName, background, linePointer, displaycharacters, rawLine, stop, bgm, cg, clickDisable, choose, gameVariables, currentChapter } = state
        console.log(choose)
        let dataTobeSaved: SaveData = {
            quickSave: 1,
            auto, displayName, displayText: rawLine, background, linePointer, displaycharacters, stop, bgm, cg, clickDisable, gameVariables, currentChapterName: currentChapter.name
        }
        if (choose[1]) {
            if (!choose[1].chooseKey) {
                dataTobeSaved.isNextChoose = true
            } else {
                dataTobeSaved.chooseKey = choose[1].chooseKey
            }
        } else {
            console.log('没有选择')
        }
        const openSuccess = await INDEXDB.openDB(dataBase.name, dataBase.version)
        if (openSuccess && dataBase.db) {
            const saveSuccess = await INDEXDB.putData(dataBase.db, dataBase.objectStore.name, dataTobeSaved)
            console.log(saveSuccess)
        }
    },
    load: async () => {
        const openSuccess = await INDEXDB.openDB(dataBase.name, dataBase.version)
        if (openSuccess && dataBase.db) {
            return await INDEXDB.getDataByKey(dataBase.db, dataBase.objectStore.name, 1)
        }
    }
}
export default actions