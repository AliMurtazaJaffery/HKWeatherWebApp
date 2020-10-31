var headerTag=document.createElement("header");
headerTag.classList.add("headerBlock");
document.body.appendChild(headerTag);
headerTag.innerHTML;


var divBttn=document.createElement("div");
divBttn.classList.add("divBttnBlock");
divBttn.innerHTML="<button id='currentWeather' class='menuBttn'>Temperature</button>";
divBttn.innerHTML+="<button id='forecast' class='menuBttn'>Forecast</button>";
document.body.appendChild(divBttn);

var mainImplementation=document.createElement("main");
mainImplementation.setAttribute("id","mainSection");
document.body.appendChild(mainImplementation);


function createHeader(response){
  let currentWeatherData=response;
  headerTag.innerHTML="";
  headerTag.innerHTML+='<button id="reload" onclick="window.location.reload();"></button>'; //add image using css property
  headerTag.innerHTML+='<h1 id="pageHeading">Weather in Hong Kong</h1>';


  headerTag.innerHTML+='<div id="headerIcons"></div>';
  let headIcons=document.getElementById('headerIcons');
  headIcons.innerHTML='<img id="weatherIcon" class="icons iconBlock" src="https://www.hko.gov.hk/images/HKOWxIconOutline/pic'+currentWeatherData.icon[0]+ '.png" />';

  headIcons.innerHTML+='<div id="temperatureBlock" class="iconBlock"></div>';
  let temperature=document.getElementById('temperatureBlock');
  temperature.innerHTML='<img id="temperatureIcon" class="icons" src="images/thermometer1.png"/>';
  temperature.innerHTML+='<h5 id="temperatureText" class="textUnderIcon">'+currentWeatherData.temperature.data[1].value+'°C</h5>'



  headIcons.innerHTML+='<div id="humidityBlock" class="iconBlock"></div>';
  let humidity=document.getElementById('humidityBlock');
  humidity.innerHTML='<img id="humidityIcon" class="icons" src="images/humidity.png"/>';
  humidity.innerHTML+='<h5 id="humidityText" class="textUnderIcon">'+currentWeatherData.humidity.data[0].value+'%</h5>'


  headIcons.innerHTML+='<div id="rainBlock" class="iconBlock"></div>';
  let rain=document.getElementById('rainBlock');
  rain.innerHTML='<img id="rainIcon" class="icons" src="images/rain1.png"/>';
  rain.innerHTML+='<h5 id="rainText" class="textUnderIcon">'+currentWeatherData.rainfall.data[13].max+'mm</h5>'


  if (currentWeatherData.uvindex.data){ //might consider adding index
    headIcons.innerHTML+='<div id="uvIndexBlock" class="iconBlock"></div>';
    let uvIndex=document.getElementById('uvIndexBlock');

    uvIndex.innerHTML='<img id="uvIndexIcon" class="icons" src="images/uv1.png"/>';
    uvIndex.innerHTML+='<h5 id="uvIndexText" class="textUnderIcon">'+currentWeatherData.uvindex.data[0].value+'</h5>';
  }
  //
  if (currentWeatherData.warningMessage){ //might consider adding index
    headerTag.innerHTML+='<button id="warningButton">Warning <img id="warningIcon" onmouseover="warningButtonShow()" onmouseout="warningButtonHide()" src="images/arrow.png"/></button>';
    headerTag.innerHTML+='<p id="warningText">'+currentWeatherData.warningMessage[0]+'</p>';
    document.getElementById("warningText").style.visibility="hidden";
    // document.getElementById("warningIcon").onmouseover=warningButtonShow;
    // document.getElementById("warningIcon").onmouseout=warningButtonHide();
    // document.getElementById('warningButton').addEventListener("mouseover", warningButtonShow);
    // document.getElementById('warningButton').addEventListener("mouseout", warningButtonHide);
  }
// document.getElementById('warningText').innerText=currentWeatherData.warningMessage[0];
  headerTag.innerHTML+='<p id="updateTime">Last Update: '+currentWeatherData.updateTime.substr(11,5)+'</p>';
}
function warningButtonShow(){
  document.getElementById("warningText").style.visibility="visible";
}
function warningButtonHide(){
  document.getElementById("warningText").style.visibility="hidden";
}


fetchCurrentWeatherRequest();
let currentWeatherBttn=document.getElementById("currentWeather");
let forecastBttn=document.getElementById("forecast");

currentWeatherBttn.addEventListener('click',fetchCurrentWeatherRequest);
forecastBttn.addEventListener('click',fetchForecastRequest);

function fetchCurrentWeatherRequest(){
  fetch("https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en").then(getJSON).then(currentWeatherAcceptor)
}
function fetchForecastRequest(){
  fetch("https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang=en").then(getJSON).then(forecastAcceptor)
}
function currentWeatherAcceptor(response){

  createHeader(response);
  //for current weather part
  let blockContent;
  let blockDiv;
  let currentWeatherHTML="";
  let weatherData=response.temperature.data;
  for(var i=0;i<weatherData.length;i++){
    // blockDiv="<div class='weatherBlock' id='district"+i+"'></div>";
    // currentWeatherHTML.innerHTML+=blockDiv
    // blockDiv=document.createElement('div');
    // blockDiv.setAttribute("id","district"+i);
    // blockDiv.setAttribute("class","weatherBlock");
    blockContent='<button onclick="deleteFunction(district'+i+')" class="closeButton"></button>';
    blockContent+='<h4 class="district">'+weatherData[i].place+'</h4>';
    blockContent+='<p class="districtTemperature">'+weatherData[i].value+'°C</h4>';
    blockDiv="<div class='weatherBlock' id='district"+i+"'>"+blockContent+"</div>";
    // document.getElementById('district'+i).innerHTML=blockContent;
    // currentWeather+=blockDiv;
    currentWeatherHTML+=blockDiv;

  }
  currentWeatherHTML='<div class="currentWeatherMain">'+currentWeatherHTML+'</div>';
  document.getElementById('mainSection').innerHTML=currentWeatherHTML;

}


function deleteFunction(districtId){
  districtId.remove();
}



function forecastAcceptor(response){
  let block_tag;
  let forecastInnerHTML="";
  let forecastData=response.weatherForecast;
  let blockContent;
  for(var i=0;i<9;i++){
    // block_tag="<div class='forecastBlock' id='day"+i+"'></div>"; when i was setting innerHTML, i wasn't able to create id tag
    blockContent='<img class="weatherIcon" src="https://www.hko.gov.hk/images/HKOWxIconOutline/pic' +forecastData[i].ForecastIcon+ '.png"/>';
    blockContent+='<h4 class="date">'+forecastData[i].forecastDate.substr(6,2)+'/'+forecastData[i].forecastDate.substr(4,2)+'</h4>';
    blockContent+='<h4 class="day">'+forecastData[i].week+'</h4>';
    blockContent+='<p class="minMaxTemp">'+forecastData[i].forecastMintemp.value+'°C | '+forecastData[i].forecastMaxtemp.value+'°C</p>';
    blockContent+='<p class=minMaxHumidity>'+forecastData[i].forecastMinrh.value+'% - '+forecastData[i].forecastMaxrh.value+'%</p>';
    block_tag="<div class='forecastBlock' id='day"+i+"'>"+blockContent+"</div>";
    forecastInnerHTML+=block_tag;
  }
  forecastInnerHTML='<div class="forecastMain">'+forecastInnerHTML+'</div>';
  document.getElementById('mainSection').innerHTML=forecastInnerHTML;
}
function getJSON(response){
  return response.json();
}
