"use strict";

let olSelectors=document.querySelectorAll("body > ol");
const gradient1="linear-gradient(rgb(238,238,191), #cdf0fa)";
const gradient2="linear-gradient(rgb(238,238,191), #f8e4fa)";

/*Отделяем тематические блоки черезполосным фоновым раскрашиванием */
olSelectors.forEach((ol,index)=>{

        /* ol.style.backgroundColor=index%2?"cornsilk":"floralwhite"; */
        ol.style.background=index%2?gradient1:gradient2;
    }    
);