//Модуль для расчёта позиции коней методом просчёта вариантов расположения коня в своём блоке доски

//12 коней исходя из симметрии наверняка равномерно распределятся по доске - примерно по 3 коня в свою четверть доски. Но это не точно
//Поэтому делим доску на 4 перекрывающиеся четверти размером 5х5, распределяем коней по своим четвертям и перебираем
//варианты расположения каждого коня в своей четверти.
//Алгоритм позволяет сократить объем перебора


import { ChessPiece } from "./chessModules/ChessPiece.mjs";
import { ChessDesk } from "./chessModules/ChessDesk.mjs";
import { enumPieces } from "./chessModules/const-chess.mjs";


//Объект для передачи сообщений из worker-а через функцию returnMessageToBrowser
//{process: "start" || "calculation" || "tech-data" || "end", msg: string , count:undefined || number, desk: undefined || desk};
//
//process: - системные сообщения о статусе процесса вычисления "start","calculation", "tech-data", "end" (необходимо для завершения worker-а через terminate)
//при process: tech-data для браузера возвращается состояние фигур для отображения технической позиции фигур в поиске
//msg - пользовательские сообщения для вывода в браузер 
//count - порядковый номер передаваемого решения;
//desk - возвращает объект desk если process: calculation или tech-data



const maxKnightsCount=12;//Кол-во коней, которое необходимо расставить на доске
let globalChessResult=[];//Массив конфигураций доски с найденным решением
let moduleCounter=0;//Глобальный счётчик итераций циклов поиска решения.
const quartSize=25;//Кол-во клеток в каждой перекрывающейся четверти
const quartKnightCount= Math.floor(maxKnightsCount/4);//Кол-во фигур в четверти
const floatKnightCount=maxKnightsCount%4;//Кол-во плавающих по четвертям коней в случае maxKnightsCount не кратного 4-м

//Объект четверти доски со стартовыми координатами на шахматной доске
const Quart=function(xStart, yStart){
  this.x=xStart;
  this.y=yStart;
}

//Создаю массив с объектами четвертей,
let quarts=[new Quart(0,0), new Quart(3,0), new Quart(0,3), new Quart(3,3)];

returnMessageToBrowser("start","Старт вычислений", 0, undefined);
let desk=new ChessDesk();
setKnights(maxKnightsCount,0,desk);

returnMessageToBrowser("end",`Вычисления завершены. Всего решений: ${globalChessResult.length}`, globalChessResult.length ,undefined);

function setKnights(n, square, desk){
//Функция установки шахматной королевы на клетку x,y
//n-кол-во неустановленных коней (глубина рекурсии. дно рекурсии при n==1)
//square - порядковый номер клетки в соответствующей четверти доски. На след. уровне рекурсии стартовая позиция коня больше чем у предыдущего номера
//desk - объект шахматной доски, на которой происходит установка коней
//удачную конфигурацию для максимальной рекурсии сохраняем в глобальный массив

  
  let quartNum=(maxKnightsCount-n)>>2;//Делением на 4 получили номер четверти для данной фигуры
  let quartKnightNum=(maxKnightsCount-n) & 4;//Номер фигуры в четверти
  
  for(let i=0;i<qartSize-quartKnightCount+quartKnightNum;++i){
    ////////////////ДАЛЬШЕ БУДУ ДУМАТЬ ЗАВТРА
    let x=i >> 3;//Сдвиг на 3 бита вправо. Эквивалент деления на 8 без остатка
    let y=i & 7; //Остаток от деления на 8
    ++moduleCounter;

    if(!(moduleCounter%(5e+6))){
      returnMessageToBrowser("tech-data",`Идёт поиск. Найдено ${globalChessResult.length} решений, ${(moduleCounter/(1e+9)).toFixed(3)} млрд. переборов в циклах`,  globalChessResult.length, desk);
    }


    if(desk.checkSquare(x,y)<=0){
    //Найдена незанятая клетка на доске.
      let newKnight= new ChessPiece(x,y,enumPieces.knight);//Создаём коня
      desk.addPiece(newKnight);//Ставим коня на шахматную доску
      if(n==1){
      //Рекурсия дошла до конца, все фигуры расставлены.
      //Проверяем все клетки доски на наличие небьющихся позиций
        if(desk.isAllSquaresChecked()){
          //Очередное решение найдено
          SaveChessResult(desk);
        }
      }
      else{
      //Рекурсия не достигла максимальной глубины. Выполняем расстановку фигур далее
        setKnights(n-1, i+1, desk); 
      }
      //удаляем коня с доски, чтобы попытаться переставить его в цикле на этом же уровне на другую клетку
      desk.removePiece();
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