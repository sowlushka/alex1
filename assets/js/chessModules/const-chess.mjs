
//Обозначения значений на матрице шахматной доски
export const enumPieces={pawn:1, bishop:2, knight:3, rook:4, queen:5, king:6, checkPosition:-1};
export const enumPiecesNames={"-1":"Checking position", 0:"free", 1:"pawn", 2:"bishop", 3:"knight", 4:"rook", 5:"queen", 6:"king"}

freezeConstant(enumPieces);
freezeConstant(enumPiecesNames);



function freezeConstant(obj){
//Функция, запрещающая менять свойства объекта
    Object.getOwnPropertySymbols(obj).forEach(key=>{
        Object.defineProperty (obj, key, {configurable: false, enumerable: true, writable:false});
    });
}