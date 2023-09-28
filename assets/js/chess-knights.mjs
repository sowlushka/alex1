import {enumPiecesNames } from "./chessModules/const-chess.mjs";
const techResult=true;


//const worker1 = new Worker('assets/js/chess-knights-work.mjs', { type: "module" });
const worker2 = new Worker('assets/js/chess-knights-work2.mjs', { type: "module" });

/*
worker1.addEventListener('message',e=>{
  let message=e.data;
  let proccessMessageDiv=document.getElementById('calc-proccess-text1')
  if (message.process!="db") proccessMessageDiv.innerText=message.msg;//Если тип команды не сохранение в БД, то разрешаем комментарий

  if(message.process=="end"){
    setTimeout(worker.terminate,0)
  }else if(message.process=="tech-data"){
    createHTMLChessDesk(message.count, "tech-result1", message.desk, techResult);
  }
  else if(message.process=="db"){
    //Пришло сообщение на сохранение в БД
    //в desk находятся объекты для сохранения. Отправляем их в функцию сохранения БД
    saveToindexedDB(message.dbData);
  }
  else if(message.process=="calculation" && message.desk){
    createHTMLChessDesk(message.count, "chess-knight-result1", message.desk);
  }
});*/

worker2.addEventListener('message',e=>{
  let message=e.data;
  let proccessMessageDiv=document.getElementById('calc-proccess-text2');
  if (message.process!="db") proccessMessageDiv.innerText=message.msg;//Если тип команды не сохранение в БД, то разрешаем комментарий

  if(message.process=="end"){
    setTimeout(worker.terminate,0);
  } else if(message.process=="db"){
    //Пришло сообщение на сохранение в БД
    //в desk находятся объекты для сохранения. Отправляем их в функцию сохранения БД
    saveToindexedDB(message.dbData);
  }
  else if(message.process=="tech-data"){
    createHTMLChessDesk(message.count, "tech-result2", message.desk, techResult);
  }
  else if(message.process=="calculation" && message.desk){
    createHTMLChessDesk(message.count, "chess-knight-result2", message.desk);
  }
});



function createHTMLChessDesk(count, divID, objChessDesk, techResult=false){
//Функция рисует в браузере доску с положением фигур для найденного решения
//Если techResult=true, выводятся техническое состояние фигур в процессе перебора, не являющееся решением и 
//выполняется не добавление решения, а перерисовка технического блока с рисунком доски
  let squareColor;
  let desk="";
  
  for(let i=0;i<8;++i){
    let squareRow="";
    for(let j=0;j<8;++j){
      let figure=objChessDesk.deskGrid[j][i];

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
      if(objChessDesk.deskGrid[j][i]>0){
        
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


function saveToindexedDB(dbData){
//Сохранение промежуточных расчётов в indexedDB
  const requestDB = indexedDB.open(dbData.dbName, 1);//Открываем базу данных

  requestDB.onupgradeneeded = function() {
    // Создаём базу данных
    let db = requestDB.result;
    const store = db.createObjectStore("workerObjects",{keyPath: 'variable', autoIncrement: false});

    //Начальная инициализация значений в базе данных при её создании
    store.put({variable: "moduleCounter", value: moduleCounter});
    store.put({variable: "globalChessResult", value: globalChessResult});
    store.put({variable: "indexArray", value: indexArray});
  };

  requestDB.onsuccess = async function(e) {
    let db = e.target.result;
    let transaction = db.transaction("workerObjects", "readwrite");
    let worker=transaction.objectStore("workerObjects");
    await worker.put({variable: "globalChessResult", value: dbData.globalChessResult});
    await worker.put({variable: "moduleCounter", value: dbData.moduleCounter});
    await worker.put({variable: "indexArray", value: dbData.indexArray});
    db.close();
  }
}
