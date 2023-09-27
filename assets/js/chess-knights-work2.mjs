//Модуль для расчёта позиции коней методом просчёта вариантов расположения коня в своём блоке доски

//12 коней исходя из симметрии наверняка равномерно распределятся по доске - примерно по 3 коня в свою четверть доски. Но это не точно
//Поэтому делим доску на 4 перекрывающиеся четверти размером 5х5, распределяем коней по своим четвертям и перебираем
//варианты расположения каждого коня в своей четверти.
//Алгоритм позволяет сократить объем перебора


import { ChessPiece } from "./chessModules/ChessPiece.mjs";
import { ChessDesk } from "./chessModules/ChessDesk.mjs";
import { enumPieces } from "./chessModules/const-chess.mjs";

const dbName="worker2";//Имя базы данных, в которой хранятся параметры вычислений данного модуля
const maxKnightsCount=12;//Кол-во коней, которое необходимо расставить на доске
const quartSize=4;//Размер стороны одной пересекающейся четверти
const quartSizeSquare=quartSize*quartSize;//Кол-во клеток в квадратке четверти
const quartKnightCount= Math.floor(maxKnightsCount/4);//Кол-во фигур в четверти
const floatKnightCount=maxKnightsCount%4;//Кол-во плавающих по четвертям коней в случае maxKnightsCount не кратного 4-м
//Класс четверти доски со стартовыми координатами на шахматной доске
const Quart=function(xStart, yStart){
  this.x=xStart;
  this.y=yStart;
}

//Объект для передачи сообщений из worker-а через функцию returnMessageToBrowser
//{process: "start" || "calculation" || "tech-data" || "end", msg: string , count:undefined || number, desk: undefined || desk};
//
//process: - системные сообщения о статусе процесса вычисления "start","calculation", "tech-data", "end" (необходимо для завершения worker-а через terminate)
//при process: tech-data для браузера возвращается состояние фигур для отображения технической позиции фигур в поиске
//msg - пользовательские сообщения для вывода в браузер 
//count - порядковый номер передаваемого решения;
//desk - возвращает объект desk если process: calculation или tech-data
/*
indexedDB.deleteDatabase(dbName);
debugger;*/



let globalChessResult=[];//Массив конфигураций доски с найденным решением
let moduleCounter=0;//Глобальный счётчик итераций циклов поиска решения.
let indexArray= new Array(maxKnightsCount).fill(0);//Массив для хранения расчётных индексов
//Создаю массив с объектами координат четвертей
let quarts=[new Quart(0,0), new Quart(4,0), new Quart(0,4), new Quart(4,4)];
let desk=new ChessDesk();

//Инициализация параметров для расчёта через indexedDB
let openRequest = indexedDB.open(dbName, 1);
let db;

openRequest.onupgradeneeded = function() {
  // Создаём базу данных
  db = openRequest.result;
  const store = db.createObjectStore("workerObjects",{keyPath: 'variable', autoIncrement: false});

  //Начальная инициализация значений в базе данных при её создании
  store.put({variable: "moduleCounter", value: moduleCounter});
  store.put({variable: "globalChessResult", value: globalChessResult});
  store.put({variable: "indexArray", value: indexArray});
};

openRequest.onsuccess = function() {
  db = openRequest.result;
  let transaction = db.transaction("workerObjects", "readwrite");
  let worker=transaction.objectStore("workerObjects");
  const request=worker.getAll();
  request.onsuccess=(e)=>{
    const matching = request.result;
    indexArray=matching.find(el=>el.variable=="indexArray").value;
    moduleCounter=matching.find(el=>el.variable=="moduleCounter").value;
    globalChessResult=matching.find(el=>el.variable=="globalChessResult").value;
    
    
  }
  transaction.oncomplete=()=>{
    setTimeout(()=>{
      if(!indexArray.reduce((sum,el)=>sum+el)){
        //Стартовых позиций перебора нет. Поиск начинаем с самого начала
        setKnights(maxKnightsCount,0,desk);
      }
      else{
        setKnights(maxKnightsCount,indexArray[maxKnightsCount-1],desk, true);
      }
    },0);
  }
};



openRequest.onerror = function (event) {
  debugger;
  alert(    "Почему вы не позволяете моему веб-приложению использовать IndexedDB?!" );
};




function setKnights(n, square, desk, initialFromArray=false){
//Функция установки шахматной королевы на клетку x,y
//n-кол-во неустановленных коней (глубина рекурсии. дно рекурсии при n==1)
//square - порядковый номер клетки в соответствующей четверти доски, с которой начинается расстановка фигур в четверти. Всегда на 1 больше чем предыдущая позиция фигуры в четверти
//desk - объект шахматной доски, на которой происходит установка коней
//db - объект для работы с базой данных (сохранение промежуточных результатов расчёта)
//initial - инициализация конфигурации фигур по данным из массива индексов
//удачную конфигурацию для максимальной рекурсии сохраняем в глобальный массив

  
  let quartNum=Math.floor((maxKnightsCount-n)/quartKnightCount);//Делением на кол-во фигур в четверти получили номер четверти для данной фигуры
  let quartKnightNum=(maxKnightsCount-n) % quartKnightCount;//Номер фигуры в четверти

  let startIndexNum=initialFromArray?indexArray[n-1]:(quartKnightNum?square:0);
  
  for(let i=startIndexNum;i<quartSizeSquare-quartKnightCount+quartKnightNum+1;++i){
    //Рассчитываем координаты фигуры на доске
    indexArray[n-1]=i;//Сохраняем информацию о состоянии фигур (индексов в четвертях) в массив
    let x=quarts[quartNum].x+i%quartSize;
    let y=quarts[quartNum].y+Math.floor(i/quartSize);

    if(desk.checkSquare(x,y)<=0){
    //Найдена незанятая клетка на доске.
      let newKnight= new ChessPiece(x,y,enumPieces.knight);//Создаём коня
      desk.addPiece(newKnight);//Ставим коня на шахматную доску
      if(n==1){
        ++moduleCounter;
        if(!(moduleCounter%(1e+7))){
          //Сохраняем результаты промежуточных расчётов
          returnMessageToBrowser("tech-data",`Идёт поиск. Найдено ${globalChessResult.length} решений, ${moduleCounter/(1e+9)} млрд. переборов в циклах`,  globalChessResult.length, desk);
          self.postMessage({process:"db", msg: "", dbData: {dbName: dbName, globalChessResult: globalChessResult, moduleCounter: moduleCounter, indexArray:indexArray}});
        }
      //Рекурсия дошла до конца, все фигуры расставлены.
      //Проверяем все клетки доски на наличие небьющихся позиций
        if(desk.isAllSquaresChecked()){
          //Очередное решение найдено
          SaveChessResult(desk);
        }
      }
      else{
      //Рекурсия не достигла максимальной глубины. Выполняем расстановку фигур далее
        
        initialFromArray=setKnights(n-1, i+1, desk, initialFromArray); 
      }
      //удаляем коня с доски, чтобы попытаться переставить его в цикле на этом же уровне на другую клетку
      desk.removePiece();
    }
  }
  return false;//Был выход из дна рекурсии. Инициализация из массива больше не требуется
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