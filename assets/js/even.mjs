"use strict";

export const arrLength=1e+7;//Размер массива случайных чисел для теста скорости
export const integerMaxLimit=1e+8;//Предельное целое случайное число, являющееся элементом массива
export const testCount=100;//Кол-во тестов для анализа статистики

const worker = new Worker('assets/js/even-workspace.mjs', { type: "module" });






//Слушаем прогресс вычислений
worker.addEventListener('message',e=>{
  let calcStatus=document.querySelector(".calc-status");
  let message=e.data;
  
  if(message.process=="end"){
    calcStatus.innerText="Вычисления закончены"
    setTimeout(worker.terminate,0);
  } 
  else if (message.percent==100 && message.process=="calculation"){
    showMessage(message.msg);
  }
  else{
    calcStatus.innerHTML=message.msg;
  }

});


function showMessage(mess){
//Отображение сообщений в браузер о результатах работы
    let div=document.querySelector('.even-result');
    let htmlMess=`<div class="calc-info">${mess}</div>`;
    div.insertAdjacentHTML("beforeend",htmlMess);
}