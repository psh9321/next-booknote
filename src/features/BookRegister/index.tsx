"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

import { API_REGISTER_BOOK } from "@/server/api/api.book"
import { SearchStep } from "./ui/SearchStep"
import { RegisterStep } from "./ui/RegisterStep"

type Step = "search" | "register"

interface BookRegisterProps {
    onClose: () => void
    onSuccess?: () => void
    /** 도서 상세 페이지에서 진입 시 검색 단계 없이 바로 등록 폼으로 시작 */
    initialBook?: ALADIN.ALADIN_ITEM
}

export const BookRegister = ({ onClose, onSuccess, initialBook }: BookRegisterProps) => {

    const [step, setStep]               = useState<Step>(initialBook ? "register" : "search")
    const [query, setQuery]             = useState("")
    const [results, setResults]         = useState<ALADIN.ALADIN_ITEM[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [selectedBook, setSelectedBook] = useState<ALADIN.ALADIN_ITEM | null>(initialBook ?? null)

    const [status, setStatus]           = useState<READING_STATUS>("WISH")
    const [startDate, setStartDate]     = useState("")
    const [endDate, setEndDate]         = useState("")
    const [currentPage, setCurrentPage] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess]     = useState(false)

    // body scroll lock
    useEffect(() => {
        document.body.style.overflow = "hidden"
        return () => { document.body.style.overflow = "" }
    }, [])

    async function handleSearch(e: React.FormEvent) {
        e.preventDefault()
        if (!query.trim()) return

        setIsSearching(true)
        try {
            const res = await fetch(`/api/book/search?query=${encodeURIComponent(query.trim())}`)
            const data = await res.json()
            setResults(Array.isArray(data) ? data : [])
        } catch {
            setResults([])
        } finally {
            setIsSearching(false)
        }
    }

    function handleSelectBook(book: ALADIN.ALADIN_ITEM) {
        setSelectedBook(book)
        setStep("register")
    }

    function handleBackToSearch() {
        setStep("search")
        setStatus("WISH")
        setStartDate("")
        setEndDate("")
        setCurrentPage("")
    }

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault()
        if (!selectedBook) return

        setIsSubmitting(true)
        try {
            await API_REGISTER_BOOK({
                bookTitle:     selectedBook.title,
                bookCover:     selectedBook.cover,
                bookCode:      selectedBook.isbn13 || selectedBook.isbn || String(selectedBook.itemId),
                bookAuthor:    selectedBook.author,
                bookPublisher: selectedBook.publisher,
                status,
                currentPage:   currentPage ? Number(currentPage) : undefined,
                startDate:     startDate   ? new Date(startDate)  : undefined,
                endDate:       endDate     ? new Date(endDate)    : undefined,
                bookCategory:  selectedBook.categoryName,
                totalPage:     selectedBook.subInfo?.itemPage,
            })
            setIsSuccess(true)
            setTimeout(() => {
                onSuccess?.()
                onClose()
            }, 1200)
        } catch {
            // 에러 처리 (추후 toast 등 추가 가능)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div
            className="fixed top-0 left-0 flex justify-center items-center w-dvw h-dvh z-[9999] bg-[rgba(0,0,0,0.75)]"
            onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
            <article className="relative flex flex-col bg-[#2A2F32] rounded-[12px] w-[500px] max-h-[85dvh] overflow-hidden shadow-2xl">

                {/* ── Header ── */}
                <div className="flex justify-between items-center px-[28px] py-[22px] border-b border-[#3a4044] shrink-0">
                    <h2 className="font-[700] text-[1.1rem]">
                        {step === "search" ? "도서 등록" : "독서 정보 입력"}
                    </h2>
                    <button
                        onClick={onClose}
                        title="닫기"
                        className="p-[4px] hover:bg-[#3a4044] rounded-[6px] transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {step === "search" && (
                    <SearchStep
                        query={query}
                        results={results}
                        isSearching={isSearching}
                        onQueryChange={setQuery}
                        onSearch={handleSearch}
                        onSelectBook={handleSelectBook}
                    />
                )}

                {step === "register" && selectedBook && (
                    <RegisterStep
                        book={selectedBook}
                        status={status}
                        startDate={startDate}
                        endDate={endDate}
                        currentPage={currentPage}
                        isSubmitting={isSubmitting}
                        isSuccess={isSuccess}
                        showBackButton={!initialBook}
                        onStatusChange={setStatus}
                        onStartDateChange={setStartDate}
                        onEndDateChange={setEndDate}
                        onCurrentPageChange={setCurrentPage}
                        onBack={handleBackToSearch}
                        onSubmit={handleRegister}
                    />
                )}

            </article>
        </div>
    )
}
