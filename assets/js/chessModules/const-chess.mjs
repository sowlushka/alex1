
//Обозначения значений на матрице шахматной доски
export const enumPieces={pawn:1, bishop:2, knight:3, rook:4, queen:5, king:6, checkPosition:-1};

Object.getOwnPropertySymbols(enumPieces).forEach(key=>{
    Object.defineProperty (enumPieces, key, {configurable: false, enumerable: true, writable:false});
})
