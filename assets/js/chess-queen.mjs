"strict mode";

import { enumPieces, enumPiecesNames } from "./chessModules/const-chess.mjs";

let proccessMessageDiv=document.getElementById('calc-proccess')

const worker = new Worker('assets/js/chess-queen-work.mjs', { type: "module" });

worker.addEventListener('message',e=>{
  let message=e.data;
  proccessMessageDiv.innerText=message.msg;
  if(message.process=="end"){
    setTimeout(worker.terminate,0)
  }
  else if(message.process=="calculation"){
    createHTMLChessDesk(message.count, "chess-queen-result", message.desk);
  }
});



function createHTMLChessDesk(count, divID, objChessDesk){
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

      let img="";
      if(objChessDesk.deskGrid[i][j]>0){
        let figure=objChessDesk.deskGrid[i][j];
        img=`<img src="assets/img/chess/${enumPiecesNames[figure]}.svg">`;
      };


      squareRow+=`<div class="chess-square ${squareColor}" >
                    ${img}
                  </div>`;
    }
    desk+=`<div class="chess-row" >${squareRow}</div>`;
  }
  desk=`<div>Решение №${count}<div><div class="chess-desk" >${desk}</div>`;
  document.getElementById(divID).insertAdjacentHTML("beforeend",desk);
}

