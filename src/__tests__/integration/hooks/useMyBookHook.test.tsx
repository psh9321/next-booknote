/**
 * 통합 테스트 (Integration Tests): useMyBookHook
 * 내 도서 목록 무한 스크롤 쿼리 훅
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import { useMyBookHook } from "@/features/my-book/hooks/useMyBookHook";

// API 모킹
vi.mock("@/entities/book/api/book", () => ({
    API_GET_MY_BOOK: vi.fn(),
}));

import { API_GET_MY_BOOK } from "@/entities/book/api/book";

function createWrapper() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
        },
    });
    return ({ children }: { children: React.ReactNode }) =>
        createElement(QueryClientProvider, { client: queryClient }, children);
}

describe("useMyBookHook", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("enabled 조건", () => {
        it("userId가 빈 문자열이면 쿼리가 실행되지 않아야 한다", async () => {
            const { result } = renderHook(
                () => useMyBookHook("", "READ"),
                { wrapper: createWrapper() },
            );

            // enabled=false 이므로 loading이 아니라 pending 상태
            expect(result.current.isLoading).toBe(false);
            expect(API_GET_MY_BOOK).not.toHaveBeenCalled();
        });

        it("userId가 있으면 쿼리가 실행되어야 한다", async () => {
            const mockResponse = {
                total: 2,
                page: 0,
                limit: 20,
                list: [
                    { bookTitle: "책1", bookCode: "isbn1", status: "READ" },
                    { bookTitle: "책2", bookCode: "isbn2", status: "READ" },
                ],
            };
            (API_GET_MY_BOOK as ReturnType<typeof vi.fn>).mockResolvedValue(
                mockResponse,
            );

            const { result } = renderHook(
                () => useMyBookHook("user123", "READ"),
                { wrapper: createWrapper() },
            );

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(API_GET_MY_BOOK).toHaveBeenCalledWith("user123", 0, "READ");
        });
    });

    describe("데이터 로딩", () => {
        it("도서 목록을 pages 형태로 반환해야 한다", async () => {
            const mockResponse = {
                total: 3,
                page: 0,
                limit: 20,
                list: [
                    { bookTitle: "책1" },
                    { bookTitle: "책2" },
                    { bookTitle: "책3" },
                ],
            };
            (API_GET_MY_BOOK as ReturnType<typeof vi.fn>).mockResolvedValue(
                mockResponse,
            );

            const { result } = renderHook(
                () => useMyBookHook("user123", "READ"),
                { wrapper: createWrapper() },
            );

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.data?.pages[0]).toEqual(mockResponse);
        });

        it("API 에러 발생 시 isError가 true여야 한다", async () => {
            (API_GET_MY_BOOK as ReturnType<typeof vi.fn>).mockRejectedValue(
                new Error("API 에러"),
            );

            const { result } = renderHook(
                () => useMyBookHook("user123", "READ"),
                { wrapper: createWrapper() },
            );

            await waitFor(() => expect(result.current.isError).toBe(true));
        });
    });

    describe("다음 페이지 파라미터 계산", () => {
        it("전체 페이지가 1페이지면 hasNextPage가 false여야 한다", async () => {
            // total=5, limit=20 → totalPage=1, page=0 → page < totalPage-1 (0 < 0) false
            const mockResponse = { total: 5, page: 0, limit: 20, list: [] };
            (API_GET_MY_BOOK as ReturnType<typeof vi.fn>).mockResolvedValue(
                mockResponse,
            );

            const { result } = renderHook(
                () => useMyBookHook("user123", "READ"),
                { wrapper: createWrapper() },
            );

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.hasNextPage).toBe(false);
        });

        it("다음 페이지가 있으면 hasNextPage가 true여야 한다", async () => {
            // total=25, limit=20 → totalPage=2, page=0 → page < totalPage-1 (0 < 1) true
            const mockResponse = { total: 25, page: 0, limit: 20, list: [] };
            (API_GET_MY_BOOK as ReturnType<typeof vi.fn>).mockResolvedValue(
                mockResponse,
            );

            const { result } = renderHook(
                () => useMyBookHook("user123", "READ"),
                { wrapper: createWrapper() },
            );

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.hasNextPage).toBe(true);
        });

        it("total이 0이면 hasNextPage가 false여야 한다", async () => {
            const mockResponse = { total: 0, page: 0, limit: 20, list: [] };
            (API_GET_MY_BOOK as ReturnType<typeof vi.fn>).mockResolvedValue(
                mockResponse,
            );

            const { result } = renderHook(
                () => useMyBookHook("user123", "READ"),
                { wrapper: createWrapper() },
            );

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.hasNextPage).toBe(false);
        });
    });

    describe("반환값 구조", () => {
        it("필요한 모든 프로퍼티를 반환해야 한다", () => {
            (API_GET_MY_BOOK as ReturnType<typeof vi.fn>).mockResolvedValue({
                total: 0,
                page: 0,
                limit: 20,
                list: [],
            });

            const { result } = renderHook(
                () => useMyBookHook("user123", "READ"),
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
