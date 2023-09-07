import { ChessPiece } from "./ChessPiece.mjs";
import {enumPieces} from "./const-chess.mjs";//Перечисление шахматных фигур

export class ChessDesk {
    chessPiece=[];
    deskGrid=Array(8,8).fill(0);//Координатная сетка доски, заполненные фигурами

    constructor(){
        
    }


    addPiece(Piece){
    //Добавление шахматной фигуры на доску (в массив chessPiece) 
        if (Piece.constructor.name!="ChessPiece"){
            throw new Error("В метод addPiece передан некорректный аргумент. Должен быть экземпляр класса ChessPiece");
        }
    }
}