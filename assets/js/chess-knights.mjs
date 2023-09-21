"strict mode";

import { enumPieces, enumPiecesNames } from "./chessModules/const-chess.mjs";
const techResult=true;

let proccessMessageDiv=document.getElementById('calc-proccess')

const worker = new Worker('assets/js/chess-knights-work.mjs', { type: "module" });

worker.addEventListener('message',e=>{
  let message=e.data;
  proccessMessageDiv.innerText=message.msg;
  if(message.process=="end"){
    setTimeout(worker.terminate,0)
  }else if(message.process=="tech-data"){
    createHTMLChessDesk(message.count, "tech-result", message.desk, techResult);
  }
  else if(message.process=="calculation" && message.desk){
    createHTMLChessDesk(message.count, "chess-queen-result", message.desk);
  }
});



function createHTMLChessDesk(count, divID, objChessDesk, techResult=false){
//Функция рисует в браузере доску с положением фигур для найденного решения
//Если techResult=true, выводятся техническое состояние фигур в процессе перебора, не являющееся решением и 
//выполняется не добавление решение, а перерисовка технического блока с рисунком доски
  let squareColor;
  let desk="";
  
  for(let i=0;i<8;++i){
    let squareRow="";
    for(let j=0;j<8;++j){
      let figure=objChessDesk.deskGrid[i][j];

      /*--------------------------------------------------------------------------------------------*/
      /*В коде ниже я хочу получить индекс фигуры в массиве, чтобы отобразить его на шахматной доске над картинкой коня.
      В текущей реализации кода пока что над картинкой коня отображается номер фигуры из перечня фигур*/
      let figureIndex;
      if (figure>0){
        figureIndex=objChessDesk.chessPiece.findIndex(piece=>piece.x==i && piece.y==j);
        let x=objChessDesk.chessPiece[0].x;
        //debugger
      }
      /*--------------------------------------------------------------------------------------------*/
      

      if((i+j)%2){
        squareColor="black-square";
      }
      else{
        squareColor="white-square";
      }

      let img="";
      if(objChessDesk.deskGrid[i][j]>0){
        
        img=`<img src="assets/img/chess/${enumPiecesNames[figure]}.svg">`;
      };

      
      squareRow+=`<div class="chess-square ${squareColor}" >
                  <div class="piece-num">${figure?figure:""}</div>
                    ${img}
                  </div>`;
    }
    desk+=`<div class="chess-row" >${squareRow}</div>`;
  }
  
  if(techResult){
    //Промежуточные данные. Выполняем перерисовку
    desk=`<div class="chess-desk" >${desk}</div>`;
    document.getElementById(divID).innerHTML=desk;
  }else{
    //Получено решение. Добавляем его к остальным
    desk=`<div>Решение №${count}<div><div class="chess-desk" >${desk}</div>`;
    document.getElementById(divID).insertAdjacentHTML("beforeend",desk);
  }
  
}

