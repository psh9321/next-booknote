/**
 * 통합 테스트 (Integration Tests): useMyBookNoteHook
 * 내 독서 노트 무한 스크롤 쿼리 훅
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import { useMyBookNoteHook } from "@/features/book-note/hooks/useMyBookNoteHook";

// API 모킹
vi.mock("@/entities/book-note/api/booknote", () => ({
    API_GET_MY_BOOK_NOTE: vi.fn(),
}));

import { API_GET_MY_BOOK_NOTE } from "@/entities/book-note/api/booknote";

function createWrapper() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
        },
    });
    return ({ children }: { children: React.ReactNode }) =>
        createElement(QueryClientProvider, { client: queryClient }, children);
}

const mockNoteList = {
    total: 3,
    page: 0,
    limit: 20,
    list: [
        {
            _id: "note1",
            userId: "user123",
            bookCode: "isbn123",
            noteContents: "첫 번째 노트 내용",
            createAt: "2024-01-01T00:00:00.000Z",
        },
        {
            _id: "note2",
            userId: "user123",
            bookCode: "isbn123",
            noteContents: "두 번째 노트 내용",
            createAt: "2024-01-02T00:00:00.000Z",
        },
    ],
};

describe("useMyBookNoteHook", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("enabled 조건", () => {
        it("userId가 빈 문자열이면 쿼리가 실행되지 않아야 한다", () => {
            const { result } = renderHook(
                () => useMyBookNoteHook("", "isbn123"),
                { wrapper: createWrapper() },
            );

            expect(result.current.isLoading).toBe(false);
            expect(API_GET_MY_BOOK_NOTE).not.toHaveBeenCalled();
        });

        it("userId가 있으면 쿼리가 실행되어야 한다", async () => {
            (
                API_GET_MY_BOOK_NOTE as ReturnType<typeof vi.fn>
            ).mockResolvedValue(mockNoteList);

            const { result } = renderHook(
                () => useMyBookNoteHook("user123", "isbn123"),
                { wrapper: createWrapper() },
            );

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(API_GET_MY_BOOK_NOTE).toHaveBeenCalledWith(
                "user123",
                "isbn123",
                0,
            );
        });
    });

    describe("데이터 로딩", () => {
        it("노트 목록을 pages 형태로 반환해야 한다", async () => {
            (
                API_GET_MY_BOOK_NOTE as ReturnType<typeof vi.fn>
            ).mockResolvedValue(mockNoteList);

            const { result } = renderHook(
                () => useMyBookNoteHook("user123", "isbn123"),
                { wrapper: createWrapper() },
            );

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.data?.pages[0]).toEqual(mockNoteList);
            expect(result.current.data?.pages[0].list).toHaveLength(2);
        });

        it("API 에러 발생 시 isError가 true여야 한다", async () => {
            (
                API_GET_MY_BOOK_NOTE as ReturnType<typeof vi.fn>
            ).mockRejectedValue(new Error("노트 조회 실패"));

            const { result } = renderHook(
                () => useMyBookNoteHook("user123", "isbn123"),
                { wrapper: createWrapper() },
            );

            await waitFor(() => expect(result.current.isError).toBe(true));
        });
    });

    describe("다음 페이지 파라미터 계산", () => {
        it("전체 노트가 1페이지면 hasNextPage가 false여야 한다", async () => {
            // total=3, limit=20 → totalPage=1, page=0 → page < totalPage-1 (0 < 0) false
            (
                API_GET_MY_BOOK_NOTE as ReturnType<typeof vi.fn>
            ).mockResolvedValue(mockNoteList);

            const { result } = renderHook(
                () => useMyBookNoteHook("user123", "isbn123"),
                { wrapper: createWrapper() },
            );

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.hasNextPage).toBe(false);
        });

        it("다음 페이지가 있으면 hasNextPage가 true여야 한다", async () => {
            // total=45, limit=20 → totalPage=3, page=0 → page < totalPage-1 (0 < 2) true
            const multiPageResult = { ...mockNoteList, total: 45 };
            (
                API_GET_MY_BOOK_NOTE as ReturnType<typeof vi.fn>
            ).mockResolvedValue(multiPageResult);

            const { result } = renderHook(
                () => useMyBookNoteHook("user123", "isbn123"),
                { wrapper: createWrapper() },
            );

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.hasNextPage).toBe(true);
        });

        it("total이 0이면 hasNextPage가 false여야 한다", async () => {
            const emptyResult = { ...mockNoteList, total: 0, list: [] };
            (
                API_GET_MY_BOOK_NOTE as ReturnType<typeof vi.fn>
            ).mockResolvedValue(emptyResult);

            const { result } = renderHook(
                () => useMyBookNoteHook("user123", "isbn123"),
                { wrapper: createWrapper() },
            );

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.hasNextPage).toBe(false);
        });
    });

    describe("반환값 구조", () => {
        it("refetch 함수를 포함한 모든 프로퍼티를 반환해야 한다", () => {
            (
                API_GET_MY_BOOK_NOTE as ReturnType<typeof vi.fn>
            ).mockResolvedValue(mockNoteList);

            const { result } = renderHook(
                () => useMyBookNoteHook("user123", "isbn123"),
                { wrapper: createWrapper() },
            );

            expect(result.current).toHaveProperty("data");
            expect(result.current).toHaveProperty("isLoading");
            expect(result.current).toHaveProperty("isFetching");
            expect(result.current).toHaveProperty("isError");
            expect(result.current).toHaveProperty("isSuccess");
            expect(result.current).toHaveProperty("fetchNextPage");
            expect(result.current).toHaveProperty("hasNextPage");
            expect(result.current).toHaveProperty("refetch");
            expect(typeof result.current.refetch).toBe("function");
        });
    });
});
