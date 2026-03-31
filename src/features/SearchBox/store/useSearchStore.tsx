import { create } from 'zustand'

interface USE_SEARCH_STORE {
    keyword : string | null;
    SetKeyword : (keyword : string | null) => void;
}

export const useSearchStore = create<USE_SEARCH_STORE>((set) => ({
    keyword : null,
    SetKeyword(keyword) { set({keyword})}
}))