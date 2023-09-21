import { ChessPiece } from "./ChessPiece.mjs";
import {enumPieces, enumPiecesNames} from "./const-chess.mjs";//Перечисление шахматных фигур
import {returnMessageToBrowser} from "../chess-knights-work.mjs";

export class ChessDesk {
    chessPiece=[];//Перечень объектов на доске
    deskGrid;//Координатная сетка доски, заполненная фигурами

    constructor(){
        this.clearDesk(); //Чистим доску
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
        
        //Добавляем на доске поля, которые может бить фигура
        Piece.checkPositions.forEach(coor=>{
            if(!(this.deskGrid[coor.x][coor.y])){
                this.deskGrid[coor.x][coor.y]=enumPieces.checkPosition;
            }
        });
    }

    removePiece(){
    //Удалить последнюю фигуру с доски
        //returnMessageToBrowser("tech-data",``, 0, this);
        this.chessPiece.pop();
        this.#renderDesk();//Перерисовываем позиции фигур на доске и полей, которые они бьют
       // returnMessageToBrowser("tech-data",``, 0, this);
    }

    checkSquare(x,y){
    //Проверка шахматной клетки на состояние: наличие на ней фигуры или поле под ударом
    //Возвращается значение перечиcления enumPieces. Если клетка пустая и не бьётся, возвращается 0.
        return this.deskGrid[x][y];
    }

    isAllSquaresChecked(){
     //Метод проверяет наличие хотя бы одной небьющейся клетки на доске
     let allIsChecked=true;
     for(let x=0;x<8 && allIsChecked;++x){
        for(let y=0;y<8;++y){
            if(!this.deskGrid[x][y]){
                allIsChecked=false;
                break;
            }
        }
     }
    return  allIsChecked;  
    }

    clearDesk(){
        this.deskGrid=new Array(8);
        for(let i=0;i<8;++i){
            this.deskGrid[i]= new Array(8).fill(0);
        }
        this.chessPiece.length=0;
    }

    #renderDesk(){
    //Пересчёт состояния клеток доски
        for(let i=0;i<8;++i){
        //Очистка клеток доски
            this.deskGrid[i].fill(0);
        }

        this.chessPiece.forEach(piece=>{
            this.deskGrid[piece.x][piece.y]=piece.enumPiece;//Прописали на доске фигуру
            piece.checkPositions.forEach(coor=>{//Для каждой фигуры отмечаем поля, которые она может бить
                if(this.deskGrid[coor.x][coor.y]==0){
                    this.deskGrid[coor.x][coor.y]=enumPieces.checkPosition;
                }
            });
        });
    }
}