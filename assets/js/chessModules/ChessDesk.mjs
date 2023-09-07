import { ChessPiece } from "./ChessPiece.mjs";
import {enumPieces, enumPiecesNames} from "./const-chess.mjs";//Перечисление шахматных фигур

export class ChessDesk {
    chessPiece=[];//Перечень объектов на доске
    deskGrid;//Координатная сетка доски, заполненная фигурами

    constructor(){
        this.#clearDesk(); //Чистим доску
    }


    addPiece(Piece){
    //Добавление шахматной фигуры на доску (в массив chessPiece) 
    //Аргументом является объект класса ChessPiece

        if (Piece.constructor.name!="ChessPiece"){
            throw new Error("В метод addPiece передан некорректный аргумент. Должен быть экземпляр класса ChessPiece");
        }
        let piece=this.checkSquare(Piece.x, Piece.y);
        if(piece>0)throw new Error("Клетка занята фигурой "+ enumPiecesNames[Piece.enumPiece] + ". Поле запрещено для добавления ");
        
        this.chessPiece.push(Piece);//Добавляем фигуру в перечень объектов, находящихся на доске
        this.deskGrid[Piece.x][Piece.y]=Piece.enumPiece;//Добавляем фигуру на координатную сетку шахматной доски
        
        //Отмечаем на доске поля, которые может бить фигура
        Piece.checkPositions.forEach(coor=>{
            if(!(this.deskGrid[coor.x][coor.y])){
                this.deskGrid[coor.x][coor.y]=enumPieces.checkPosition;
            }
        });
    }

    checkSquare(x,y){
    //Проверка шахматной клетки на состояние: наличие на ней фигуры или поле под ударом
    //Возвращается значение перечиcления enumPieces. Если клетка пустая и не бьётся, возвращается 0.
        return this.deskGrid[x][y];
    }

    #clearDesk(){
        this.deskGrid=new Array(8);
        for(let i=0;i<8;++i){
            this.deskGrid[i]= new Array(8).fill(0);
        }
        this.chessPiece.length=0;
    }
}