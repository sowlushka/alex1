import {enumPieces} from './const-chess.mjs';

export class ChessPiece {
    #x;//Координата x фигуры на шахматной доске
    #y;//Координата y фигуры на шахматной доске
    #enumPiece;//Название фигуры из перечня объекта enumPieces
    #name; //Название фигуры
    checkPositions=[];//Массив с координатами полей, куда может походить фигура из текущего положения


    constructor(x,y,enumPiece){
        this.setCoor(x,y);
        this.#x=x; this.#y=y;
        this.#enumPiece=enumPiece;
        this.#setName(enumPiece);
    }

    set x(x){
        if(x<0 || x>7 || Math.floor(x)!=x) throw new Error("Некорректная координата X");
        this.#x=x;
    }

    get x(){
        return this.#x;
    }

    set y(y){
        if(y<0 || y>7 || Math.floor(y)!=y) throw new Error("Некорректная координата y");
        this.#y=y;
    }

    get y(){
        return this.#y;
    }

    get Piece(){
        return this.#enumPiece;
    }

    setCoor(x,y){
        if(x<0 || x>7 || Math.floor(x)!=x) throw new Error("Некорректная координата X");
        if(y<0 || y>7 || Math.floor(y)!=y) throw new Error("Некорректная координата y");
        this.#x=x; this.#y=y;
    }

    #setName(enumPiece){
        switch(enumPiece){
            case enumPieces.pawn:
                this.#name="pawn";
                break;
            case enumPieces.bishop:
                this.#name="bishop";
                break;
            case enumPieces.knight:
                this.#name="knight";
                break;
            case enumPieces.rook:
                this.#name="rook";
                break;
            case enumPieces.queen:
                this.#name="queen";
                break;
            case enumPieces.king:
                this.#name="king";
        }
    }

    get name(){
        return this.#name;
    }

}