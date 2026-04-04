
import { openDB, IDBPDatabase } from "idb";
import { useCallback } from "react";

function GenerateId(): string {
    return `${Date.now()}-${crypto.randomUUID()}`;
}

function DateNow(): string {
    return new Date().toISOString();
}


const DB_NAME = String(process.env.NEXT_PUBLIC_INDEXED_DB_NAME);
const VERSION = Number(process.env.NEXT_PUBLIC_INDEXED_DB_VERSION);

export const useIndexedDBHook = () => {

    function GetDB(): Promise<IDBPDatabase> {
        return openDB(DB_NAME, VERSION, {
            upgrade(db) {
                if (!db.objectStoreNames.contains("book")) {
                    db.createObjectStore("book", { keyPath: "_id" });
                }
                // if (!db.objectStoreNames.contains("booknote")) {
                //     const noteStore = db.createObjectStore("booknote", { keyPath: "_id" });
                //     noteStore.createIndex("recordId", "recordId");
                // }
            },
        });
    }

    const GetReadBook = useCallback(async () => {
        const db = await GetDB();
        const all = await db.getAll("book");
        return all.filter((item) => item.status === "READ");
    }, []);

    const GetLatestWishBook = useCallback(async () => {
        const db = await GetDB();
        const all = await db.getAll("book");
        return all.filter((item) => item.status === "WISH").slice(0,2)??[];
    },[])

    async function AddBook(item : ALADIN.ALADIN_ITEM) {

        const db = await GetDB();

        const obj = {
            _id: "69ce36ae86a862b5f6a918b4",
            bookTitle: "환상서점 2 - 긴 밤이 될 겁니다",
            bookCover: "https://image.aladin.co.kr/product/36771/84/cover150/k502030590_1.jpg",
            bookCode: "K502030590",
            bookAuthor : "소서림 (지은이)",
            bookPublisher : "해피북스투유",
            bookCategory: "국내도서>소설/시/희곡>판타지/환상문학>한국판타지/환상소설",
            status : "WISH",
            startDate : "2026-02-03T09:12:46.302Z",
            endDate : "",
            currentPage : null,
            totalPage : 312,
            createAt : "2026-01-22T14:00:00.000Z",
            updateAt : "2026-01-22T14:00:00.000Z",
        }

        const transtion = db.transaction(["book"], "readwrite");
        const store = transtion.objectStore("book");

        await store.put(obj);
    }

    return { AddBook, GetReadBook, GetLatestWishBook }
}