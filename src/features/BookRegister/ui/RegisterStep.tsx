"use client"

import Image from "next/image"
import { CheckCircle } from "lucide-react"

const STATUS_OPTIONS: { value: READING_STATUS; label: string }[] = [
    { value: "WISH",      label: "읽고 싶은 책" },
    { value: "READ",      label: "읽는 중" },
    { value: "COMPLETED", label: "완독" },
    { value: "STOPPED",   label: "읽기 중단" },
]

interface RegisterStepProps {
    book: ALADIN.ALADIN_ITEM
    status: READING_STATUS
    startDate: string
    endDate: string
    currentPage: string
    isSubmitting: boolean
    isSuccess: boolean
    showBackButton: boolean
    onStatusChange: (value: READING_STATUS) => void
    onStartDateChange: (value: string) => void
    onEndDateChange: (value: string) => void
    onCurrentPageChange: (value: string) => void
    onBack: () => void
    onSubmit: (e: React.FormEvent) => void
}

export const RegisterStep = ({
    book,
    status,
    startDate,
    endDate,
    currentPage,
    isSubmitting,
    isSuccess,
    showBackButton,
    onStatusChange,
    onStartDateChange,
    onEndDateChange,
    onCurrentPageChange,
    onBack,
    onSubmit,
}: RegisterStepProps) => {

    const needsStartDate = status === "READ" || status === "COMPLETED" || status === "STOPPED"
    const needsEndDate   = status === "COMPLETED"
    const needsPageInput = status === "READ"

    return (
        <div className="flex flex-col flex-1 overflow-y-auto px-[28px] py-[22px]">

            {/* 선택한 책 미리보기 */}
            <div className="flex gap-[14px] p-[14px] bg-[#1a1f22] rounded-[10px] mb-[24px]">
                <div className="relative w-[56px] h-[80px] shrink-0 rounded-[4px] overflow-hidden bg-[#2a2f32]">
                    <Image
                        src={book.cover}
                        alt={`${book.title} 커버`}
                        fill
                        sizes="56px"
                        className="object-cover"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-[700] text-[0.95rem] break-keep leading-[1.4] line-clamp-2">{book.title}</p>
                    <p className="text-[0.8rem] text-[#9ca3af] mt-[6px]">{book.author}</p>
                    <p className="text-[0.8rem] text-[#6b7280]">{book.publisher}</p>
                </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-[20px]">

                {/* 독서 상태 */}
                <div>
                    <label className="block text-[0.85rem] font-[700] mb-[10px] text-[#d1d5db]">독서 상태</label>
                    <div className="grid grid-cols-2 gap-[8px]">
                        {STATUS_OPTIONS.map(({ value, label }) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => onStatusChange(value)}
                                className={`py-[10px] px-[14px] rounded-[8px] text-[0.85rem] font-[700] transition-colors ${
                                    status === value
                                        ? "bg-[#3b82f6] text-white"
                                        : "bg-[#1a1f22] text-[#9ca3af] hover:bg-[#20262b]"
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 시작일 */}
                {needsStartDate && (
                    <div>
                        <label className="block text-[0.85rem] font-[700] mb-[8px] text-[#d1d5db]">시작일</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => onStartDateChange(e.target.value)}
                            className="w-full px-[14px] py-[10px] bg-[#1a1f22] rounded-[8px] text-[0.9rem] outline-none focus:ring-1 focus:ring-[#4a5568] [color-scheme:dark]"
                        />
                    </div>
                )}

                {/* 완독일 */}
                {needsEndDate && (
                    <div>
                        <label className="block text-[0.85rem] font-[700] mb-[8px] text-[#d1d5db]">완독일</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => onEndDateChange(e.target.value)}
                            min={startDate || undefined}
                            className="w-full px-[14px] py-[10px] bg-[#1a1f22] rounded-[8px] text-[0.9rem] outline-none focus:ring-1 focus:ring-[#4a5568] [color-scheme:dark]"
                        />
                    </div>
                )}

                {/* 현재 페이지 */}
                {needsPageInput && (
                    <div>
                        <label className="block text-[0.85rem] font-[700] mb-[8px] text-[#d1d5db]">
                            현재 페이지
                            {book.subInfo?.itemPage && (
                                <span className="ml-[6px] font-[400] text-[#6b7280]">/ 총 {book.subInfo.itemPage}p</span>
                            )}
                        </label>
                        <input
                            type="number"
                            value={currentPage}
                            onChange={(e) => onCurrentPageChange(e.target.value)}
                            placeholder="읽은 페이지 수"
                            min="1"
                            max={book.subInfo?.itemPage}
                            className="w-full px-[14px] py-[10px] bg-[#1a1f22] rounded-[8px] text-[0.9rem] outline-none focus:ring-1 focus:ring-[#4a5568]"
                        />
                    </div>
                )}

                {/* 버튼 */}
                <div className="flex gap-[10px] pt-[4px] pb-[4px]">
                    {showBackButton && (
                        <button
                            type="button"
                            onClick={onBack}
                            className="flex-1 py-[12px] bg-[#1a1f22] hover:bg-[#20262b] rounded-[8px] font-[700] text-[0.9rem] transition-colors"
                        >
                            이전
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={isSubmitting || isSuccess}
                        className="flex-[2] flex justify-center items-center gap-[8px] py-[12px] bg-[#3b82f6] hover:bg-[#2563eb] rounded-[8px] font-[700] text-[0.9rem] disabled:opacity-60 transition-colors"
                    >
                        {isSuccess ? (
                            <>
                                <CheckCircle size={18} />
                                등록 완료!
                            </>
                        ) : isSubmitting ? (
                            "등록 중..."
                        ) : (
                            "등록하기"
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}
