/**
 * 단위 테스트 (Unit Tests): CombineZero
 * 숫자 앞에 0을 붙이는 순수 함수
 */

import { describe, it, expect } from "vitest";
import { CombineZero } from "@/shared/util/combineZero";

describe("CombineZero", () => {
    describe("정상 입력 - 숫자", () => {
        it("0은 '00'을 반환해야 한다", () => {
            expect(CombineZero(0)).toBe("00");
        });

        it("1~9 사이 숫자는 앞에 0을 붙여야 한다", () => {
            expect(CombineZero(1)).toBe("01");
            expect(CombineZero(5)).toBe("05");
            expect(CombineZero(9)).toBe("09");
        });

        it("경계값 10은 그대로 반환해야 한다", () => {
            expect(CombineZero(10)).toBe(10);
        });

        it("10 이상의 숫자는 그대로 반환해야 한다", () => {
            expect(CombineZero(11)).toBe(11);
            expect(CombineZero(59)).toBe(59);
            expect(CombineZero(100)).toBe(100);
        });
    });

    describe("정상 입력 - 숫자 문자열", () => {
        it("숫자로 변환 가능한 문자열은 처리해야 한다", () => {
            expect(CombineZero("5")).toBe("05");
            expect(CombineZero("10")).toBe(10);
            expect(CombineZero("12")).toBe(12);
        });
    });

    describe("비정상 입력", () => {
        it("NaN은 '-999'를 반환해야 한다", () => {
            expect(CombineZero("abc")).toBe("-999");
            expect(CombineZero("한글")).toBe("-999");
        });
    });
});
