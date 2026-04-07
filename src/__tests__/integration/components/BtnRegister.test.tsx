/**
 * 통합 테스트 (Integration Tests): BtnRegister
 * 도서 등록/수정/삭제 버튼 컴포넌트
 *
 * 테스트 범위:
 * - 미등록/등록 상태별 렌더링
 * - 신규 등록 (로그인/비로그인)
 * - 상태 업데이트 (로그인/비로그인)
 * - 삭제 (로그인/비로그인)
 * - 비로그인 시 useEffect IndexedDB 상태 조회
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// next-auth/react 모킹
vi.mock("next-auth/react", () => ({
    useSession: vi.fn(),
}));

// next/navigation 모킹
vi.mock("next/navigation", () => ({
    useRouter: vi.fn(),
}));

// Book API 모킹
vi.mock("@/entities/book/api/book", () => ({
    API_REGISTER_BOOK: vi.fn(),
    API_REGISTER_BOOK_UPDATE: vi.fn(),
    API_REGISTER_BOOK_DELETE: vi.fn(),
}));

// useIndexedDBHook 모킹
vi.mock("@/shared/hooks/useIndexedDB", () => ({
    useIndexedDBHook: vi.fn(),
}));

// Confirm 모킹 (Portal 의존성 제거)
vi.mock("@/shared/ui/Confirm", () => ({
    Confirm: ({
        submitCallback,
        cancelCallback,
    }: {
        submitCallback: () => void;
        cancelCallback: () => void;
    }) => (
        <div data-testid="confirm-modal">
            <button data-testid="confirm-submit" onClick={submitCallback}>
                삭제확인
            </button>
            <button data-testid="confirm-cancel" onClick={cancelCallback}>
                취소
            </button>
        </div>
    ),
}));

import { BtnRegister } from "@/features/register-book/ui/BtnRegister";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
    API_REGISTER_BOOK,
    API_REGISTER_BOOK_UPDATE,
    API_REGISTER_BOOK_DELETE,
} from "@/entities/book/api/book";
import { useIndexedDBHook } from "@/shared/hooks/useIndexedDB";

// IndexedDB 훅 모킹 함수
const mockBookAdd = vi.fn();
const mockBookUpdate = vi.fn();
const mockGetTargetBookStatus = vi.fn();
const mockAfterLoginBookDelete = vi.fn();
const mockBeforeLoginBookDelete = vi.fn();
const mockRouterRefresh = vi.fn();
const mockSessionUpdate = vi.fn();

// 테스트용 알라딘 도서 아이템
const mockItem: ALADIN.ALADIN_ITEM = {
    title: "테스트 도서",
    link: "",
    author: "테스트 작가",
    pubDate: "2024-01-01",
    description: "",
    isbn: "isbn-001",
    isbn13: "9791234567890",
    itemId: 1,
    priceSales: 15000,
    priceStandard: 18000,
    mallType: "BOOK",
    stockStatus: "",
    mileage: 0,
    cover: "https://example.com/cover.jpg",
    categoryId: 1,
    categoryName: "소설",
    publisher: "테스트 출판사",
    salesPoint: 100,
    adult: false,
    fixedPrice: true,
    customerReviewRank: 8,
    bestDuration: "",
    subInfo: { itemPage: 300 },
};

describe("BtnRegister", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        (useIndexedDBHook as ReturnType<typeof vi.fn>).mockReturnValue({
            BookAdd: mockBookAdd,
            BookUpdate: mockBookUpdate,
            GetTargetBookStatus: mockGetTargetBookStatus,
            AfterLoginBookDelete: mockAfterLoginBookDelete,
            BeforeLoginBookDelete: mockBeforeLoginBookDelete,
        });

        (useRouter as ReturnType<typeof vi.fn>).mockReturnValue({
            refresh: mockRouterRefresh,
        });

        mockGetTargetBookStatus.mockResolvedValue("");
    });

    // ─── 렌더링 ────────────────────────────────────────────────────────────────

    describe("렌더링 - 미등록 상태 (status 없음)", () => {
        beforeEach(() => {
            (useSession as ReturnType<typeof vi.fn>).mockReturnValue({
                status: "unauthenticated",
                data: null,
                update: mockSessionUpdate,
            });
        });

        it("'읽고싶은' 버튼이 렌더링되어야 한다", () => {
            render(<BtnRegister item={mockItem} status={""} />);
            expect(screen.getByText("읽고싶은")).toBeInTheDocument();
        });

        it("Confirm 모달은 초기에 보이지 않아야 한다", () => {
            render(<BtnRegister item={mockItem} status={""} />);
            expect(screen.queryByTestId("confirm-modal")).not.toBeInTheDocument();
        });
    });

    describe("렌더링 - 등록된 상태 (status 있음)", () => {
        beforeEach(() => {
            (useSession as ReturnType<typeof vi.fn>).mockReturnValue({
                status: "authenticated",
                data: { user: { id: "user-123", book: 5 } },
                update: mockSessionUpdate,
            });
        });

        it("WISH 상태일 때 '읽고 싶은 책' 버튼이 렌더링되어야 한다", () => {
            render(<BtnRegister item={mockItem} status={"WISH"} />);
            expect(screen.getByText("읽고 싶은 책")).toBeInTheDocument();
        });

        it("READ 상태일 때 '읽는중' 버튼이 렌더링되어야 한다", () => {
            render(<BtnRegister item={mockItem} status={"READ"} />);
            expect(screen.getByText("읽는중")).toBeInTheDocument();
        });

        it("COMPLETED 상태일 때 '완독' 버튼이 렌더링되어야 한다", () => {
            render(<BtnRegister item={mockItem} status={"COMPLETED"} />);
            expect(screen.getByText("완독")).toBeInTheDocument();
        });
    });

    // ─── 신규 등록 ─────────────────────────────────────────────────────────────

    describe("신규 등록 (currentStatus 없음)", () => {
        it("비로그인 시 '읽고싶은' 버튼 클릭 → BookAdd만 호출해야 한다", async () => {
            (useSession as ReturnType<typeof vi.fn>).mockReturnValue({
                status: "unauthenticated",
                data: null,
                update: mockSessionUpdate,
            });
            mockBookAdd.mockResolvedValue(undefined);

            render(<BtnRegister item={mockItem} status={""} />);
            fireEvent.click(screen.getByText("읽고싶은"));

            await waitFor(() => {
                expect(mockBookAdd).toHaveBeenCalledWith(
                    expect.objectContaining({
                        bookTitle: "테스트 도서",
                        bookCode: "isbn-001",
                        status: "WISH",
                    }),
                    "테스트 도서",
                    undefined,
                );
            });
            expect(API_REGISTER_BOOK).not.toHaveBeenCalled();
        });

        it("로그인 시 '읽고싶은' 버튼 클릭 → BookAdd + API_REGISTER_BOOK 모두 호출해야 한다", async () => {
            (useSession as ReturnType<typeof vi.fn>).mockReturnValue({
                status: "authenticated",
                data: { user: { id: "user-123", book: 3 } },
                update: mockSessionUpdate,
            });
            mockBookAdd.mockResolvedValue(undefined);
            (API_REGISTER_BOOK as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

            render(<BtnRegister item={mockItem} status={""} />);
            fireEvent.click(screen.getByText("읽고싶은"));

            await waitFor(() => {
                expect(mockBookAdd).toHaveBeenCalledWith(
                    expect.objectContaining({ bookTitle: "테스트 도서", status: "WISH" }),
                    "테스트 도서",
                    "user-123",
                );
                expect(API_REGISTER_BOOK).toHaveBeenCalledWith(
                    expect.objectContaining({ bookTitle: "테스트 도서", status: "WISH" }),
                );
            });
        });

        it("로그인 시 등록 후 session.update로 book 카운트가 1 증가해야 한다", async () => {
            (useSession as ReturnType<typeof vi.fn>).mockReturnValue({
                status: "authenticated",
                data: { user: { id: "user-123", book: 3 } },
                update: mockSessionUpdate,
            });
            mockBookAdd.mockResolvedValue(undefined);
            (API_REGISTER_BOOK as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

            render(<BtnRegister item={mockItem} status={""} />);
            fireEvent.click(screen.getByText("읽고싶은"));

            await waitFor(() => {
                expect(mockSessionUpdate).toHaveBeenCalledWith({ user: { book: 4 } });
            });
        });

        it("등록 후 currentStatus가 'WISH'로 변경되어야 한다", async () => {
            (useSession as ReturnType<typeof vi.fn>).mockReturnValue({
                status: "unauthenticated",
                data: null,
                update: mockSessionUpdate,
            });
            mockBookAdd.mockResolvedValue(undefined);

            render(<BtnRegister item={mockItem} status={""} />);
            fireEvent.click(screen.getByText("읽고싶은"));

            await waitFor(() => {
                expect(screen.getByText("읽고 싶은 책")).toBeInTheDocument();
            });
        });
    });

    // ─── 상태 업데이트 ─────────────────────────────────────────────────────────

    describe("상태 업데이트 (currentStatus 있음)", () => {
        it("로그인 시 메뉴에서 상태 변경 → BookUpdate + API_REGISTER_BOOK_UPDATE 호출해야 한다", async () => {
            (useSession as ReturnType<typeof vi.fn>).mockReturnValue({
                status: "authenticated",
                data: { user: { id: "user-123", book: 5 } },
                update: mockSessionUpdate,
            });
            mockBookUpdate.mockResolvedValue(undefined);
            (API_REGISTER_BOOK_UPDATE as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

            render(<BtnRegister item={mockItem} status={"WISH"} />);

            // 메뉴 열기
            fireEvent.click(screen.getByText("읽고 싶은 책"));
            // 메뉴에서 '읽는 중' 선택
            fireEvent.click(screen.getByText("읽는 중"));

            await waitFor(() => {
                expect(mockBookUpdate).toHaveBeenCalledWith(
                    expect.objectContaining({ bookTitle: "테스트 도서" }),
                    "READ",
                    "user-123",
                );
                expect(API_REGISTER_BOOK_UPDATE).toHaveBeenCalledWith("isbn-001", "READ");
            });
        });

        it("비로그인 시 상태 변경 → BookUpdate만 호출하고 API_REGISTER_BOOK_UPDATE는 호출하지 않아야 한다", async () => {
            (useSession as ReturnType<typeof vi.fn>).mockReturnValue({
                status: "unauthenticated",
                data: null,
                update: mockSessionUpdate,
            });
            mockBookUpdate.mockResolvedValue(undefined);

            render(<BtnRegister item={mockItem} status={"WISH"} />);

            fireEvent.click(screen.getByText("읽고 싶은 책"));
            fireEvent.click(screen.getByText("읽는 중"));

            await waitFor(() => {
                expect(mockBookUpdate).toHaveBeenCalledWith(
                    expect.objectContaining({ bookTitle: "테스트 도서" }),
                    "READ",
                    undefined,
                );
            });
            expect(API_REGISTER_BOOK_UPDATE).not.toHaveBeenCalled();
        });

        it("상태 변경 후 메뉴가 닫혀야 한다", async () => {
            (useSession as ReturnType<typeof vi.fn>).mockReturnValue({
                status: "authenticated",
                data: { user: { id: "user-123", book: 5 } },
                update: mockSessionUpdate,
            });
            mockBookUpdate.mockResolvedValue(undefined);
            (API_REGISTER_BOOK_UPDATE as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

            render(<BtnRegister item={mockItem} status={"WISH"} />);

            fireEvent.click(screen.getByText("읽고 싶은 책"));
            expect(screen.getByText("읽는 중")).toBeInTheDocument();

            fireEvent.click(screen.getByText("읽는 중"));

            await waitFor(() => {
                expect(screen.queryByText("읽는 중")).not.toBeInTheDocument();
            });
        });
    });

    // ─── 삭제 ──────────────────────────────────────────────────────────────────

    describe("삭제 흐름", () => {
        it("메뉴에서 삭제 클릭 시 Confirm 모달이 표시되어야 한다", () => {
            (useSession as ReturnType<typeof vi.fn>).mockReturnValue({
                status: "authenticated",
                data: { user: { id: "user-123", book: 5 } },
                update: mockSessionUpdate,
            });

            render(<BtnRegister item={mockItem} status={"WISH"} />);

            fireEvent.click(screen.getByText("읽고 싶은 책"));
            fireEvent.click(screen.getByRole("button", { name: /삭제/ }));

            expect(screen.getByTestId("confirm-modal")).toBeInTheDocument();
        });

        it("로그인 시 삭제 확인 → API_REGISTER_BOOK_DELETE + AfterLoginBookDelete 호출해야 한다", async () => {
            (useSession as ReturnType<typeof vi.fn>).mockReturnValue({
                status: "authenticated",
                data: { user: { id: "user-123", book: 5 } },
                update: mockSessionUpdate,
            });
            (API_REGISTER_BOOK_DELETE as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
            mockAfterLoginBookDelete.mockResolvedValue(undefined);

            render(<BtnRegister item={mockItem} status={"WISH"} />);

            fireEvent.click(screen.getByText("읽고 싶은 책"));
            fireEvent.click(screen.getByRole("button", { name: /삭제/ }));
            fireEvent.click(screen.getByTestId("confirm-submit"));

            await waitFor(() => {
                expect(API_REGISTER_BOOK_DELETE).toHaveBeenCalledWith("isbn-001");
                expect(mockAfterLoginBookDelete).toHaveBeenCalledWith(
                    "테스트 도서",
                    "user-123",
                );
            });
        });

        it("로그인 시 삭제 확인 → router.refresh를 호출해야 한다", async () => {
            (useSession as ReturnType<typeof vi.fn>).mockReturnValue({
                status: "authenticated",
                data: { user: { id: "user-123", book: 5 } },
                update: mockSessionUpdate,
            });
            (API_REGISTER_BOOK_DELETE as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
            mockAfterLoginBookDelete.mockResolvedValue(undefined);

            render(<BtnRegister item={mockItem} status={"WISH"} />);

            fireEvent.click(screen.getByText("읽고 싶은 책"));
            fireEvent.click(screen.getByRole("button", { name: /삭제/ }));
            fireEvent.click(screen.getByTestId("confirm-submit"));

            await waitFor(() => {
                expect(mockRouterRefresh).toHaveBeenCalled();
            });
        });

        it("로그인 시 삭제 후 session.update로 book 카운트가 1 감소해야 한다", async () => {
            (useSession as ReturnType<typeof vi.fn>).mockReturnValue({
                status: "authenticated",
                data: { user: { id: "user-123", book: 3 } },
                update: mockSessionUpdate,
            });
            (API_REGISTER_BOOK_DELETE as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
            mockAfterLoginBookDelete.mockResolvedValue(undefined);

            render(<BtnRegister item={mockItem} status={"WISH"} />);

            fireEvent.click(screen.getByText("읽고 싶은 책"));
            fireEvent.click(screen.getByRole("button", { name: /삭제/ }));
            fireEvent.click(screen.getByTestId("confirm-submit"));

            await waitFor(() => {
                expect(mockSessionUpdate).toHaveBeenCalledWith({ user: { book: 2 } });
            });
        });

        it("book 카운트가 0일 때 삭제해도 음수가 되지 않아야 한다 (최소 0)", async () => {
            (useSession as ReturnType<typeof vi.fn>).mockReturnValue({
                status: "authenticated",
                data: { user: { id: "user-123", book: 0 } },
                update: mockSessionUpdate,
            });
            (API_REGISTER_BOOK_DELETE as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
            mockAfterLoginBookDelete.mockResolvedValue(undefined);

            render(<BtnRegister item={mockItem} status={"WISH"} />);

            fireEvent.click(screen.getByText("읽고 싶은 책"));
            fireEvent.click(screen.getByRole("button", { name: /삭제/ }));
            fireEvent.click(screen.getByTestId("confirm-submit"));

            await waitFor(() => {
                expect(mockSessionUpdate).toHaveBeenCalledWith({ user: { book: 0 } });
            });
        });

        it("비로그인 시 삭제 확인 → BeforeLoginBookDelete만 호출해야 한다", async () => {
            (useSession as ReturnType<typeof vi.fn>).mockReturnValue({
                status: "unauthenticated",
                data: null,
                update: mockSessionUpdate,
            });
            mockBeforeLoginBookDelete.mockResolvedValue(undefined);

            render(<BtnRegister item={mockItem} status={"WISH"} />);

            fireEvent.click(screen.getByText("읽고 싶은 책"));
            fireEvent.click(screen.getByRole("button", { name: /삭제/ }));
            fireEvent.click(screen.getByTestId("confirm-submit"));

            await waitFor(() => {
                expect(mockBeforeLoginBookDelete).toHaveBeenCalledWith("테스트 도서");
            });
            expect(API_REGISTER_BOOK_DELETE).not.toHaveBeenCalled();
            expect(mockRouterRefresh).not.toHaveBeenCalled();
        });

        it("삭제 취소 클릭 시 Confirm 모달이 닫혀야 한다", () => {
            (useSession as ReturnType<typeof vi.fn>).mockReturnValue({
                status: "authenticated",
                data: { user: { id: "user-123", book: 5 } },
                update: mockSessionUpdate,
            });

            render(<BtnRegister item={mockItem} status={"WISH"} />);

            fireEvent.click(screen.getByText("읽고 싶은 책"));
            fireEvent.click(screen.getByRole("button", { name: /삭제/ }));
            expect(screen.getByTestId("confirm-modal")).toBeInTheDocument();

            fireEvent.click(screen.getByTestId("confirm-cancel"));
            expect(screen.queryByTestId("confirm-modal")).not.toBeInTheDocument();
        });

        it("삭제 후 currentStatus가 빈 문자열로 초기화되어야 한다", async () => {
            (useSession as ReturnType<typeof vi.fn>).mockReturnValue({
                status: "authenticated",
                data: { user: { id: "user-123", book: 5 } },
                update: mockSessionUpdate,
            });
            (API_REGISTER_BOOK_DELETE as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
            mockAfterLoginBookDelete.mockResolvedValue(undefined);

            render(<BtnRegister item={mockItem} status={"WISH"} />);

            fireEvent.click(screen.getByText("읽고 싶은 책"));
            fireEvent.click(screen.getByRole("button", { name: /삭제/ }));
            fireEvent.click(screen.getByTestId("confirm-submit"));

            await waitFor(() => {
                expect(screen.getByText("읽고싶은")).toBeInTheDocument();
            });
        });
    });

    // ─── 비로그인 useEffect ────────────────────────────────────────────────────

    describe("비로그인 - useEffect IndexedDB 상태 조회", () => {
        it("비로그인 시 마운트 후 GetTargetBookStatus를 호출해야 한다", async () => {
            (useSession as ReturnType<typeof vi.fn>).mockReturnValue({
                status: "unauthenticated",
                data: null,
                update: mockSessionUpdate,
            });
            mockGetTargetBookStatus.mockResolvedValue("");

            render(<BtnRegister item={mockItem} status={""} />);

            await waitFor(() => {
                expect(mockGetTargetBookStatus).toHaveBeenCalledWith("테스트 도서");
            });
        });

        it("GetTargetBookStatus가 'READ'를 반환하면 '읽는중' 버튼이 표시되어야 한다", async () => {
            (useSession as ReturnType<typeof vi.fn>).mockReturnValue({
                status: "unauthenticated",
                data: null,
                update: mockSessionUpdate,
            });
            mockGetTargetBookStatus.mockResolvedValue("READ");

            render(<BtnRegister item={mockItem} status={""} />);

            await waitFor(() => {
                expect(screen.getByText("읽는중")).toBeInTheDocument();
            });
        });

        it("로그인 상태에서는 GetTargetBookStatus를 호출하지 않아야 한다", () => {
            (useSession as ReturnType<typeof vi.fn>).mockReturnValue({
                status: "authenticated",
                data: { user: { id: "user-123", book: 5 } },
                update: mockSessionUpdate,
            });

            render(<BtnRegister item={mockItem} status={""} />);

            expect(mockGetTargetBookStatus).not.toHaveBeenCalled();
        });
    });
});
