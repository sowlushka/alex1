"strict mode";

import { ChessQueen } from "./ChessQueen.mjs";
import { ChessDesk } from "./ChessDesk.mjs";

let queen=new ChessQueen(1,1);
let desk=new ChessDesk();

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