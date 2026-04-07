/**
 * 통합 테스트 (Integration Tests): useIndexedDBHook
 * IndexedDB CRUD 훅 - idb를 in-memory 구현으로 모킹하여 로직 검증
 *
 * fake-indexeddb + idb + vitest 환경 간 호환 이슈를 우회하기 위해
 * idb 모듈 자체를 간단한 Map 기반 in-memory DB로 모킹한다.
 */

// env 설정 및 store 생성 - vi.mock factory보다 먼저 실행되어야 한다.
const { store } = vi.hoisted(() => {
    process.env.NEXT_PUBLIC_INDEXED_DB_NAME = "test-db";
    process.env.NEXT_PUBLIC_INDEXED_DB_VERSION = "1";
    const store = new Map<string, Record<string, unknown>>();
    return { store };
});

vi.mock("idb", () => ({
    openDB: async () => ({
        get: async (_: string, key: string) => store.get(key) ?? undefined,
        getAll: async (_: string) => Array.from(store.values()),
        put: async (_: string, value: Record<string, unknown>) => {
            const key = value["bookTitle"] as string;
            store.set(key, value);
            return key;
        },
        delete: async (_: string, key: string) => {
            store.delete(key);
        },
    }),
}));

import { describe, it, expect, beforeEach, vi } from "vitest";
import { useIndexedDBHook } from "@/shared/hooks/useIndexedDB";

let mockBook: Partial<BOOK_MODEL>;

describe("useIndexedDBHook", () => {
    beforeEach(() => {
        store.clear();
        // BookUpdate 훅이 item 파라미터를 직접 변경하므로 매 테스트마다 새 객체를 사용한다.
        mockBook = {
            bookTitle: "테스트 도서",
            bookCode: "isbn-001",
            bookCover: "https://example.com/cover.jpg",
            status: "READ",
        };
    });

    describe("BookAdd - 도서 추가", () => {
        it("새 도서를 DB에 추가할 수 있어야 한다", async () => {
            const { BookAdd, GetTargetBookStatus } = useIndexedDBHook();

            await BookAdd(mockBook, "테스트 도서");

            const status = await GetTargetBookStatus("테스트 도서");
            expect(status).toBe("READ");
        });

        it("userId 없이 추가하면 sync 배열이 빈 배열이어야 한다", async () => {
            const { BookAdd, GetBookList } = useIndexedDBHook();

            await BookAdd(mockBook, "테스트 도서");

            const list = await GetBookList("READ");
            expect(list[0].sync).toEqual([]);
        });

        it("userId와 함께 추가하면 sync 배열에 userId가 포함되어야 한다", async () => {
            const { BookAdd, GetBookList } = useIndexedDBHook();

            await BookAdd(mockBook, "테스트 도서", "user-123");

            const list = await GetBookList("READ");
            expect(list[0].sync).toContain("user-123");
        });

        it("이미 존재하는 도서에 userId를 추가하면 sync에 userId가 추가되어야 한다", async () => {
            const { BookAdd, GetBookList } = useIndexedDBHook();

            await BookAdd(mockBook, "테스트 도서");
            await BookAdd(mockBook, "테스트 도서", "user-123");

            const list = await GetBookList("READ");
            expect(list[0].sync).toContain("user-123");
        });

        it("동일한 userId를 두 번 추가해도 sync 배열에 중복이 없어야 한다", async () => {
            const { BookAdd, GetBookList } = useIndexedDBHook();

            await BookAdd(mockBook, "테스트 도서", "user-123");
            await BookAdd(mockBook, "테스트 도서", "user-123");

            const list = await GetBookList("READ");
            const syncArr = list[0].sync as string[];
            expect(syncArr.filter((id) => id === "user-123").length).toBe(1);
        });

        it("createAt 필드가 KST ISO 형식으로 저장되어야 한다", async () => {
            const { BookAdd, GetBookList } = useIndexedDBHook();

            await BookAdd(mockBook, "테스트 도서");

            const list = await GetBookList("READ");
            expect(list[0].createAt).toMatch(/\+09:00$/);
        });
    });

    describe("BookUpdate - 도서 상태 수정", () => {
        it("기존 도서의 status를 변경할 수 있어야 한다", async () => {
            const { BookAdd, BookUpdate, GetTargetBookStatus } = useIndexedDBHook();

            await BookAdd(mockBook, "테스트 도서");
            await BookUpdate(mockBook, "COMPLETED");

            const status = await GetTargetBookStatus("테스트 도서");
            expect(status).toBe("COMPLETED");
        });

        it("존재하지 않는 도서는 새로 생성되어야 한다", async () => {
            const { BookUpdate, GetTargetBookStatus } = useIndexedDBHook();

            await BookUpdate(mockBook, "WISH");

            const status = await GetTargetBookStatus("테스트 도서");
            expect(status).toBe("WISH");
        });

        it("존재하지 않는 도서 생성 시 userId가 있으면 sync에 포함되어야 한다", async () => {
            const { BookUpdate, GetBookList } = useIndexedDBHook();

            await BookUpdate(mockBook, "WISH", "user-123");

            const list = await GetBookList("WISH");
            expect(list[0].sync).toContain("user-123");
        });

        it("존재하지 않는 도서 생성 시 updateAt 필드가 저장되어야 한다", async () => {
            const { BookUpdate, GetBookList } = useIndexedDBHook();

            await BookUpdate(mockBook, "WISH");

            const list = await GetBookList("WISH");
            expect(list[0].updateAt).toBeDefined();
        });
    });

    describe("GetTargetBookStatus - 도서 상태 조회", () => {
        it("존재하지 않는 도서 조회 시 빈 문자열을 반환해야 한다", async () => {
            const { GetTargetBookStatus } = useIndexedDBHook();

            const status = await GetTargetBookStatus("없는 도서");
            expect(status).toBe("");
        });

        it("존재하는 도서의 status를 반환해야 한다", async () => {
            const { BookAdd, GetTargetBookStatus } = useIndexedDBHook();

            await BookAdd({ ...mockBook, status: "COMPLETED" }, "테스트 도서");

            const status = await GetTargetBookStatus("테스트 도서");
            expect(status).toBe("COMPLETED");
        });
    });

    describe("GetBookList - 상태별 도서 목록 조회", () => {
        it("빈 DB에서는 빈 배열을 반환해야 한다", async () => {
            const { GetBookList } = useIndexedDBHook();

            const list = await GetBookList("READ");
            expect(list).toEqual([]);
        });

        it("해당 status의 도서만 필터링하여 반환해야 한다", async () => {
            const { BookAdd, GetBookList } = useIndexedDBHook();

            await BookAdd({ ...mockBook, bookTitle: "READ 도서", status: "READ" }, "READ 도서");
            await BookAdd({ ...mockBook, bookTitle: "WISH 도서", status: "WISH" }, "WISH 도서");

            const readList = await GetBookList("READ");
            const wishList = await GetBookList("WISH");

            expect(readList.length).toBe(1);
            expect(readList[0].bookTitle).toBe("READ 도서");
            expect(wishList.length).toBe(1);
            expect(wishList[0].bookTitle).toBe("WISH 도서");
        });

        it("같은 status의 도서가 여러 개면 모두 반환해야 한다", async () => {
            const { BookAdd, GetBookList } = useIndexedDBHook();

            await BookAdd({ ...mockBook, bookTitle: "도서1", status: "READ" }, "도서1");
            await BookAdd({ ...mockBook, bookTitle: "도서2", status: "READ" }, "도서2");
            await BookAdd({ ...mockBook, bookTitle: "도서3", status: "READ" }, "도서3");

            const list = await GetBookList("READ");
            expect(list.length).toBe(3);
        });
    });

    describe("AfterLoginBookDelete - 로그인 후 도서 삭제 (sync에서 userId 제거)", () => {
        it("sync 배열에서 해당 userId를 제거해야 한다", async () => {
            const { BookAdd, AfterLoginBookDelete, GetBookList } = useIndexedDBHook();

            await BookAdd(mockBook, "테스트 도서", "user-123");
            await AfterLoginBookDelete("테스트 도서", "user-123");

            const list = await GetBookList("READ");
            expect(list[0].sync).not.toContain("user-123");
        });

        it("존재하지 않는 도서에 대해 에러 없이 종료되어야 한다", async () => {
            const { AfterLoginBookDelete } = useIndexedDBHook();

            await expect(
                AfterLoginBookDelete("없는 도서", "user-123"),
            ).resolves.toBeUndefined();
        });

        it("다른 userId는 sync에 남아 있어야 한다", async () => {
            const { BookAdd, AfterLoginBookDelete, GetBookList } = useIndexedDBHook();

            await BookAdd(mockBook, "테스트 도서", "user-111");
            await BookAdd(mockBook, "테스트 도서", "user-222");
            await AfterLoginBookDelete("테스트 도서", "user-111");

            const list = await GetBookList("READ");
            expect(list.length).toBe(1);
            const sync = list[0].sync as string[];
            expect(sync).not.toContain("user-111");
            expect(sync).toContain("user-222");
        });
    });

    describe("BeforeLoginBookDelete - 비로그인 도서 삭제", () => {
        it("도서를 DB에서 완전히 삭제해야 한다", async () => {
            const { BookAdd, BeforeLoginBookDelete, GetTargetBookStatus } =
                useIndexedDBHook();

            await BookAdd(mockBook, "테스트 도서");
            await BeforeLoginBookDelete("테스트 도서");

            const status = await GetTargetBookStatus("테스트 도서");
            expect(status).toBe("");
        });

        it("삭제 후 해당 status 목록에서 제거되어야 한다", async () => {
            const { BookAdd, BeforeLoginBookDelete, GetBookList } = useIndexedDBHook();

            await BookAdd(mockBook, "테스트 도서");
            await BeforeLoginBookDelete("테스트 도서");

            const list = await GetBookList("READ");
            expect(list.length).toBe(0);
        });
    });

    describe("SyncBookData - 동기화 (userId를 sync 배열에 추가)", () => {
        it("bookTitleArr에 포함된 도서의 sync에 userId를 추가해야 한다", async () => {
            const { BookAdd, SyncBookData, GetBookList } = useIndexedDBHook();

            await BookAdd(mockBook, "테스트 도서");
            await SyncBookData(["테스트 도서"], "user-123", "READ");

            const list = await GetBookList("READ");
            expect(list.length).toBe(1);
            expect(list[0].sync).toContain("user-123");
        });

        it("이미 sync된 userId는 중복 추가하지 않아야 한다", async () => {
            const { BookAdd, SyncBookData, GetBookList } = useIndexedDBHook();

            await BookAdd(mockBook, "테스트 도서", "user-123");
            await SyncBookData(["테스트 도서"], "user-123", "READ");

            const list = await GetBookList("READ");
            const sync = list[0].sync as string[];
            expect(sync.filter((id) => id === "user-123").length).toBe(1);
        });

        it("bookTitleArr에 없는 도서는 sync되지 않아야 한다", async () => {
            const { BookAdd, SyncBookData, GetBookList } = useIndexedDBHook();

            await BookAdd(mockBook, "테스트 도서");
            await SyncBookData(["다른 도서"], "user-123", "READ");

            const list = await GetBookList("READ");
            expect(list.length).toBe(1);
            expect(list[0].sync).not.toContain("user-123");
        });

        it("다른 status의 도서는 sync되지 않아야 한다", async () => {
            const { BookAdd, SyncBookData, GetBookList } = useIndexedDBHook();

            await BookAdd({ ...mockBook, status: "WISH" }, "테스트 도서");
            await SyncBookData(["테스트 도서"], "user-123", "READ");

            const list = await GetBookList("WISH");
            expect(list.length).toBe(1);
            expect(list[0].sync).not.toContain("user-123");
        });

        it("여러 도서를 한 번에 sync할 수 있어야 한다", async () => {
            const { BookAdd, SyncBookData, GetBookList } = useIndexedDBHook();

            await BookAdd({ ...mockBook, bookTitle: "도서A", status: "READ" }, "도서A");
            await BookAdd({ ...mockBook, bookTitle: "도서B", status: "READ" }, "도서B");
            await SyncBookData(["도서A", "도서B"], "user-123", "READ");

            const list = await GetBookList("READ");
            expect(list.length).toBe(2);
            list.forEach((item) => {
                expect(item.sync).toContain("user-123");
            });
        });
    });
});
