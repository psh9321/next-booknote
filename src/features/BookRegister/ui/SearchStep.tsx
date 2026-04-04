"use client"

import Image from "next/image"
import { Search } from "lucide-react"

interface SearchStepProps {
    query: string
    results: ALADIN.ALADIN_ITEM[]
    isSearching: boolean
    onQueryChange: (value: string) => void
    onSearch: (e: React.FormEvent) => void
    onSelectBook: (book: ALADIN.ALADIN_ITEM) => void
}

export const SearchStep = ({
    query,
    results,
    isSearching,
    onQueryChange,
    onSearch,
    onSelectBook,
}: SearchStepProps) => {
    return (
        <div className="flex flex-col flex-1 overflow-hidden px-[28px] py-[22px] gap-[16px]">

            <form onSubmit={onSearch} className="flex gap-[10px]">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
                    placeholder="도서 제목을 입력하세요"
                    autoFocus
                    className="flex-1 px-[14px] py-[10px] bg-[#1a1f22] rounded-[8px] text-[0.9rem] outline-none placeholder:text-[#6b7280] focus:ring-1 focus:ring-[#4a5568]"
                />
                <button
                    type="submit"
                    disabled={isSearching}
                    className="flex items-center gap-[6px] px-[16px] py-[10px] bg-[#4a5568] hover:bg-[#5a6578] rounded-[8px] font-[700] text-[0.85rem] disabled:opacity-50 transition-colors shrink-0"
                >
                    <Search size={16} />
                    {isSearching ? "검색 중" : "검색"}
                </button>
            </form>

            <ul className="flex-1 overflow-y-auto space-y-[8px] pr-[2px]">
                {results.length === 0 && !isSearching && !query && (
                    <li className="flex flex-col items-center justify-center h-[200px] text-[0.9rem] text-[#6b7280]">
                        <Search size={32} className="mb-[12px] opacity-40" />
                        도서 제목으로 검색해보세요
                    </li>
                )}
                {results.length === 0 && !isSearching && query && (
                    <li className="flex justify-center items-center h-[200px] text-[0.9rem] text-[#6b7280]">
                        검색 결과가 없습니다.
                    </li>
                )}
                {results.map((book) => (
                    <li key={book.isbn13 || book.itemId}>
                        <button
                            onClick={() => onSelectBook(book)}
                            className="w-full flex gap-[14px] p-[12px] bg-[#1a1f22] hover:bg-[#20262b] rounded-[8px] text-left transition-colors"
                        >
                            <div className="relative w-[48px] h-[68px] shrink-0 rounded-[4px] overflow-hidden bg-[#2a2f32]">
                                <Image
                                    src={book.cover}
                                    alt={`${book.title} 커버`}
                                    fill
                                    sizes="48px"
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0 py-[2px]">
                                <p className="font-[700] text-[0.9rem] line-clamp-2 break-keep leading-[1.4]">{book.title}</p>
                                <p className="text-[0.78rem] text-[#9ca3af] mt-[6px]">{book.author}</p>
                                <p className="text-[0.78rem] text-[#6b7280]">{book.publisher}</p>
                            </div>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}
