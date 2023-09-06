import { ChessQueen } from "./ChessQueen.mjs";
import {Pieces} from "./const-chess.mjs";//Перечисление шахматных фигур

export class ChessDesk {
    chessPiece=[];
    deskGrid;//Координатная сетка доски, заполненные фигурами

    constructor(){
        this.deskGrid=Array(8,8).fill(0);
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