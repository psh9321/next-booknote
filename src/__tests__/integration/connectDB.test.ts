/**
 * 통합 테스트 (Integration Tests): ConnectDB
 * MongoDB 연결 관리 유틸리티 함수
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// mongoose 모킹
vi.mock("mongoose", () => {
    const connection = { readyState: 1 }; // 기본적으로 연결된 상태
    return {
        default: {
            connection,
            connect: vi.fn().mockResolvedValue(undefined),
        },
        connection,
        connect: vi.fn().mockResolvedValue(undefined),
    };
});

import mongoose from "mongoose";
import { ConnectDB } from "@/shared/lib/connectDB";

describe("ConnectDB", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("연결 상태에 따른 동작", () => {
        it("이미 연결된 경우(readyState=1) connect를 호출하지 않아야 한다", async () => {
            (mongoose.connection as any).readyState = 1;

            const fn = vi.fn().mockResolvedValue("result");
            await ConnectDB(fn);

            expect(mongoose.connect).not.toHaveBeenCalled();
        });

        it("연결되지 않은 경우(readyState=0) connect를 호출해야 한다", async () => {
            (mongoose.connection as any).readyState = 0;

            const fn = vi.fn().mockResolvedValue("result");
            await ConnectDB(fn);

            expect(mongoose.connect).toHaveBeenCalledOnce();
        });
    });

    describe("함수 실행 및 반환값", () => {
        it("전달된 함수를 실행하고 결과를 반환해야 한다", async () => {
            (mongoose.connection as any).readyState = 1;

            const expectedResult = { id: 1, name: "테스트" };
            const fn = vi.fn().mockResolvedValue(expectedResult);

            const result = await ConnectDB(fn);

            expect(fn).toHaveBeenCalledOnce();
            expect(result).toEqual(expectedResult);
        });

        it("함수가 배열을 반환하는 경우도 처리해야 한다", async () => {
            (mongoose.connection as any).readyState = 1;

            const books = [{ title: "책1" }, { title: "책2" }];
            const fn = vi.fn().mockResolvedValue(books);

            const result = await ConnectDB(fn);

            expect(result).toEqual(books);
        });

        it("함수가 null을 반환하는 경우도 처리해야 한다", async () => {
            (mongoose.connection as any).readyState = 1;

            const fn = vi.fn().mockResolvedValue(null);
            const result = await ConnectDB(fn);

            expect(result).toBeNull();
        });
    });

    describe("에러 처리", () => {
        it("전달된 함수가 에러를 던지면 에러가 전파되어야 한다", async () => {
            (mongoose.connection as any).readyState = 1;

            const error = new Error("DB 쿼리 실패");
            const fn = vi.fn().mockRejectedValue(error);

            await expect(ConnectDB(fn)).rejects.toThrow("DB 쿼리 실패");
        });

        it("mongoose.connect 실패 시 에러가 전파되어야 한다", async () => {
            (mongoose.connection as any).readyState = 0;
            (mongoose.connect as any).mockRejectedValueOnce(
                new Error("연결 실패"),
            );

            const fn = vi.fn().mockResolvedValue("result");

            await expect(ConnectDB(fn)).rejects.toThrow("연결 실패");
        });
    });
});
