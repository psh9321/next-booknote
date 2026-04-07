/**
 * 통합 테스트 (Integration Tests): API_SYNC_BOOK
 * 로그인 사용자의 로컬 도서를 서버와 동기화하는 Server Action 테스트
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { API_SYNC_BOOK } from "@/features/syncList/api/sync";

vi.mock("@/shared/lib/connectDB", () => ({
    ConnectDB: vi.fn(async (cb: () => Promise<unknown>) => cb()),
}));

vi.mock("@/shared/lib/getSessionId", () => ({
    GetSessionId: vi.fn(),
}));

vi.mock("@/entities/book/model/book.schema", () => ({
    BookModel: {
        findOne: vi.fn(),
    },
}));

vi.mock("@/entities/book/api/book", () => ({
    API_REGISTER_BOOK: vi.fn(),
    API_REGISTER_BOOK_UPDATE: vi.fn(),
}));

import { GetSessionId } from "@/shared/lib/getSessionId";
import { BookModel } from "@/entities/book/model/book.schema";
import { API_REGISTER_BOOK, API_REGISTER_BOOK_UPDATE } from "@/entities/book/api/book";

const mockBooks: Partial<BOOK_MODEL>[] = [
    { bookCode: "isbn-001", bookTitle: "도서1", status: "READ" },
    { bookCode: "isbn-002", bookTitle: "도서2", status: "WISH" },
];

describe("API_SYNC_BOOK", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("인증 검증", () => {
        it("로그인하지 않은 경우 에러를 던져야 한다", async () => {
            (GetSessionId as ReturnType<typeof vi.fn>).mockResolvedValue(null);

            await expect(API_SYNC_BOOK(mockBooks)).rejects.toThrow("로그인이 필요합니다.");
        });

        it("userId가 있을 때 DB 동기화를 진행해야 한다", async () => {
            (GetSessionId as ReturnType<typeof vi.fn>).mockResolvedValue("user-123");
            (BookModel.findOne as ReturnType<typeof vi.fn>).mockResolvedValue(null);
            (API_REGISTER_BOOK as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

            await expect(API_SYNC_BOOK(mockBooks)).resolves.toBeUndefined();
        });
    });

    describe("서버에 도서 정보가 없는 경우 - 신규 등록", () => {
        it("서버에 없는 도서는 API_REGISTER_BOOK을 호출해야 한다", async () => {
            (GetSessionId as ReturnType<typeof vi.fn>).mockResolvedValue("user-123");
            (BookModel.findOne as ReturnType<typeof vi.fn>).mockResolvedValue(null);
            (API_REGISTER_BOOK as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

            await API_SYNC_BOOK(mockBooks);

            expect(API_REGISTER_BOOK).toHaveBeenCalledTimes(2);
            expect(API_REGISTER_BOOK).toHaveBeenCalledWith(mockBooks[0]);
            expect(API_REGISTER_BOOK).toHaveBeenCalledWith(mockBooks[1]);
        });

        it("서버에 없는 도서에 대해 API_REGISTER_BOOK_UPDATE는 호출하지 않아야 한다", async () => {
            (GetSessionId as ReturnType<typeof vi.fn>).mockResolvedValue("user-123");
            (BookModel.findOne as ReturnType<typeof vi.fn>).mockResolvedValue(null);
            (API_REGISTER_BOOK as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

            await API_SYNC_BOOK(mockBooks);

            expect(API_REGISTER_BOOK_UPDATE).not.toHaveBeenCalled();
        });
    });

    describe("서버에 도서 정보가 있는 경우 - 상태 비교 후 업데이트", () => {
        it("서버 status와 로컬 status가 같으면 업데이트하지 않아야 한다", async () => {
            (GetSessionId as ReturnType<typeof vi.fn>).mockResolvedValue("user-123");
            (BookModel.findOne as ReturnType<typeof vi.fn>).mockResolvedValue({
                status: "READ",
            });

            await API_SYNC_BOOK([{ bookCode: "isbn-001", status: "READ" }]);

            expect(API_REGISTER_BOOK_UPDATE).not.toHaveBeenCalled();
            expect(API_REGISTER_BOOK).not.toHaveBeenCalled();
        });

        it("서버 status와 로컬 status가 다르면 API_REGISTER_BOOK_UPDATE를 호출해야 한다", async () => {
            (GetSessionId as ReturnType<typeof vi.fn>).mockResolvedValue("user-123");
            (BookModel.findOne as ReturnType<typeof vi.fn>).mockResolvedValue({
                status: "READ",
            });
            (API_REGISTER_BOOK_UPDATE as ReturnType<typeof vi.fn>).mockResolvedValue(
                undefined,
            );

            await API_SYNC_BOOK([{ bookCode: "isbn-001", status: "COMPLETED" }]);

            expect(API_REGISTER_BOOK_UPDATE).toHaveBeenCalledWith("isbn-001", "COMPLETED");
        });

        it("status가 다를 때 API_REGISTER_BOOK은 호출하지 않아야 한다", async () => {
            (GetSessionId as ReturnType<typeof vi.fn>).mockResolvedValue("user-123");
            (BookModel.findOne as ReturnType<typeof vi.fn>).mockResolvedValue({
                status: "READ",
            });
            (API_REGISTER_BOOK_UPDATE as ReturnType<typeof vi.fn>).mockResolvedValue(
                undefined,
            );

            await API_SYNC_BOOK([{ bookCode: "isbn-001", status: "COMPLETED" }]);

            expect(API_REGISTER_BOOK).not.toHaveBeenCalled();
        });
    });

    describe("복합 시나리오 - 여러 도서 혼합 처리", () => {
        it("서버에 있는 도서와 없는 도서를 각각 올바르게 처리해야 한다", async () => {
            (GetSessionId as ReturnType<typeof vi.fn>).mockResolvedValue("user-123");
            (BookModel.findOne as ReturnType<typeof vi.fn>)
                .mockResolvedValueOnce({ status: "READ" })  // 첫 번째 도서: 서버에 존재, status 동일
                .mockResolvedValueOnce(null);                // 두 번째 도서: 서버에 없음
            (API_REGISTER_BOOK as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

            await API_SYNC_BOOK([
                { bookCode: "isbn-001", status: "READ" },
                { bookCode: "isbn-002", status: "WISH" },
            ]);

            expect(API_REGISTER_BOOK_UPDATE).not.toHaveBeenCalled();
            expect(API_REGISTER_BOOK).toHaveBeenCalledTimes(1);
            expect(API_REGISTER_BOOK).toHaveBeenCalledWith({ bookCode: "isbn-002", status: "WISH" });
        });

        it("빈 배열을 전달하면 아무것도 호출하지 않아야 한다", async () => {
            (GetSessionId as ReturnType<typeof vi.fn>).mockResolvedValue("user-123");

            await API_SYNC_BOOK([]);

            expect(API_REGISTER_BOOK).not.toHaveBeenCalled();
            expect(API_REGISTER_BOOK_UPDATE).not.toHaveBeenCalled();
        });
    });
});
