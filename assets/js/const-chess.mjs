export const Pieces={pawn:1, bishop:2, knight:3, rook:4, queen:5, king:6};

Object.getOwnPropertySymbols(Pieces).forEach(key=>{
    let descriptor=Object.getOwnPropertyDescriptor (Pieces, key);
    Object.defineProperty (Pieces, key, {configurable: false, enumerable: true, writable:false});
})
