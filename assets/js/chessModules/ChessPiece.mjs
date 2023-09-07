import {enumPieces} from './const-chess.mjs';

export class ChessPiece {
    #x;//Координата x фигуры на шахматной доске
    #y;//Координата y фигуры на шахматной доске
    #enumPiece;//Название фигуры из перечня объекта enumPieces
    #name; //Название фигуры
    checkPositions;//Массив с координатами полей, куда может походить фигура из текущего положения


    constructor(x,y,enumPiece){
        this.setCoor(x,y);
        this.#x=x; this.#y=y;
        this.#enumPiece=enumPiece;
        this.#setName(enumPiece);
        this.#calcPieceCheckSquares(enumPiece, x, y);
    }

    set x(x){
        if(x<1 || x>8 || Math.floor(x)!=x) throw new Error("Некорректная координата X");
        this.#x=x;
    }

    get x(){
        return this.#x;
    }

    set y(y){
        if(y<1 || y>8 || Math.floor(y)!=y) throw new Error("Некорректная координата y");
        this.#y=y;
    }

    get y(){
        return this.#y;
    }

    get Piece(){
        return this.#enumPiece;
    }

    setCoor(x,y){
        if(x<1 || x>8 || Math.floor(x)!=x) throw new Error("Некорректная координата X");
        if(y<1 || y>8 || Math.floor(y)!=y) throw new Error("Некорректная координата y");
        this.#x=x; this.#y=y;
    }

    #setName(enumPiece){
        switch(enumPiece){
            case enumPieces.pawn:
                this.#name="pawn";
                break;
            case enumPieces.bishop:
                this.#name="bishop";
                break;
            case enumPieces.knight:
                this.#name="knight";
                break;
            case enumPieces.rook:
                this.#name="rook";
                break;
            case enumPieces.queen:
                this.#name="queen";
                break;
            case enumPieces.king:
                this.#name="king";
        }
    }

    get name(){
        return this.#name;
    }

    #calcPieceCheckSquares(enumPiece, x, y){
        switch(enumPiece){
            case enumPieces.queen:
                this.checkPositions=this.#calcQueenCheckSquares(x,y);
                break;
            case enumPieces.knight:
            /*тут будет код для решения задачи про коней */
            break;
        }
    }

    #calcQueenCheckSquares(x,y){
    //Метод вычисления клеток, которые бьются королевой, стоящей в координатах x,y
    //Возвращается массив объектов {x,y}
        let check=[];

        for(let i=1; i<=8;++i){
        //Прощитываем вертикальные клетки
            if(i==y)continue;
            check.push({x,i});
        }

        for(let i=1; i<=8;++i){
            //Прощитываем горизонтальные клетки
                if(i==x)continue;
                check.push({i,y});
        }

        for(let i=-7; i<=7;++i){
        //Прощитываем главную диагональ. i - позиция клетки относительно текущего положения фигуры
            let checkSquareX=x+i;
            let checkSquareY=y+i;
            if((checkSquareX==x && checkSquareY==y) ||  checkSquareX<1 || checkSquareX>8 || checkSquareY<1 || checkSquareY>8)continue;
            check.push({checkSquareX,checkSquareY});
        }

        for(let i=-7; i<=7;++i){
            //Прощитываем побочную диагональ. i - позиция клетки относительно текущего положения фигуры
                let checkSquareX=x+i;
                let checkSquareY=y-i;
                if((checkSquareX==x && checkSquareY==y) ||  checkSquareX<1 || checkSquareX>8 || checkSquareY<1 || checkSquareY>8)continue;
                check.push({checkSquareX,checkSquareY});
            }
        
        return check;
    }

}