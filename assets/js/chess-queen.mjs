"strict mode";

import { ChessPiece } from "./chessModules/ChessPiece.mjs";
import { ChessDesk } from "./chessModules/ChessDesk.mjs";
import { enumPieces } from "./chessModules/const-chess.mjs";


const maxQueensCount=8;//Кол-во ферзей, которое необходимо расставить на доске
let globalChessResult=[];//Массив конфигураций доски с найденным решением


let desk=new ChessDesk();
setQueens(maxQueensCount,desk);

desk.addPiece(queen1);
desk.addPiece(queen2);
let deskConsole="";
for(let i=0;i<8;++i){
  for(let j=0;j<8;++j){
    deskConsole+=desk.deskGrid[i][j]+" ";
  }
  deskConsole+="\n";
}
console.log(deskConsole);


createHTMLChessDesk(1, "chess-queen-result");

function createHTMLChessDesk(deskNum, divID){
  let squareColor;
  let desk="";
  
  for(let i=0;i<8;++i){
    let squareRow="";
    for(let j=0;j<8;++j){
      if((i+j)%2){
        squareColor="black-square";
      }
      else{
        squareColor="white-square";
      }
      squareRow+=`<div class="chess-square ${squareColor}" id="d${deskNum}r${i}c${j}"></div>`;
    }
    desk+=`<div class="chess-row" id="d${deskNum}r${i}">${squareRow}</div>`;
  }
  desk=`<div class="chess-desk" id="d${deskNum}">${desk}</div>`;
  document.getElementById(divID).insertAdjacentHTML("beforeend",desk);
}

function setQueens(n, desk){
//Функция установки шахматной королевы на клетку x,y
//n-кол-во неустановленных ферзей (глубина рекурсии)
//desk - объект шахматной доски, на которой происходит установка ферзей

//Возвращает из рекурсии объект {max:n, deskResult}
//где n-кол-во максимально расставленных фигур для текущей конфигурации
//deskResult - конфигурация фигур на доске.
//удачную конфигурацию для максимальной рекурсии сохраняем в глобальный массив
  for(let x=0;x<8;++x){
    for(let y=0;y<8;++y){

      if(desk.checkSquare(x,y)==0){
      //Найдена клетка на доске, которая не бьётся уже имеющимися на доске фигурами
        let newQueen= new ChessPiece(x,y,enumPieces.queen);//Создаём ферзя
        desk.addPiece(newQueen);//Ставим ферзя на шахматную доску
        if(n==1){
        //Рекурсия дошла до конца, все фигуры расставлены. Сохраняем удачное решение в глобальную переменную
          SaveChessResult(desk);
          console.log("Найдено решений: "+globalChessResult.length);
        }
        else{
        //Рекурсия не достигла максимальной глубины. Выполняем расстановку фигур далее
          setQueens(n-1,desk); 
        }
        //удаляем ферзя с доски, чтобы попытаться переставить его в цикле на этом же уровне на другую клетку
        desk.popPiece();
      }

    }
  }
}

function SaveChessResult(desk){
//Сохранение удачной конфигурации расстановки фигур в глобальную переменную
  
  //Проверяем поступивший массив на совпадение с имеющимися в решениях массивами
  for(i=0;i<globalChessResult.length;++i){
    let equal=true;
    for(let x=0;x<8;++x){
      for(let y=0;y<8;++y){
        if(globalChessResult[i].deskGrid[x][y]!=desk.deskGrid[x][y]){
          equal=false;
          break;
        }
      }
      if(!equal)break;
    }
    if(equal)return;//Такой массив в решениях уже есть. Выходим из процедуры
  }

  globalChessResult.push(desk);//Запомнили решение

}