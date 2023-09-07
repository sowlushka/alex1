"strict mode";

import { ChessPiece } from "./chessModules/ChessPiece.mjs";
import { ChessDesk } from "./chessModules/ChessDesk.mjs";
import { enumPieces } from "./chessModules/const-chess.mjs";

let queen1=new ChessPiece(1,1,enumPieces.queen);
let queen2=new ChessPiece(2,3,enumPieces.queen);

/*console.clear();
console.log(queen1);
console.log(queen2);*/
let desk=new ChessDesk();
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