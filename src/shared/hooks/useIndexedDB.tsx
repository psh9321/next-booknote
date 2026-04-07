"use client"

import { openDB, IDBPDatabase } from "idb";

const DB_NAME = String(process.env.NEXT_PUBLIC_INDEXED_DB_NAME);
const VERSION = Number(process.env.NEXT_PUBLIC_INDEXED_DB_VERSION);

function KSTISOString(date: Date = new Date()): string {
    const KST_OFFSET = 9 * 60 * 60 * 1000;
    return new Date(date.getTime() + KST_OFFSET).toISOString().replace("Z", "+09:00");
}

export const useIndexedDBHook = () => {

    function GetDB(): Promise<IDBPDatabase> {
        return openDB(DB_NAME, Number(VERSION??1), {
            upgrade(db) {
                if (db.objectStoreNames.contains("book")) {
                    db.deleteObjectStore("book");
                }
                db.createObjectStore("book", { keyPath: "bookTitle" });
            },
        });
    }

    async function GetTargetBookStatus(bookTitle : string) {
        const db = await GetDB();
        const bookInfo = await db.get("book", bookTitle);

        return bookInfo?.["status"]??""
    }

    async function GetBookList(status : READING_STATUS) {
        const db = await GetDB();
        const all = await db.getAll("book");

        return all.filter(item => item.status === status)??[];
    }

    async function BookAdd(item: Partial<BOOK_MODEL>, bookTitle : string, userId?: string) {
        const db = await GetDB();

        const existing = await db.get("book", bookTitle);

        if (existing) {
            if (userId) {
                const sync: string[] = existing.sync ?? [];
                if (!sync.includes(userId)) {
                    sync.push(userId);
                }
                await db.put("book", { 
                    ...existing, 
                    createAt : KSTISOString(),
                    sync 
                });
            }
        } else {
            await db.put("book", {
                ...item,
                createAt : KSTISOString(),
                sync: userId ? [userId] : [],
            });
        }
    }

    async function BookUpdate(item : Partial<BOOK_MODEL>, status : READING_STATUS, userId? : string) {
        const db = await GetDB();
        const existing = await db.get("book", item["bookTitle"]!);

        /** 기존에 데이터가 있는 경우 */
        if(existing) {
            existing.status = status;

            await db.put("book", existing);
        }
        else {
            item["status"] = status;

            await db.put("book", {
                ...item,
                updateAt : KSTISOString(),
                sync: userId ? [userId] : [],
            });
        }
    }

    async function AfterLoginBookDelete(bookTitle : string, userId : string) {
        const db = await GetDB();
        
        const existing = await db.get("book", bookTitle);

        if (!existing) return;

        const sync = (existing["sync"] as string[]).filter(el => el !== userId);

        await db.put("book", { ...existing, sync });
    }

    async function BeforeLoginBookDelete(bookTitle : string) {
        const db = await GetDB();
        await db.delete("book", bookTitle);
    }

    async function SyncBookData(bookTitleArr : string[], userId : string, status : READING_STATUS) {
        const db = await GetDB();
        const all = await db.getAll("book");

        for(const item of all) {
            if(item["status"] !== status) continue;
            if(!bookTitleArr.includes(item["bookTitle"])) continue;

            const sync: string[] = item["sync"] ?? [];

            if(sync.includes(userId)) continue;

            sync.push(userId);

            await db.put("book", { ...item, sync });
        }

    }

    return { BookAdd, GetTargetBookStatus, BookUpdate, AfterLoginBookDelete, BeforeLoginBookDelete, GetBookList, SyncBookData }
}
