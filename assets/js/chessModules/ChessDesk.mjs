import { ChessPiece } from "./ChessPiece.mjs";
import {enumPieces} from "./const-chess.mjs";//Перечисление шахматных фигур

export class ChessDesk {
    chessPiece=[];
    deskGrid=Array(8,8).fill(0);//Координатная сетка доски, заполненные фигурами

    constructor(){
        
    }


    addPiece(Piece){
    //Добавление шахматной фигуры на доску (в массив chessPiece) 
        let emptySquare=true;
        this.chessPiece.forEach(nextPiece=>{
            if(nextPiece.x==Piece.x && nextPiece.y==Piece.y){
                
                emptySquare=false;
                throw new Error("Данная координата на доске занята");
            }
        });
    }
}