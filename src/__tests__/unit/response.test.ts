/**
 * 단위 테스트 (Unit Tests): Response 모델 클래스
 * API 응답 래퍼 클래스 (ApiSuccess, ApiFail, ApiError)
 */

import { describe, it, expect } from "vitest";
import { ApiSuccess, ApiFail, ApiError } from "@/shared/util/response";

describe("ApiSuccess", () => {
    it("resultCode가 200이어야 한다", () => {
        const res = new ApiSuccess("data");
        expect(res.resultCode).toBe(200);
    });

    it("전달한 data를 그대로 저장해야 한다", () => {
        const payload = { id: 1, name: "책" };
        const res = new ApiSuccess(payload);
        expect(res.data).toEqual(payload);
    });

    it("errMsg가 빈 문자열이어야 한다", () => {
        const res = new ApiSuccess(null);
        expect(res.errMsg).toBe("");
    });

    it("제네릭 타입으로 배열 데이터도 처리해야 한다", () => {
        const list = [1, 2, 3];
        const res = new ApiSuccess(list);
        expect(res.data).toEqual([1, 2, 3]);
    });

    it("null 데이터도 허용해야 한다", () => {
        const res = new ApiSuccess(null);
        expect(res.data).toBeNull();
    });
});

describe("ApiFail", () => {
    it("resultCode가 400이어야 한다", () => {
        const res = new ApiFail(null, "잘못된 요청");
        expect(res.resultCode).toBe(400);
    });

    it("errMsg를 올바르게 저장해야 한다", () => {
        const msg = "필수 파라미터가 누락되었습니다";
        const res = new ApiFail(null, msg);
        expect(res.errMsg).toBe(msg);
    });

    it("data를 전달하면 저장해야 한다", () => {
        const data = { field: "bookCode", issue: "required" };
        const res = new ApiFail(data, "validation error");
        expect(res.data).toEqual(data);
    });

    it("data에 null을 전달할 수 있어야 한다", () => {
        const res = new ApiFail(null, "에러");
        expect(res.data).toBeNull();
    });
});

describe("ApiError", () => {
    it("resultCode가 500이어야 한다", () => {
        const res = new ApiError(null, "서버 에러");
        expect(res.resultCode).toBe(500);
    });

    it("errMsg를 올바르게 저장해야 한다", () => {
        const msg = "데이터베이스 연결 실패";
        const res = new ApiError(null, msg);
        expect(res.errMsg).toBe(msg);
    });

    it("data를 전달하면 저장해야 한다", () => {
        const errorData = new Error("Connection error");
        const res = new ApiError(errorData, "DB 에러");
        expect(res.data).toBe(errorData);
    });
});

describe("응답 클래스 구분", () => {
    it("각 클래스는 서로 다른 resultCode를 가져야 한다", () => {
        const success = new ApiSuccess("data");
        const fail = new ApiFail(null, "실패");
        const error = new ApiError(null, "에러");

        expect(success.resultCode).not.toBe(fail.resultCode);
        expect(fail.resultCode).not.toBe(error.resultCode);
        expect(success.resultCode).not.toBe(error.resultCode);
    });

    it("instanceof로 클래스를 구분할 수 있어야 한다", () => {
        const success = new ApiSuccess("data");
        const fail = new ApiFail(null, "실패");
        const error = new ApiError(null, "에러");

        expect(success instanceof ApiSuccess).toBe(true);
        expect(fail instanceof ApiFail).toBe(true);
        expect(error instanceof ApiError).toBe(true);
    });
});
