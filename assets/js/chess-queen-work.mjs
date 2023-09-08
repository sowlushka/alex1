"strict mode";

import { ChessPiece } from "./chessModules/ChessPiece.mjs";
import { ChessDesk } from "./chessModules/ChessDesk.mjs";
import { enumPieces } from "./chessModules/const-chess.mjs";


//Объект для передачи сообщений
//{process: "start" || "calculation" || "end", msg: string , count:undefined || number, desk: undefined || desk};
//process: - системные сообщения о статусе процесса вычисления "start","calculation","end" (необходимо для завершения worker-а через terminate)
//msg - пользовательские сообщения для вывода в браузер 
//count - порядковый номер передаваемого решения;
//desk - возвращает объект desk если process: calculation


returnMessageToBrowser("start","Старт вычислений", 0, undefined);

const maxQueensCount=8;//Кол-во ферзей, которое необходимо расставить на доске
let globalChessResult=[];//Массив конфигураций доски с найденным решением
let moduleCounter=0;//Глобальный счётчик итераций циклов поиска решения.


let desk=new ChessDesk();
setQueens(maxQueensCount,desk);

returnMessageToBrowser("end",`Вычисления завершены. Всего решений: ${globalChessResult.length}`, globalChessResult.length ,undefined);


function setQueens(n, desk){
//Функция установки шахматной королевы на клетку x,y
//n-кол-во неустановленных ферзей (глубина рекурсии)
//desk - объект шахматной доски, на которой происходит установка ферзей

//Возвращает из рекурсии объект {max:n, deskResult}
//где n-кол-во максимально расставленных фигур для текущей конфигурации
//deskResult - конфигурация фигур на доске.
//удачную конфигурацию для максимальной рекурсии сохраняем в глобальный массив
  for(let x=0;x<8;++x){
    //if(n==8)document.getElementById("calc-proccess").innerText="Выполняется поиск для x="+x;
    
    for(let y=0;y<8;++y){
      ++moduleCounter;
      if(desk.checkSquare(x,y)==0){
      //Найдена клетка на доске, которая не бьётся уже имеющимися на доске фигурами
        let newQueen= new ChessPiece(x,y,enumPieces.queen);//Создаём ферзя
        desk.addPiece(newQueen);//Ставим ферзя на шахматную доску
        if(n==1){
        //Рекурсия дошла до конца, все фигуры расставлены. Сохраняем удачное решение в глобальную переменную
          SaveChessResult(desk);
          //console.log("Найдено решений: "+globalChessResult.length);
        }
        else{
        //Рекурсия не достигла максимальной глубины. Выполняем расстановку фигур далее
          setQueens(n-1,desk); 
        }
        //удаляем ферзя с доски, чтобы попытаться переставить его в цикле на этом же уровне на другую клетку
        desk.removePiece();
      }

    }
  }
}

function SaveChessResult(desk){
//Сохранение удачной конфигурации расстановки фигур в глобальную переменную
  
  //Проверяем поступивший массив на совпадение с имеющимися в решениях массивами
  for(let i=0;i<globalChessResult.length;++i){
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

  globalChessResult.push(structuredClone(desk));//Копию объекта сохранили в массив
  returnMessageToBrowser("calculation",`Идёт поиск. Найдено ${globalChessResult.length} решений, ${moduleCounter} переборов в циклах`,
        globalChessResult.length, desk);
}

function returnMessageToBrowser(process, message, count, desk){
//Отправка сообщений о выполнении процесса расчёта в браузер
    self.postMessage({process:process, msg: message, count:count, desk: desk});
}