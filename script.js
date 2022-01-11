var date = new Date();
let weekDays = getWeekDay(date);
function getWeekDay(date) {
    let days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
      return days[date.getDay()];
}

const cloudsData = [
    {text: 'Солнечно', img: 'sun.svg'},
    {text: 'Легкая облачность', img: 'cloudsLight.png'},
    {text: 'Возможен дождь', img: 'cloudsBig.png'},
];

const body=document.body;
let year = date.getFullYear();
let month = date.getMonth();
let day = date.getDate();

// 
let headerElement = document.querySelector('header');
let dayElement = document.querySelector('.day');
let weekElement = document.querySelector('.week');
let cities = document.querySelector('.city');
let mainStatus = document.querySelector('#status');
let mainImg = document.querySelector('#mainImg img');

let input = document.querySelector('#search');
let days = document.querySelector('.date');

let mainTemp = document.querySelector('#mainTemp strong');
let minTempMain = document.querySelector('#minTempMain strong');
let maxTempMain = document.querySelector('#maxTempMain strong');
let windMain = document.querySelector('#windMain strong');
let weekDay=document.querySelector('#weekDay');

const weekTimeElements = document.querySelectorAll('.week-time');
const weekTempElements = document.querySelectorAll('.week-temp');
const weekWindElements = document.querySelectorAll('.week-wind');
const weekPictureElements = document.querySelectorAll('.week-picture');
const weekStatusElements = document.querySelectorAll('.week-status');




const KEY = '1a675dcee0d0ab4f5b3d52977d27c413';

days.textContent = `${day}.${month + 1}.${year}`;
weekDay.textContent = `${weekDays}`;
getCityWeather();


input.addEventListener('keydown', (e) => {
    if (e.keyCode == 13) {
        e.preventDefault();
        getCityWeather(input.value);
    }
});


function showWeatherNext(respons){
    respons = JSON.parse(respons);
    
    for(let i = 0; i <= 5; i++){
        weekTimeElements[i].textContent = respons.list[i].dt_txt.split(' ')[1];
        weekTempElements[i].innerHTML = `${getTemp(respons.list[i].main.temp)}<span>°</span>C`;
        weekWindElements[i].textContent = respons.list[i].wind.speed;

        let {text, img} = getClouds(respons.list[i].clouds.all); 
        weekPictureElements[i].innerHTML = `<img src="img/${img}" alt="" width="100px" height="100px"></img>`;
        weekStatusElements[i].textContent = text;
    }
}

function showWeather(response) {
    response = JSON.parse(response);
    let {text, img} = getClouds(response.clouds.all); 
    mainStatus.textContent = `${text}`;
    mainImg.setAttribute('src', `img/${img}`);

    mainTemp.textContent = getTemp(response.main.temp);
    minTempMain.textContent = getTemp(response.main.temp_min);
    maxTempMain.textContent = getTemp(response.main.temp_max);
    windMain.textContent = response.wind.speed;
}

function getClouds(value){
    if(value < 33) return cloudsData[0];
    if(value >= 33 && value <= 66) return cloudsData[1];
    return cloudsData[2];
}

const getTemp = value => Math.round((value)-274.15);

function getCityWeather(city = 'Запорожье'){
    getUrl(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${KEY}`, 'json', showWeather);
    getUrl(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${KEY}`, 'json', showWeatherNext);
    cities.innerHTML = `<div class="city">${city}</div>`;
}

function getUrl(url, type, viewData) {
    const req = new XMLHttpRequest();
    req.open('GET', url);//открываем соединение с этой строкой
    req.addEventListener('readystatechange', () => {     //проверка состояния загрузки
        if (req.readyState == 4 && req.status == 200) {
            dayElement.classList.remove('hidden');
            weekElement.classList.remove('hidden');
            document.querySelector('.city-not-found')?.remove();
            if (type == 'json')
                viewData(req.responseText);
            else
                viewData(req.responseXML);
        }
        else{
            if(req.status == 404){
                if(headerElement.nextElementSibling.classList.contains('city-not-found') == false){
                    const html = `<div class="city-not-found">ошибка 404<br>город не обнаружен<br>перезагрузите страницу и введите правильное название города</div>`;
                    headerElement.insertAdjacentHTML('afterend', html);
                    dayElement.classList.add('hidden');
                    weekElement.classList.add('hidden');
                }
            }
        } 
    });
    req.send();
}

