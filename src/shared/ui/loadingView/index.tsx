"use client"

import { SearchLoadingIcon, RouteLoadingIcon, BookNoteAddIcon, BookNoteDeleteIcon, BookNoteUpdateIcon, BookNoteFetchIcon, BookFetchIcon, BookRegisterIcon } from "./_icon"

import { useLoadingStore } from "@/shared/store/useLoadingStore";

export const LoadingView = () => {
    
    const loadingStatus = useLoadingStore(state => state.loadingStatus);

    switch (loadingStatus) {
        case "route" : return <RouteLoadingIcon/>
        case "search" : return <SearchLoadingIcon/>
        case "booknote-add" : return <BookNoteAddIcon/>
        case "booknote-delete" : return <BookNoteDeleteIcon/>
        case "booknote-update" : return <BookNoteUpdateIcon/>
        case "booknote-fetch" : return <BookNoteFetchIcon/>
        case "book-fetch" : return <BookFetchIcon/>
        case "book-register" : return <BookRegisterIcon/>
    
        default: return <></>
    }
}