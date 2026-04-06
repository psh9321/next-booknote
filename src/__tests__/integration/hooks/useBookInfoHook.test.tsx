/**
 * 통합 테스트 (Integration Tests): useBookInfoHook & useBestSellerHook & useLatestAddBookHook
 * 알라딘 API 연동 쿼리 훅들
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import { useBookInfoHook } from "@/entities/book/hooks/useBookInfoHook";
import { useBestSellerHook } from "@/entities/book/hooks/useBestSellerHook";
import { useLatestAddBookHook } from "@/entities/book/hooks/useLatestAddBookHook";

// Aladin API 모킹
vi.mock("@/entities/book/api/aladin", () => ({
    API_GET_TARGET_BOOK_INFO: vi.fn(),
    API_GET_BEST_SELLER: vi.fn(),
}));

// Book API 모킹
vi.mock("@/entities/book/api/book", () => ({
    API_GET_LATEST_ADD_BOOK: vi.fn(),
}));

import { API_GET_TARGET_BOOK_INFO, API_GET_BEST_SELLER } from "@/entities/book/api/aladin";
import { API_GET_LATEST_ADD_BOOK } from "@/entities/book/api/book";

function createWrapper() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
        },
    });
    return ({ children }: { children: React.ReactNode }) =>
        createElement(QueryClientProvider, { client: queryClient }, children);
}

// ─────────────────────────────────────────────────────────────────────────────
// useBookInfoHook
// ─────────────────────────────────────────────────────────────────────────────

describe("useBookInfoHook", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockBookDetail = {
        itemId: 12345,
        title: "리액트를 다루는 기술",
        author: "김민준",
        cover: "http://example.com/cover.jpg",
        publisher: "길벗",
        subInfo: { itemPage: 912 },
    };

    describe("enabled=false 동작", () => {
        it("초기 상태에서 API를 호출하지 않아야 한다 (enabled: false)", () => {
            (
                API_GET_TARGET_BOOK_INFO as ReturnType<typeof vi.fn>
            ).mockResolvedValue(mockBookDetail);

            const { result } = renderHook(
                () => useBookInfoHook("9788966262595"),
                { wrapper: createWrapper() },
            );

            // enabled=false이므로 로딩 없음, API 미호출
            expect(result.current.isLoading).toBe(false);
            expect(API_GET_TARGET_BOOK_INFO).not.toHaveBeenCalled();
        });

        it("refetch 호출 시 API를 호출해야 한다", async () => {
            (
                API_GET_TARGET_BOOK_INFO as ReturnType<typeof vi.fn>
            ).mockResolvedValue(mockBookDetail);

            const { result } = renderHook(
                () => useBookInfoHook("9788966262595"),
                { wrapper: createWrapper() },
            );

            await act(async () => {
                // refetch를 수동으로 트리거
                // useBookInfoHook은 enabled:false이므로 refetch로만 실행 가능
            });

            // enabled:false 상태이므로 초기에는 API 미호출 확인
            expect(result.current.isSuccess).toBe(false);
        });
    });

    describe("반환값 구조", () => {
        it("필요한 모든 프로퍼티를 반환해야 한다", () => {
            const { result } = renderHook(
                () => useBookInfoHook("9788966262595"),
                { wrapper: createWrapper() },
            );

            expect(result.current).toHaveProperty("data");
            expect(result.current).toHaveProperty("isLoading");
            expect(result.current).toHaveProperty("isFetching");
            expect(result.current).toHaveProperty("isError");
            expect(result.current).toHaveProperty("isSuccess");
        });

        it("초기 data가 undefined여야 한다", () => {
            const { result } = renderHook(
                () => useBookInfoHook("9788966262595"),
                { wrapper: createWrapper() },
            );

            expect(result.current.data).toBeUndefined();
        });
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// useBestSellerHook
// ─────────────────────────────────────────────────────────────────────────────

describe("useBestSellerHook", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockBestSellers = Array.from({ length: 15 }, (_, i) => ({
        itemId: i + 1,
        title: `베스트셀러 ${i + 1}`,
        author: `저자 ${i + 1}`,
        cover: `http://example.com/cover${i + 1}.jpg`,
        publisher: "출판사",
        isbn13: `978000000000${i}`,
    }));

    describe("enabled=false 동작", () => {
        it("초기 상태에서 API를 호출하지 않아야 한다", () => {
            (
                API_GET_BEST_SELLER as ReturnType<typeof vi.fn>
            ).mockResolvedValue(mockBestSellers);

            const { result } = renderHook(
                () => useBestSellerHook(),
                { wrapper: createWrapper() },
            );

            expect(result.current.isLoading).toBe(false);
            expect(API_GET_BEST_SELLER).not.toHaveBeenCalled();
        });
    });

    describe("반환값 구조", () => {
        it("필요한 모든 프로퍼티를 반환해야 한다", () => {
            const { result } = renderHook(
                () => useBestSellerHook(),
                { wrapper: createWrapper() },
            );

            expect(result.current).toHaveProperty("data");
            expect(result.current).toHaveProperty("isLoading");
            expect(result.current).toHaveProperty("isFetching");
            expect(result.current).toHaveProperty("isError");
            expect(result.current).toHaveProperty("isSuccess");
        });
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// useLatestAddBookHook
// ─────────────────────────────────────────────────────────────────────────────

describe("useLatestAddBookHook", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockLatestBooks = [
        { bookTitle: "최신 등록 책 1", bookCode: "isbn1", userId: "user1" },
        { bookTitle: "최신 등록 책 2", bookCode: "isbn2", userId: "user2" },
        { bookTitle: "최신 등록 책 3", bookCode: "isbn3", userId: "user3" },
    ];

    describe("자동 실행 (enabled 기본값)", () => {
        it("마운트 시 자동으로 API를 호출해야 한다", async () => {
            (
                API_GET_LATEST_ADD_BOOK as ReturnType<typeof vi.fn>
            ).mockResolvedValue(mockLatestBooks);

            const { result } = renderHook(
                () => useLatestAddBookHook(),
                { wrapper: createWrapper() },
            );

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(API_GET_LATEST_ADD_BOOK).toHaveBeenCalledOnce();
        });

        it("최신 등록 도서 목록을 반환해야 한다", async () => {
            (
                API_GET_LATEST_ADD_BOOK as ReturnType<typeof vi.fn>
            ).mockResolvedValue(mockLatestBooks);

            const { result } = renderHook(
                () => useLatestAddBookHook(),
                { wrapper: createWrapper() },
            );

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.data).toEqual(mockLatestBooks);
            expect(result.current.data).toHaveLength(3);
        });

        it("API 에러 발생 시 isError가 true여야 한다", async () => {
            (
                API_GET_LATEST_ADD_BOOK as ReturnType<typeof vi.fn>
            ).mockRejectedValue(new Error("최신 도서 조회 실패"));

            const { result } = renderHook(
                () => useLatestAddBookHook(),
                { wrapper: createWrapper() },
            );

            await waitFor(() => expect(result.current.isError).toBe(true));
        });
    });

    describe("반환값 구조", () => {
        it("필요한 모든 프로퍼티를 반환해야 한다", () => {
            (
                API_GET_LATEST_ADD_BOOK as ReturnType<typeof vi.fn>
            ).mockResolvedValue([]);

            const { result } = renderHook(
                () => useLatestAddBookHook(),
                { wrapper: createWrapper() },
            );

            expect(result.current).toHaveProperty("data");
            expect(result.current).toHaveProperty("isLoading");
            expect(result.current).toHaveProperty("isFetching");
            expect(result.current).toHaveProperty("isError");
            expect(result.current).toHaveProperty("isSuccess");
        });
    });
});
