import message from '../AMessage/index'
import { IState } from './MainGame'
import _omit from 'lodash/omit'

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
    openDB: function (dbname: string, dbversion: number, callback?: Function) {
        //建立或打开数据库，建立对象存储空间(ObjectStore)
        let self = this;
        let version = dbversion || 1;
        let request = self.indexedDB.open(dbname, version);
        request.onerror = function (e) {
            console.error('error on Open database')
        };
        request.onsuccess = function (e) {
            dataBase.db = request.result

            console.log('成功建立并打开数据库:' + dataBase.name + ' version' + dbversion);
            if (callback) {
                callback()
            }
        };
        request.onupgradeneeded = function (e) {
            let db = request.result
            let transaction = request.transaction
            let store
            if (!db.objectStoreNames.contains(dataBase.objectStore.name)) {
                //没有该对象空间时创建该对象空间
                store = db.createObjectStore(dataBase.objectStore.name, { keyPath: 'quickSave' })
                console.log('成功建立对象存储空间：' + dataBase.objectStore.name);
            }
        }

    },
    deletedb: function (dbname: string) {
        //删除数据库
        let self = this;
        self.indexedDB.deleteDatabase(dbname);
        console.log(dbname + '数据库已删除')
    },
    closeDB: function (db: IDBDatabase) {
        //关闭数据库
        db.close();
        console.log('数据库已关闭')
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
    putData: function (db: IDBDatabase, storename: string, data: any) {
        //添加数据，重复添加会更新原有数据
        let store = db.transaction(storename, 'readwrite').objectStore(storename), request;
        request = store.put(data)
        request.onerror = function () {
            console.error('put添加数据库中已有该数据')
        };
        request.onsuccess = function () {
            console.log('put添加数据已存入数据库')
        };
    },
    getDataByKey: function (db: IDBDatabase, storename: string, key: any) {
        let store = db.transaction(storename, 'readwrite').objectStore(storename);
        let request = store.get(key)
        request.onerror = function () {
            console.error('getDataByKey error');
        };
        request.onsuccess = function (e: any) {
            console.log('查找数据成功')
            console.log(request.result)
        };
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

const iniState = {
    auto: false,//
    displayText: '',//动态
    displayName: '',
    cacheDisplayLineText: '',//
    cacheDisplayLineName: '',//
    background: '',
    timers: undefined,//
    linePointer: 0,
    displaycharacters: {},
    rawLine: '',
    stop: false,
    bgm: { name: '', src: '' },
    cg: '',
    preloadJSX: undefined,//
    clickDisable: false,
    choose: [],
    currentChapter: {
        line: [],
        name: '',
        next: '',
        preLoadCgs: {},
        preLoadBackgrounds: {},
        preLoadCharaters: {}
    },
    gamevariables: {}
}
const actions = {
    skipThisLine: () => message.info('skipThisLine'),
    save: (state: IState): boolean => {
        const { auto, displayName, background, linePointer, displaycharacters, rawLine, stop, bgm, cg, clickDisable, choose, gameVariables, currentChapter } = state
        const dataTobeSaved = {
            quickSave: 1,
            auto, displayName, displayText: rawLine, background, linePointer, displaycharacters, stop, bgm, cg, clickDisable, choose, gameVariables, currentChapterName: currentChapter.name
        }
        console.log(dataTobeSaved)
        INDEXDB.openDB(dataBase.name, dataBase.version, () => {
            if (dataBase.db) {
                INDEXDB.putData(dataBase.db, dataBase.objectStore.name, dataTobeSaved)
            }
        })
        return true
    },
    load: () => {
        console.log('123')
        INDEXDB.openDB(dataBase.name, dataBase.version, () => {
            if (dataBase.db) {
                INDEXDB.getDataByKey(dataBase.db, dataBase.objectStore.name, 1)
            }
        })
        return iniState
    }
}
export default actions