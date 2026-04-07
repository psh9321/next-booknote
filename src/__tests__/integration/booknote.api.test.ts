/**
 * 통합 테스트 (Integration Tests): BookNote API
 * 독서 노트 생성/조회/수정/삭제 서버 액션
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// vi.hoisted로 모킹 객체를 호이스팅 전에 선언
const { mockBookNoteModel, mockBookModel } = vi.hoisted(() => ({
    mockBookNoteModel: {
        find: vi.fn(),
        create: vi.fn(),
        updateOne: vi.fn(),
        deleteOne: vi.fn(),
        countDocuments: vi.fn(),
    },
    mockBookModel: {
        findOne: vi.fn(),
    },
}));

// ConnectDB 모킹
vi.mock("@/shared/lib/connectDB", () => ({
    ConnectDB: vi.fn(async (fn: () => Promise<unknown>) => fn()),
}));

vi.mock("@/entities/book-note/model/booknote.schema", () => ({
    BookNoteModel: mockBookNoteModel,
    BookNoteSchema: {},
}));

vi.mock("@/entities/book/model/book.schema", () => ({
    BookModel: mockBookModel,
}));

import {
    API_LATEST_BOOK_NOTE,
    API_GET_MY_BOOK_NOTE,
    API_UPDATE_MY_BOOK_NOTE,
    API_DELETE_MY_BOOK_NOTE,
    API_ADD_MY_BOOK_NOTE,
} from "@/entities/book-note/api/booknote";

describe("BookNote API", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("API_LATEST_BOOK_NOTE", () => {
        it("최신 노트 5개를 반환해야 한다", async () => {
            const mockNotes = Array.from({ length: 5 }, (_, i) => ({
                _id: `note${i}`,
                noteContents: `노트 내용 ${i}`,
                userId: "user123",
            }));

            mockBookNoteModel.find.mockReturnValue({
                sort: vi.fn().mockReturnValue({
                    limit: vi.fn().mockResolvedValue(mockNotes),
                }),
            });

            const result = await API_LATEST_BOOK_NOTE("user123");

            expect(result).toHaveLength(5);
        });

        it("userId로 필터링하여 조회해야 한다", async () => {
            mockBookNoteModel.find.mockReturnValue({
                sort: vi.fn().mockReturnValue({
                    limit: vi.fn().mockResolvedValue([]),
                }),
            });

            await API_LATEST_BOOK_NOTE("specificUser");

            expect(mockBookNoteModel.find).toHaveBeenCalledWith({
                userId: "specificUser",
            });
        });

        it("최신순(createAt 내림차순)으로 정렬해야 한다", async () => {
            const mockSort = vi.fn().mockReturnValue({
                limit: vi.fn().mockResolvedValue([]),
            });
            mockBookNoteModel.find.mockReturnValue({ sort: mockSort });

            await API_LATEST_BOOK_NOTE("user123");

            expect(mockSort).toHaveBeenCalledWith({ createAt: -1 });
        });

        it("DB 에러 발생 시 에러를 던져야 한다", async () => {
            mockBookNoteModel.find.mockReturnValue({
                sort: vi.fn().mockReturnValue({
                    limit: vi.fn().mockRejectedValue(new Error("DB 에러")),
                }),
            });

            await expect(API_LATEST_BOOK_NOTE("user123")).rejects.toThrow(
                "DB 에러",
            );
        });
    });

    describe("API_GET_MY_BOOK_NOTE", () => {
        it("페이지네이션된 노트 목록을 반환해야 한다", async () => {
            const mockNotes = [
                { _id: "note1", noteContents: "첫 번째 노트" },
                { _id: "note2", noteContents: "두 번째 노트" },
            ];
            mockBookNoteModel.countDocuments.mockResolvedValue(2);
            mockBookNoteModel.find.mockReturnValue({
                sort: vi.fn().mockReturnValue({
                    skip: vi.fn().mockReturnValue({
                        limit: vi.fn().mockResolvedValue(mockNotes),
                    }),
                }),
            });

            const result = await API_GET_MY_BOOK_NOTE("user123", "isbn123", 0);

            expect(result).toMatchObject({
                total: 2,
                page: 0,
                limit: 20,
                list: mockNotes,
            });
        });

        it("userId와 bookCode로 필터링해야 한다", async () => {
            mockBookNoteModel.countDocuments.mockResolvedValue(0);
            mockBookNoteModel.find.mockReturnValue({
                sort: vi.fn().mockReturnValue({
                    skip: vi.fn().mockReturnValue({
                        limit: vi.fn().mockResolvedValue([]),
                    }),
                }),
            });

            await API_GET_MY_BOOK_NOTE("user456", "isbn789", 0);

            expect(mockBookNoteModel.countDocuments).toHaveBeenCalledWith({
                userId: "user456",
                bookCode: "isbn789",
            });
        });
    });

    describe("API_UPDATE_MY_BOOK_NOTE", () => {
        it("노트 내용을 업데이트해야 한다", async () => {
            mockBookNoteModel.updateOne.mockResolvedValue({ modifiedCount: 1 });

            await API_UPDATE_MY_BOOK_NOTE(
                "user123",
                "noteId123",
                "수정된 노트 내용",
            );

            expect(mockBookNoteModel.updateOne).toHaveBeenCalledWith(
                { userId: "user123", _id: "noteId123" },
                expect.objectContaining({
                    $set: expect.objectContaining({
                        noteContents: "수정된 노트 내용",
                    }),
                }),
            );
        });

        it("updateAt이 업데이트되어야 한다", async () => {
            mockBookNoteModel.updateOne.mockResolvedValue({ modifiedCount: 1 });

            await API_UPDATE_MY_BOOK_NOTE("user123", "noteId123", "내용");

            const updateCall = mockBookNoteModel.updateOne.mock.calls[0];
            const updateObj = updateCall[1];
            expect(updateObj.$set).toHaveProperty("updateAt");
            expect(updateObj.$set.updateAt).toBeInstanceOf(Date);
        });

        it("DB 에러 발생 시 에러를 던져야 한다", async () => {
            mockBookNoteModel.updateOne.mockRejectedValue(
                new Error("업데이트 실패"),
            );

            await expect(
                API_UPDATE_MY_BOOK_NOTE("user123", "noteId123", "내용"),
            ).rejects.toThrow("업데이트 실패");
        });
    });

    describe("API_DELETE_MY_BOOK_NOTE", () => {
        it("노트를 삭제해야 한다", async () => {
            mockBookNoteModel.deleteOne.mockResolvedValue({ deletedCount: 1 });

            await API_DELETE_MY_BOOK_NOTE("user123", "noteId123");

            expect(mockBookNoteModel.deleteOne).toHaveBeenCalledWith({
                userId: "user123",
                _id: "noteId123",
            });
        });

        it("DB 에러 발생 시 에러를 던져야 한다", async () => {
            mockBookNoteModel.deleteOne.mockRejectedValue(
                new Error("삭제 실패"),
            );

            await expect(
                API_DELETE_MY_BOOK_NOTE("user123", "noteId123"),
            ).rejects.toThrow("삭제 실패");
        });
    });

    describe("API_ADD_MY_BOOK_NOTE", () => {
        it("새 노트를 생성해야 한다", async () => {
            const newNote = {
                userId: "user123",
                bookCode: "isbn123",
                bookTitle: "테스트 책",
                noteContents: "노트 내용",
            };
            mockBookModel.findOne.mockResolvedValue({ bookCode: "isbn123" });
            mockBookNoteModel.create.mockResolvedValue(newNote);

            await API_ADD_MY_BOOK_NOTE(newNote);

            expect(mockBookNoteModel.create).toHaveBeenCalledWith(
                expect.objectContaining(newNote),
            );
        });

        it("도서 정보가 없으면 403을 반환해야 한다", async () => {
            mockBookModel.findOne.mockResolvedValue(null);

            const result = await API_ADD_MY_BOOK_NOTE({ userId: "user123", bookCode: "isbn999" });

            expect(result).toBe(403);
            expect(mockBookNoteModel.create).not.toHaveBeenCalled();
        });

        it("부분 데이터로도 노트를 생성할 수 있어야 한다", async () => {
            const partialNote = { userId: "user123", noteContents: "내용" };
            mockBookModel.findOne.mockResolvedValue({ bookCode: "isbn123" });
            mockBookNoteModel.create.mockResolvedValue(partialNote);

            await API_ADD_MY_BOOK_NOTE(partialNote);

            expect(mockBookNoteModel.create).toHaveBeenCalled();
        });

        it("DB 에러 발생 시 에러를 던져야 한다", async () => {
            mockBookModel.findOne.mockResolvedValue({ bookCode: "isbn123" });
            mockBookNoteModel.create.mockRejectedValue(new Error("생성 실패"));

            await expect(
                API_ADD_MY_BOOK_NOTE({ userId: "user123" }),
            ).rejects.toThrow("생성 실패");
        });
    });
});
