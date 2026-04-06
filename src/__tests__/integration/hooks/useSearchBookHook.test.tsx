/**
 * 통합 테스트 (Integration Tests): useSearchBookHook
 * 도서 검색 무한 스크롤 쿼리 훅
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import { useSearchBookHook } from "@/features/search-book/hooks/useSearchBookHook";

// API 모킹
vi.mock("@/features/search-book/api/api.search.book", () => ({
    API_CLIENT_GET_SEARCH_BOOK: vi.fn(),
}));

import { API_CLIENT_GET_SEARCH_BOOK } from "@/features/search-book/api/api.search.book";

function createWrapper() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
        },
    });
    return ({ children }: { children: React.ReactNode }) =>
        createElement(QueryClientProvider, { client: queryClient }, children);
}

const mockSearchResult = {
    total: 30,
    page: 1,
    limit: 10,
    keyword: "리액트",
    list: [
        {
            bookTitle: "리액트를 다루는 기술",
            bookCover: "http://example.com/cover1.jpg",
            bookAuther: "김민준",
            bookPublisher: "길벗",
            bookCode: "9788966262595",
        },
        {
            bookTitle: "모던 리액트 Deep Dive",
            bookCover: "http://example.com/cover2.jpg",
            bookAuther: "김용찬",
            bookPublisher: "위키북스",
            bookCode: "9791158394646",
        },
    ],
};

describe("useSearchBookHook", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("enabled 조건", () => {
        it("keyword가 빈 문자열이면 쿼리가 실행되지 않아야 한다", () => {
            const { result } = renderHook(
                () => useSearchBookHook(""),
                { wrapper: createWrapper() },
            );

            expect(result.current.isLoading).toBe(false);
            expect(API_CLIENT_GET_SEARCH_BOOK).not.toHaveBeenCalled();
        });

        it("keyword가 공백만 있으면 쿼리가 실행되지 않아야 한다", () => {
            const { result } = renderHook(
                () => useSearchBookHook("   "),
                { wrapper: createWrapper() },
            );

            expect(result.current.isLoading).toBe(false);
            expect(API_CLIENT_GET_SEARCH_BOOK).not.toHaveBeenCalled();
        });

        it("유효한 keyword가 있으면 쿼리가 실행되어야 한다", async () => {
            (
                API_CLIENT_GET_SEARCH_BOOK as ReturnType<typeof vi.fn>
            ).mockResolvedValue(mockSearchResult);

            const { result } = renderHook(
                () => useSearchBookHook("리액트"),
                { wrapper: createWrapper() },
            );

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(API_CLIENT_GET_SEARCH_BOOK).toHaveBeenCalledWith(
                "리액트",
                1,
                10,
            );
        });
    });

    describe("데이터 로딩", () => {
        it("검색 결과를 pages 형태로 반환해야 한다", async () => {
            (
                API_CLIENT_GET_SEARCH_BOOK as ReturnType<typeof vi.fn>
            ).mockResolvedValue(mockSearchResult);

            const { result } = renderHook(
                () => useSearchBookHook("리액트"),
                { wrapper: createWrapper() },
            );

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.data?.pages[0]).toEqual(mockSearchResult);
            expect(result.current.data?.pages[0].list).toHaveLength(2);
        });

        it("API 에러 발생 시 isError가 true여야 한다", async () => {
            (
                API_CLIENT_GET_SEARCH_BOOK as ReturnType<typeof vi.fn>
            ).mockRejectedValue(new Error("검색 실패"));

            const { result } = renderHook(
                () => useSearchBookHook("리액트"),
                { wrapper: createWrapper() },
            );

            await waitFor(() => expect(result.current.isError).toBe(true));
        });
    });

    describe("다음 페이지 파라미터 계산", () => {
        it("마지막 페이지면 hasNextPage가 false여야 한다", async () => {
            // total=10, limit=10 → totalPage=1, page=1 → page < totalPage (1 < 1) false
            const lastPageResult = {
                ...mockSearchResult,
                total: 10,
                page: 1,
                limit: 10,
            };
            (
                API_CLIENT_GET_SEARCH_BOOK as ReturnType<typeof vi.fn>
            ).mockResolvedValue(lastPageResult);

            const { result } = renderHook(
                () => useSearchBookHook("리액트"),
                { wrapper: createWrapper() },
            );

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.hasNextPage).toBe(false);
        });

        it("다음 페이지가 있으면 hasNextPage가 true여야 한다", async () => {
            // total=30, limit=10 → totalPage=3, page=1 → page < totalPage (1 < 3) true
            (
                API_CLIENT_GET_SEARCH_BOOK as ReturnType<typeof vi.fn>
            ).mockResolvedValue(mockSearchResult);

            const { result } = renderHook(
                () => useSearchBookHook("리액트"),
                { wrapper: createWrapper() },
            );

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.hasNextPage).toBe(true);
        });

        it("total이 0이면 hasNextPage가 false여야 한다", async () => {
            const emptyResult = { ...mockSearchResult, total: 0, list: [] };
            (
                API_CLIENT_GET_SEARCH_BOOK as ReturnType<typeof vi.fn>
            ).mockResolvedValue(emptyResult);

            const { result } = renderHook(
                () => useSearchBookHook("없는책"),
                { wrapper: createWrapper() },
            );

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.hasNextPage).toBe(false);
        });
    });

    describe("반환값 구조", () => {
        it("필요한 모든 프로퍼티를 반환해야 한다", () => {
            (
                API_CLIENT_GET_SEARCH_BOOK as ReturnType<typeof vi.fn>
            ).mockResolvedValue(mockSearchResult);

            const { result } = renderHook(
                () => useSearchBookHook("리액트"),
                { wrapper: createWrapper() },
            );

            expect(result.current).toHaveProperty("data");
            expect(result.current).toHaveProperty("isLoading");
            expect(result.current).toHaveProperty("isFetching");
            expect(result.current).toHaveProperty("isError");
            expect(result.current).toHaveProperty("isSuccess");
            expect(result.current).toHaveProperty("fetchNextPage");
            expect(result.current).toHaveProperty("hasNextPage");
        });
    });
});
