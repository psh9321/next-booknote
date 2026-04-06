export function CombineZero(idx : string | number){ 
    const _idx = Number(idx);

    if(isNaN(_idx)) return "-999";

    return _idx < 10 ? `0${_idx}` : _idx;
}