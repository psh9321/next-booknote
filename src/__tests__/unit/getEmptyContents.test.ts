/**
 * 단위 테스트 (Unit Tests): getEmptyContents
 * READING_STATUS 별 빈 목록 표시 텍스트 상수 검증
 */

import { describe, it, expect } from "vitest";
import { emptyContents } from "@/features/my-book/util/getEmptyContents";

describe("emptyContents", () => {
    describe("구조 검증", () => {
        it("READ, WISH, COMPLETED 세 가지 키를 모두 가져야 한다", () => {
            expect(emptyContents).toHaveProperty("READ");
            expect(emptyContents).toHaveProperty("WISH");
            expect(emptyContents).toHaveProperty("COMPLETED");
        });

        it("각 상태는 title, txt, anchorTxt 필드를 가져야 한다", () => {
            const statuses: READING_STATUS[] = ["READ", "WISH", "COMPLETED"];
            statuses.forEach((status) => {
                expect(emptyContents[status]).toHaveProperty("title");
                expect(emptyContents[status]).toHaveProperty("txt");
                expect(emptyContents[status]).toHaveProperty("anchorTxt");
            });
        });

        it("모든 필드는 빈 문자열이 아닌 string이어야 한다", () => {
            const statuses: READING_STATUS[] = ["READ", "WISH", "COMPLETED"];
            statuses.forEach((status) => {
                expect(typeof emptyContents[status].title).toBe("string");
                expect(emptyContents[status].title.length).toBeGreaterThan(0);
                expect(typeof emptyContents[status].txt).toBe("string");
                expect(emptyContents[status].txt.length).toBeGreaterThan(0);
                expect(typeof emptyContents[status].anchorTxt).toBe("string");
                expect(emptyContents[status].anchorTxt.length).toBeGreaterThan(0);
            });
        });
    });

    describe("READ 상태", () => {
        it("읽는 중 관련 텍스트를 가져야 한다", () => {
            expect(emptyContents["READ"].title).toBe("현재 읽고 있는 도서가 없습니다.");
            expect(emptyContents["READ"].txt).toBe("읽어볼 도서를 찾아보세요.");
            expect(emptyContents["READ"].anchorTxt).toBe("읽을 책 찾기");
        });
    });

    describe("WISH 상태", () => {
        it("읽고 싶은 책 관련 텍스트를 가져야 한다", () => {
            expect(emptyContents["WISH"].title).toBe("현재 읽고 싶은 도서가 없습니다.");
            expect(emptyContents["WISH"].txt).toBe("읽고싶은 도서를 찾아보세요.");
            expect(emptyContents["WISH"].anchorTxt).toBe("읽고 싶은 책 찾기");
        });
    });

    describe("COMPLETED 상태", () => {
        it("완독 도서 관련 텍스트를 가져야 한다", () => {
            expect(emptyContents["COMPLETED"].title).toBe("현재 완독한 도서가 없습니다.");
            expect(emptyContents["COMPLETED"].txt).toBe("읽어볼 도서를 찾아보세요.");
            expect(emptyContents["COMPLETED"].anchorTxt).toBe("다 읽은 찾기");
        });
    });

    describe("상태별 title 중복 없음", () => {
        it("READ, WISH, COMPLETED 의 title이 모두 달라야 한다", () => {
            const titles = [
                emptyContents["READ"].title,
                emptyContents["WISH"].title,
                emptyContents["COMPLETED"].title,
            ];
            const unique = new Set(titles);
            expect(unique.size).toBe(3);
        });
    });
});
