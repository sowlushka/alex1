export class ChessQueen {
    x;
    y;
    constructor(x,y){
        if(x<0 || x>7 || Math.floor(x)!=x) throw new Error("Некорректная координата X");
        if(y<0 || y>7 || Math.floor(y)!=y) throw new Error("Некорректная координата y");
        this.x=x; this.y=y;
    }

}