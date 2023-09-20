"strict mode";

import {arrLength} from "./even.mjs";
import {integerMaxLimit} from "./even.mjs";
import {testCount} from "./even.mjs";

let msg;//Переменная для создания текстового сообщения для функции отправки сообщений


//Объект для передачи сообщений
//{process: "start" || "calculation" || "end", msg: string , percent:undefined || number};
//process: - системные сообщения о статусе процесса вычисления "start","calculation","end" (необходимо для завершения worker-а через terminate)
//msg - пользовательские сообщения для вывода в браузер 
//percent - прогресс выполнения задачи в процентах;
//
//При percent=100, process="calculation" основной скрипт будет выводить результат вычислений в браузере



returnMessageToBrowser("start","Старт вычислений", 0);

/*Создаём два статистических массива
для оценки влияния порядка команд в коде
*/
let statisticArray_BitDiv=[];
statisticArray_BitDiv['bit']=new Array(testCount);
statisticArray_BitDiv['div']=new Array(testCount);

let statisticArray_DivBit=[];
statisticArray_DivBit['div']=new Array(testCount);
statisticArray_DivBit['bit']=new Array(testCount);

/*Задаём функции-фильтры, которые будем тестить*/
let filterDiv=element=>!(element%2);
let filterBit=element=>!(element & 1);



//Считаем скорости работы фильтров (сначала bit, потом div)
for(let i=0;i<testCount;++i){
  let arr=new Array(arrLength).map(()=>Math.floor(Math.random()*integerMaxLimit));
  
  statisticArray_BitDiv['bit'][i]=performance.now();
  arr.filter(filterBit);
  statisticArray_BitDiv['bit'][i]=performance.now() - statisticArray_BitDiv['bit'][i];
  
  statisticArray_BitDiv['div'][i]=performance.now();
  arr.filter(filterDiv);
  statisticArray_BitDiv['div'][i]=performance.now() - statisticArray_BitDiv['div'][i];

  let percent=Math.floor((i+1)/testCount*100);
  if(percent<100){
    msg="Порядок расчета: фильтр <font color='red'>&</font>, потом фильтр <font color='red'>%</font>.<br>Выполнено "+Math.floor((i+1)/testCount*100)+"%";
    returnMessageToBrowser("calculation",msg, percent);
  }

}


msg=`<div>Проведено ${testCount} испытаний на случайных массивах целых чисел размером ${arrLength} элементов</div>
<div> Фильтр ${filterBit} отработал первым</div>
<div> Фильтр ${filterDiv} отработал вторым</div>
<div> Средняя скорость битового фильтра: ${(statisticArray_BitDiv['bit']).reduce((sum,a)=>sum+a)/testCount} мс </div>
<div> Средняя скорость фильтра на деление: ${(statisticArray_BitDiv['div']).reduce((sum,a)=>sum+a)/testCount} мс </div>
`;
returnMessageToBrowser("calculation",msg, 100);//Отправляем сообщение в div для результата 100% выполнения, process="calculation"


//Считаем скорости работы фильтров (сначала div, потом bit)
for(let i=0;i<testCount;++i){
  let arr=new Array(arrLength).map(()=>Math.floor(Math.random()*integerMaxLimit));
  
  statisticArray_DivBit['div'][i]=performance.now();
  arr.filter(filterDiv);
  statisticArray_DivBit['div'][i]=performance.now() - statisticArray_DivBit['div'][i];
  
  statisticArray_DivBit['bit'][i]=performance.now();
  arr.filter(filterBit);
  statisticArray_DivBit['bit'][i]=performance.now() - statisticArray_DivBit['bit'][i];

  let percent=Math.floor((i+1)/testCount*100);
  if(percent<100){
    msg="Порядок расчета: фильтр <font color='red'>%</font>, потом фильтр <font color='red'>&</font>.<br>Выполнено "+Math.floor((i+1)/testCount*100)+"%";
    returnMessageToBrowser("calculation",msg, percent);
  }
}

msg=`<div>Проведено ${testCount} испытаний на случайных массивах целых чисел размером ${arrLength} элементов</div>
<div> Фильтр ${filterDiv} отработал первым</div>
<div> Фильтр ${filterBit} отработал вторым</div>
<div> Средняя скорость фильтра на деление: ${(statisticArray_DivBit['div']).reduce((sum,a)=>sum+a)/testCount} мс </div>
<div> Средняя скорость битового фильтра: ${(statisticArray_DivBit['bit']).reduce((sum,a)=>sum+a)/testCount} мс </div>
`;
returnMessageToBrowser("calculation",msg, 100);//Отправляем сообщение в div для результата 100% выполнения, process="calculation"

returnMessageToBrowser("end","Вычисления закончены", 0);

function returnMessageToBrowser(process, message, percent){
//Отправка сообщений о выполнении процесса расчёта в браузер
    self.postMessage({process:process, msg: message, percent:percent});
}