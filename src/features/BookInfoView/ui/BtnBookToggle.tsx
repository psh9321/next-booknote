"use client"

import { BookPlus, BookMinus } from 'lucide-react';

export const BtnBookToggle = () => {
    return <button className="flex items-center mt-[15px] py-[5px] px-[10px] border rounded-[8px]"><BookPlus size={20} className='mr-[5px]' />책 추가</button>
}