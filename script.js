const apikey="a957bf434fd6cad8fa5c3b148cceffac";
const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");
const weatherIcon = document.querySelector(".weather-summary-img");
const weatherInfo =document.querySelector(".weather-info")
const notFound=document.querySelector(".not-found")
const searchCity=document.querySelector(".search-city")
const countryTxt=document.querySelector('.country-txt')
const temptxt=document.querySelector('.temp-txt')
const condition=document.querySelector('.condition-txt')
const humidityt=document.querySelector('.humidity-value-txt')
const windt=document.querySelector('.wind-value-txt')
const datet=document.querySelector('.current-date-txt')
const forecastItemcontainer=document.querySelector('.forecast-items-container')

searchBtn.addEventListener('click',() => {
    if(cityInput.value.trim() !=''){
        updateWeatherInfo(cityInput.value)
        cityInput.value=''
        cityInput.blur()
    }
 })
cityInput.addEventListener('keydown',(event) =>{
    if(event.key=='Enter'&&cityInput.value.trim()!='')
    {
        updateWeatherInfo(cityInput.value)
        cityInput.value=''
        cityInput.blur()
    }
 })
async function getFetchData(endPoint,city){
    const apiUrl=`https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apikey}&units=metric`
    const response = await fetch(apiUrl);
    return response.json()
}
async function showDisplaySection(section){
    [weatherInfo,searchCity,notFound]
    .forEach(section => section.style.display='none')
    section.style.display='flex'
}
function getWeatherIcon(id){
    if(id<=232) return 'wi_thunderstoms.svg'
    if(id<=321) return 'wi_drizzle.svg'
    if(id<=531) return 'wi_rain.svg'
    if(id<=622) return 'wi_snow.svg'
    if(id<=781) return 'wi_sun.svg'
    if(id<=800) return 'wi_clear.svg'
    else return 'clouds.svg'

}
function getCurrentDate(){
    const currentDate=new Date()
    const options={
        weekday:'short',
        day:'2-digit',
        month:'short'
    }
    return currentDate.toLocaleDateString('en-GB',options)
}
async function updateWeatherInfo(city){
    const weatherData=await getFetchData('weather',city)
    if(weatherData.cod !=200){
        showDisplaySection(notFound)
        return
    }
    console.log(weatherData)
    const {
        name:country,
        main:{temp,humidity},
        weather:[{id,main}],
        wind:{speed}

    }=weatherData
    countryTxt.textContent=country
    temptxt.textContent=Math.round(temp)+' °C'
    condition.textContent=main
    humidityt.textContent=humidity+'%'
    windt.textContent=speed+'M/s'
    datet.textContent=getCurrentDate()
    weatherIcon.src=`images/${getWeatherIcon(id)}`
    await updateForecastsInfo(city)
    showDisplaySection(weatherInfo)
}
async function updateForecastsInfo(city){
    const forecastData=await getFetchData('forecast',city)
    console.log(forecastData)
    const timeTaken='12:00:00'
    const todayDate=new Date().toISOString().split('T')[0]
   forecastItemcontainer.innerHTML='';
    forecastData.list.forEach(forecastWeather =>{
        if(forecastWeather.dt_txt.includes(timeTaken)
        && ! forecastWeather.dt_txt.includes(todayDate)){
            updateForecastsItems(forecastWeather)
        }
       
})
}
async function updateForecastsItems(weatherData){
    console.log(weatherData)
    const {
        dt_txt: date,
        weather: [{id}],
        main:{temp}
    }=weatherData
    const dateTaken= new Date(date)
    const dateOption={
        day: '2-digit',
        month:'short'
    }
    const dateResult=dateTaken.toLocaleDateString('en-Us',dateOption)
    const forecastItems=`
       <div class="forecast-item">
            <h5 class="forecast-item-date regular.txt">${dateResult}</h5>
            <img src="images/${getWeatherIcon(id)}" alt="" class="forecast-item-img">
            <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
        </div>
    `
    forecastItemcontainer.insertAdjacentHTML('beforeend',forecastItems)

}
