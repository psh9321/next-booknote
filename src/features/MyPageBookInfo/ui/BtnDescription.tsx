"use client"

import { useState } from 'react';

import { decode } from "he";

import { Book, BookOpenText } from 'lucide-react';

interface BTN_DESCRIPTION {
    description : string,
    className? : string
}

export const BtnDescription = ({ description, className } : BTN_DESCRIPTION) => {

    const [isDescription, SetIsDescription] = useState(false);
    
    return (
        <>
            <button onClick={() => SetIsDescription(!isDescription)} className={className}>
                { isDescription ? <Book size={20}/> : <BookOpenText size={20}/> }
            </button>
            {
                isDescription && 
                <p className='absolute top-[230px] left-0 block w-[400px] h-[calc(100%-20px)] leading-[1.7] p-[20px] text-left bg-[#2A2F32] break-keep z-[2]'>
                    {decode(description)}
                </p>
            }
        </>
    )
}