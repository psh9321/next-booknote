/**
 * 통합 테스트 (Integration Tests): useLatestBookNoteHook
 * 최근 독서 노트 5개 쿼리 훅
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import { useLatestBookNoteHook } from "@/entities/book-note/hooks/useLatestBookNoteHook";

// API 모킹
vi.mock("@/entities/book-note/api/booknote", () => ({
    API_LATEST_BOOK_NOTE: vi.fn(),
}));

import { API_LATEST_BOOK_NOTE } from "@/entities/book-note/api/booknote";

function createWrapper() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
        },
    });
    return ({ children }: { children: React.ReactNode }) =>
        createElement(QueryClientProvider, { client: queryClient }, children);
}

const mockLatestNotes = [
    { _id: "n1", noteContents: "노트1", bookTitle: "책1", createAt: "2024-01-05" },
    { _id: "n2", noteContents: "노트2", bookTitle: "책2", createAt: "2024-01-04" },
    { _id: "n3", noteContents: "노트3", bookTitle: "책3", createAt: "2024-01-03" },
];

describe("useLatestBookNoteHook", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("enabled 조건", () => {
        it("userId가 undefined이면 쿼리가 실행되지 않아야 한다", () => {
            const { result } = renderHook(
                () => useLatestBookNoteHook(undefined),
                { wrapper: createWrapper() },
            );

            expect(result.current.isLoading).toBe(false);
            expect(API_LATEST_BOOK_NOTE).not.toHaveBeenCalled();
        });

        it("userId가 string이면 쿼리가 실행되어야 한다", async () => {
            (
                API_LATEST_BOOK_NOTE as ReturnType<typeof vi.fn>
            ).mockResolvedValue(mockLatestNotes);

            const { result } = renderHook(
                () => useLatestBookNoteHook("user123"),
                { wrapper: createWrapper() },
            );

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(API_LATEST_BOOK_NOTE).toHaveBeenCalledWith("user123");
        });
    });

    describe("데이터 로딩", () => {
        it("최신 노트 목록을 반환해야 한다", async () => {
            (
                API_LATEST_BOOK_NOTE as ReturnType<typeof vi.fn>
            ).mockResolvedValue(mockLatestNotes);

            const { result } = renderHook(
                () => useLatestBookNoteHook("user123"),
                { wrapper: createWrapper() },
            );

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.data).toEqual(mockLatestNotes);
            expect(result.current.data).toHaveLength(3);
        });

        it("userId가 없으면 queryFn이 null을 반환해야 한다", async () => {
            // userId가 string이 아니라 undefined면 enabled=false이므로
            // 이 케이스는 enabled=false로 막히는 케이스
            const { result } = renderHook(
                () => useLatestBookNoteHook(undefined),
                { wrapper: createWrapper() },
            );

            expect(result.current.data).toBeUndefined();
        });

        it("API 에러 발생 시 isError가 true여야 한다", async () => {
            (
                API_LATEST_BOOK_NOTE as ReturnType<typeof vi.fn>
            ).mockRejectedValue(new Error("최신 노트 조회 실패"));

            const { result } = renderHook(
                () => useLatestBookNoteHook("user123"),
                { wrapper: createWrapper() },
            );

            await waitFor(() => expect(result.current.isError).toBe(true));
        });
    });

    describe("반환값 구조", () => {
        it("필요한 모든 프로퍼티를 반환해야 한다", () => {
            (
                API_LATEST_BOOK_NOTE as ReturnType<typeof vi.fn>
            ).mockResolvedValue([]);

            const { result } = renderHook(
                () => useLatestBookNoteHook("user123"),
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
