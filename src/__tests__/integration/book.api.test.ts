/**
 * 통합 테스트 (Integration Tests): Book API
 * 도서 등록/조회/수정/삭제 서버 액션
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// vi.hoisted로 모킹 객체를 호이스팅 전에 선언
const mockBookModel = vi.hoisted(() => ({
    find: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    updateOne: vi.fn(),
    deleteOne: vi.fn(),
    countDocuments: vi.fn(),
}));

// next/cache 모킹
vi.mock("next/cache", () => ({
    revalidatePath: vi.fn(),
}));

// next-auth 모킹
vi.mock("next-auth/next", () => ({
    getServerSession: vi.fn(),
}));

// auth 모킹
vi.mock("@/auth", () => ({
    authOptions: {},
}));

// ConnectDB 모킹
vi.mock("@/shared/lib/connectDB", () => ({
    ConnectDB: vi.fn(async (fn: () => Promise<unknown>) => fn()),
}));

vi.mock("@/entities/book/model/book.schema", () => ({
    BookModel: mockBookModel,
    BookSchema: {},
}));

import { getServerSession } from "next-auth/next";
import { revalidatePath } from "next/cache";
import {
    API_GET_LATEST_ADD_BOOK,
    API_REGISTER_BOOK,
    API_REGISTER_BOOK_UPDATE,
    API_REGISTER_BOOK_DELETE,
    API_CHECK_REGISTER_BOOK,
    API_GET_MY_BOOK,
} from "@/entities/book/api/book";

describe("Book API", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("API_GET_LATEST_ADD_BOOK", () => {
        it("최신 도서 3권을 반환해야 한다", async () => {
            const mockBooks = [
                { bookTitle: "책1", bookCode: "123", status: "READ" },
                { bookTitle: "책2", bookCode: "456", status: "WISH" },
                { bookTitle: "책3", bookCode: "789", status: "COMPLETED" },
            ];

            mockBookModel.find.mockReturnValue({
                sort: vi.fn().mockReturnValue({
                    limit: vi.fn().mockResolvedValue(mockBooks),
                }),
            });

            const result = await API_GET_LATEST_ADD_BOOK();

            expect(mockBookModel.find).toHaveBeenCalled();
            expect(result).toHaveLength(3);
        });

        it("DB 에러 발생 시 에러를 던져야 한다", async () => {
            mockBookModel.find.mockReturnValue({
                sort: vi.fn().mockReturnValue({
                    limit: vi.fn().mockRejectedValue(new Error("DB 에러")),
                }),
            });

            await expect(API_GET_LATEST_ADD_BOOK()).rejects.toThrow("DB 에러");
        });
    });

    describe("API_REGISTER_BOOK", () => {
        it("로그인하지 않은 경우 에러를 던져야 한다", async () => {
            (getServerSession as ReturnType<typeof vi.fn>).mockResolvedValue(
                null,
            );

            const mockBook = { bookTitle: "테스트 책" } as any;

            await expect(API_REGISTER_BOOK(mockBook)).rejects.toThrow(
                "로그인이 필요합니다.",
            );
        });

        it("로그인한 경우 도서를 등록해야 한다", async () => {
            (getServerSession as ReturnType<typeof vi.fn>).mockResolvedValue({
                user: { id: "user123" },
            });
            mockBookModel.create.mockResolvedValue({});

            const mockBook = {
                bookTitle: "테스트 책",
                bookCode: "isbn123",
            } as any;

            await API_REGISTER_BOOK(mockBook);

            expect(mockBookModel.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    bookTitle: "테스트 책",
                    userId: "user123",
                }),
            );
        });

        it("도서 등록 후 revalidatePath를 호출해야 한다", async () => {
            (getServerSession as ReturnType<typeof vi.fn>).mockResolvedValue({
                user: { id: "user123" },
            });
            mockBookModel.create.mockResolvedValue({});

            await API_REGISTER_BOOK({ bookTitle: "책" } as any);

            expect(revalidatePath).toHaveBeenCalledWith("/");
            expect(revalidatePath).toHaveBeenCalledWith(
                "/book/[bookcode]",
                "page",
            );
        });
    });

    describe("API_REGISTER_BOOK_UPDATE", () => {
        it("로그인하지 않은 경우 에러를 던져야 한다", async () => {
            (getServerSession as ReturnType<typeof vi.fn>).mockResolvedValue(
                null,
            );

            await expect(
                API_REGISTER_BOOK_UPDATE("isbn123", "READ"),
            ).rejects.toThrow("로그인이 필요합니다.");
        });

        it("도서 상태를 업데이트해야 한다", async () => {
            (getServerSession as ReturnType<typeof vi.fn>).mockResolvedValue({
                user: { id: "user123" },
            });
            mockBookModel.updateOne.mockResolvedValue({ modifiedCount: 1 });

            await API_REGISTER_BOOK_UPDATE("isbn123", "COMPLETED");

            expect(mockBookModel.updateOne).toHaveBeenCalledWith(
                { userId: "user123", bookCode: "isbn123" },
                expect.objectContaining({
                    $set: expect.objectContaining({ status: "COMPLETED" }),
                }),
            );
        });
    });

    describe("API_REGISTER_BOOK_DELETE", () => {
        it("로그인하지 않은 경우 에러를 던져야 한다", async () => {
            (getServerSession as ReturnType<typeof vi.fn>).mockResolvedValue(
                null,
            );

            await expect(
                API_REGISTER_BOOK_DELETE("isbn123"),
            ).rejects.toThrow("로그인이 필요합니다.");
        });

        it("도서를 삭제해야 한다", async () => {
            (getServerSession as ReturnType<typeof vi.fn>).mockResolvedValue({
                user: { id: "user123" },
            });
            mockBookModel.deleteOne.mockResolvedValue({ deletedCount: 1 });

            await API_REGISTER_BOOK_DELETE("isbn123");

            expect(mockBookModel.deleteOne).toHaveBeenCalledWith({
                userId: "user123",
                bookCode: "isbn123",
            });
        });
    });

    describe("API_CHECK_REGISTER_BOOK", () => {
        it("등록된 책이 있으면 status를 반환해야 한다", async () => {
            mockBookModel.findOne.mockResolvedValue({ status: "READ" });

            const result = await API_CHECK_REGISTER_BOOK("user123", "isbn123");

            expect(result).toBe("READ");
        });

        it("등록된 책이 없으면 빈 문자열을 반환해야 한다", async () => {
            mockBookModel.findOne.mockResolvedValue(null);

            const result = await API_CHECK_REGISTER_BOOK("user123", "isbn123");

            expect(result).toBe("");
        });

        it("올바른 userId와 bookCode로 조회해야 한다", async () => {
            mockBookModel.findOne.mockResolvedValue(null);

            await API_CHECK_REGISTER_BOOK("testUser", "testIsbn");

            expect(mockBookModel.findOne).toHaveBeenCalledWith({
                userId: "testUser",
                bookCode: "testIsbn",
            });
        });
    });

    describe("API_GET_MY_BOOK", () => {
        it("페이지네이션된 도서 목록을 반환해야 한다", async () => {
            const mockBooks = [
                { bookTitle: "책1", status: "READ" },
                { bookTitle: "책2", status: "READ" },
            ];
            mockBookModel.countDocuments.mockResolvedValue(2);
            mockBookModel.find.mockReturnValue({
                sort: vi.fn().mockReturnValue({
                    skip: vi.fn().mockReturnValue({
                        limit: vi.fn().mockResolvedValue(mockBooks),
                    }),
                }),
            });

            const result = await API_GET_MY_BOOK("user123", 0, "READ");

            expect(result).toMatchObject({
                total: 2,
                page: 0,
                limit: 20,
                list: mockBooks,
            });
        });

        it("조회 조건에 userId와 status가 포함되어야 한다", async () => {
            mockBookModel.countDocuments.mockResolvedValue(0);
            mockBookModel.find.mockReturnValue({
                sort: vi.fn().mockReturnValue({
                    skip: vi.fn().mockReturnValue({
                        limit: vi.fn().mockResolvedValue([]),
                    }),
                }),
            });

            await API_GET_MY_BOOK("user456", 0, "WISH");

            expect(mockBookModel.countDocuments).toHaveBeenCalledWith({
                userId: "user456",
                status: "WISH",
            });
            expect(mockBookModel.find).toHaveBeenCalledWith({
                userId: "user456",
                status: "WISH",
            });
        });

        it("offset에 따라 skip이 계산되어야 한다", async () => {
            mockBookModel.countDocuments.mockResolvedValue(40);
            const mockSort = vi.fn();
            const mockSkip = vi.fn();
            const mockLimit = vi.fn().mockResolvedValue([]);
            mockSkip.mockReturnValue({ limit: mockLimit });
            mockSort.mockReturnValue({ skip: mockSkip });
            mockBookModel.find.mockReturnValue({ sort: mockSort });

            await API_GET_MY_BOOK("user123", 1, "READ", 20);

            // offset=1, limit=20 이면 skip(1*20) = skip(20)
            expect(mockSkip).toHaveBeenCalledWith(20);
        });
    });
});
