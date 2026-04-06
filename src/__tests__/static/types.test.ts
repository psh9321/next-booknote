/**
 * 정적 테스트 (Static Tests)
 * TypeScript 타입 시스템을 활용한 타입 레벨 검증
 * expectTypeOf를 사용해 타입 정확성을 런타임에 검증
 */

import { describe, it, expectTypeOf } from "vitest";
import { ApiSuccess, ApiFail, ApiError } from "@/shared/util/response";
import { CombineZero } from "@/shared/util/combineZero";
import { DateFormat } from "@/shared/util/dateFormat";

describe("정적 테스트: 반환 타입 검증", () => {
    describe("CombineZero 반환 타입", () => {
        it("number | string 유니온 타입을 반환해야 한다", () => {
            const result = CombineZero(5);
            expectTypeOf(result).toEqualTypeOf<string | number>();
        });

        it("숫자 입력 시 파라미터 타입이 string | number여야 한다", () => {
            expectTypeOf(CombineZero).parameter(0).toEqualTypeOf<string | number>();
        });
    });

    describe("DateFormat 반환 타입", () => {
        it("string을 반환해야 한다", () => {
            const result = DateFormat("2024-01-01");
            expectTypeOf(result).toBeString();
        });
    });

    describe("ApiSuccess 타입 구조", () => {
        it("resultCode가 number 타입이어야 한다", () => {
            const response = new ApiSuccess({ id: 1 });
            expectTypeOf(response.resultCode).toBeNumber();
        });

        it("data가 제네릭 타입이어야 한다", () => {
            const response = new ApiSuccess<{ name: string }>({ name: "test" });
            expectTypeOf(response.data).toEqualTypeOf<{ name: string } | null>();
        });

        it("errMsg가 string 타입이어야 한다", () => {
            const response = new ApiSuccess("hello");
            expectTypeOf(response.errMsg).toBeString();
        });
    });

    describe("ApiFail 타입 구조", () => {
        it("resultCode가 number 타입이어야 한다", () => {
            const response = new ApiFail(null, "에러");
            expectTypeOf(response.resultCode).toBeNumber();
        });

        it("errMsg가 string 타입이어야 한다", () => {
            const response = new ApiFail(null, "에러 메시지");
            expectTypeOf(response.errMsg).toBeString();
        });
    });

    describe("ApiError 타입 구조", () => {
        it("resultCode가 number 타입이어야 한다", () => {
            const response = new ApiError<string>("error data", "에러");
            expectTypeOf(response.resultCode).toBeNumber();
        });
    });

    describe("READING_STATUS 타입 리터럴 검증", () => {
        it("유효한 상태값 타입이 string이어야 한다", () => {
            const status: READING_STATUS = "READ";
            expectTypeOf(status).toBeString();
        });

        it("WISH 상태가 할당 가능해야 한다", () => {
            const status: READING_STATUS = "WISH";
            expectTypeOf(status).toBeString();
        });

        it("COMPLETED 상태가 할당 가능해야 한다", () => {
            const status: READING_STATUS = "COMPLETED";
            expectTypeOf(status).toBeString();
        });
    });
});
