import { CombineZero } from "./combineZero";

export function DateFormat(dateAt : string) {

    const date = new Date(dateAt);
    
    const dateStr = String(date);

    if(dateStr.length < 8) return dateStr;

    const year = date.getFullYear();
    const month = CombineZero(date.getMonth()+1);
    const day = CombineZero(date.getDate());

    const hours = CombineZero(date.getHours());
    const min = CombineZero(date.getMinutes());
    
    return `${year}.${month}.${day} ${hours}:${min}`
}