/**
 * 단위 테스트 (Unit Tests): useSearchStore
 * Zustand 기반 검색 키워드 상태 관리 스토어
 */

import { describe, it, expect, beforeEach } from "vitest";
import { useSearchStore } from "@/features/search-book/store/useSearchStore";

describe("useSearchStore", () => {
    beforeEach(() => {
        // 각 테스트 전에 스토어 초기화
        useSearchStore.setState({ keyword: null });
    });

    describe("초기 상태", () => {
        it("keyword 초기값이 null이어야 한다", () => {
            const { keyword } = useSearchStore.getState();
            expect(keyword).toBeNull();
        });

        it("SetKeyword 함수가 존재해야 한다", () => {
            const { SetKeyword } = useSearchStore.getState();
            expect(typeof SetKeyword).toBe("function");
        });
    });

    describe("SetKeyword", () => {
        it("키워드를 설정할 수 있어야 한다", () => {
            const { SetKeyword } = useSearchStore.getState();
            SetKeyword("리액트");

            const { keyword } = useSearchStore.getState();
            expect(keyword).toBe("리액트");
        });

        it("다른 키워드로 업데이트할 수 있어야 한다", () => {
            const { SetKeyword } = useSearchStore.getState();
            SetKeyword("자바스크립트");
            SetKeyword("타입스크립트");

            const { keyword } = useSearchStore.getState();
            expect(keyword).toBe("타입스크립트");
        });

        it("null로 키워드를 초기화할 수 있어야 한다", () => {
            const { SetKeyword } = useSearchStore.getState();
            SetKeyword("검색어");
            SetKeyword(null);

            const { keyword } = useSearchStore.getState();
            expect(keyword).toBeNull();
        });

        it("빈 문자열을 키워드로 설정할 수 있어야 한다", () => {
            const { SetKeyword } = useSearchStore.getState();
            SetKeyword("");

            const { keyword } = useSearchStore.getState();
            expect(keyword).toBe("");
        });

        it("특수문자 키워드를 설정할 수 있어야 한다", () => {
            const { SetKeyword } = useSearchStore.getState();
            SetKeyword("C++ 프로그래밍");

            const { keyword } = useSearchStore.getState();
            expect(keyword).toBe("C++ 프로그래밍");
        });
    });

    describe("상태 독립성", () => {
        it("getState로 가져온 상태가 최신값을 반영해야 한다", () => {
            const store = useSearchStore.getState();
            store.SetKeyword("최신값");

            // getState를 다시 호출하면 최신 상태를 반환해야 함
            expect(useSearchStore.getState().keyword).toBe("최신값");
        });
    });
});
