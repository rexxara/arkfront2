import { IState } from './gameTypes'
import { DisplayCharacters, selectedBGM } from '../../utils/types'
import { message } from 'antd'
interface DBModel {
    name: string,
    version: number,
    db?: IDBDatabase,
    objectStore: {
        name: string,
        key: string
    }
}
let saveData: DBModel = {
    name: 'saveData',
    version: 1,
    objectStore: {
        name: 'saveData',//quickSave
        key: 'id'//主键
    }
}
let scenceData: DBModel = {
    name: 'scenceData',
    version: 1,
    objectStore: {
        name: 'scenceData',
        key: 'id'//主键
    }
}
let galleryData: DBModel = {
    name: 'galleryData',
    version: 1,
    objectStore: {
        name: 'galleryData',
        key: 'id'
    }
}
const INDEXDB = {
    indexedDB: window.indexedDB,
    IDBKeyRange: window.IDBKeyRange,
    openDB: (dbModel: DBModel): Promise<boolean> => {
        const { name } = dbModel
        return new Promise((res, rej) => {
            let version = 1
            let request = indexedDB.open(name, version)
            request.onerror = function (e) {
                rej('error on Open database')
            };
            request.onsuccess = function (e) {
                dbModel.db = request.result
                //console.log('成功建立并打开数据库:' + dbModel.name + ' version' + dbModel.version)
                res(true)
            }
            request.onupgradeneeded = function (e) {
                const db = request.result
                if (!db.objectStoreNames.contains(dbModel.objectStore.name)) {
                    db.createObjectStore(dbModel.objectStore.name, { keyPath: 'id', autoIncrement: true })
                    //console.log('成功建立对象存储空间：' + dbModel.objectStore.name)
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
            request.onsuccess = () => res(true)
        })
    },
    loadAll: function (db: IDBDatabase, storename: string, key?: number): Promise<any[]> {
        return new Promise((res, rej) => {
            let store = db.transaction(storename, 'readwrite').objectStore(storename);
            let request = store.getAll()
            request.onerror = function () {
                rej()
            };
            request.onsuccess = function (e: any) {
                res(request.result)

            };
        })
    },
    getDataByKey: function (db: IDBDatabase, storename: string, key: number): Promise<SaveData> {
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

export interface SaveData {
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
    id?: number,
    stop: boolean
    inputKey?: string,
    effectKey: string
}
const modifyToBeSaveData = (state: IState, id: number | string): SaveData => {
    const { auto, displayName, background, linePointer, displaycharacters, rawLine, stop, bgm, cg, clickDisable, choose, gameVariables, currentChapter, input, effectKey } = state
    let dataTobeSaved: SaveData = {
        auto, displayName, effectKey, displayText: rawLine, background, linePointer, displaycharacters, stop, bgm, cg, clickDisable, gameVariables, currentChapterName: currentChapter.name,
        isNextChoose: undefined,
        chooseKey: '',
        inputKey: input.id
    }
    if (typeof id === 'number') {
        dataTobeSaved.id = id
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
    console.log(dataTobeSaved)
    return dataTobeSaved
}
INDEXDB.openDB(saveData)
INDEXDB.openDB(galleryData)
INDEXDB.openDB(scenceData)
const actions = {
    skipThisLine: () => message.info('skipThisLine'),
    save: async (state: IState, id: number | string) => {
        const openSuccess = await INDEXDB.openDB(saveData)
        if (openSuccess && saveData.db) {
            const saveSuccess = await INDEXDB.putData(saveData.db, saveData.objectStore.name, modifyToBeSaveData(state, id))
            console.log(saveSuccess)
            if (saveSuccess) {
                message.success("保存成功")
            }
        } else {
            console.log('databaseNotFound')
        }
    },
    load: async (key: number) => {
        const openSuccess = await INDEXDB.openDB(saveData)
        if (openSuccess && saveData.db) {
            return await INDEXDB.getDataByKey(saveData.db, saveData.objectStore.name, key)
        }
    },
    loadAll: async () => {
        const openSuccess = await INDEXDB.openDB(saveData)
        if (openSuccess && saveData.db) {
            return await INDEXDB.loadAll(saveData.db, saveData.objectStore.name) || []
        }
    },
    unlockCg: async (cgKey: string) => {
        const openSuccess = await INDEXDB.openDB(galleryData)
        if (openSuccess && galleryData.db) {
            const saveSuccess = await INDEXDB.putData(galleryData.db, galleryData.objectStore.name, { id: cgKey })
        } else {
            console.log('databaseNotFound')
        }
    },
    getCgUnlockData: async () => {
        const openSuccess = await INDEXDB.openDB(galleryData)
        if (openSuccess && galleryData.db) {
            return await INDEXDB.loadAll(galleryData.db, galleryData.objectStore.name) || []
        }
    },
    unlockScence: async (name: string) => {
        const openSuccess = await INDEXDB.openDB(scenceData)
        if (openSuccess && scenceData.db) {
            const saveSuccess = await INDEXDB.putData(scenceData.db, scenceData.objectStore.name, { id: name })
        } else {
            console.log('databaseNotFound')
        }
    },
    getScenceUnlockData: async (): Promise<Array<{ id: string }>> => {
        const openSuccess = await INDEXDB.openDB(scenceData)
        if (openSuccess && scenceData.db) {
            return await INDEXDB.loadAll(scenceData.db, scenceData.objectStore.name) || []
        } else {
            return []
        }
    },
}
export default actions