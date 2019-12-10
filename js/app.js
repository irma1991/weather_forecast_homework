// async function start(){
//     let url = 'https://api.meteo.lt/v1/places/kaunas/forecasts/long-term';
//     let response = await fetch(url);
//
//     let orai = await response.json();
//
//     console.log(orai);
//     // console.log(orai['forecastTimestamps'])
// }
//
// start()
//
// // async function getData(api){
// //     let url = api;
// //     let response = await fetch(url);
// //     return await response.json();
// // }
// //
// // async function showData(){
// //     const data = await getData('https://api.meteo.lt/v1/places/kaunas/forecasts/long-term');
// //
// //     console.log(data)
// // }
// //
// // showData()
// //

// let weather;
// const fetchWeather = async () => {
//     weather = await fetch(
//         'https://api.meteo.lt/v1/places/kaunas/forecasts/long-term'
//     ).then(res => res.json());
// };
// const showWeather = async () => {
// // getting the weather data from api
//     await fetchWeather();
//     const weatherItems = weather.forecastTimestamps;
//     let weatherData = [];
//     console.log(weather.forecastTimestamps[0].forecastTimeUtc)
//     for(let i=0; i<24; i++) {
//         weatherData[i] = weather.forecastTimestamps[i];
//         console.log(weatherData[i])
//         const weatherItems = document.querySelector('.every-hour-weather');
//         const hours = document.querySelector('.hours');
//         hours.textContent = weather.forecastTimestamps[0].forecastTimeUtc;
//         document.querySelector('.every-hour-weather').appendChild(hours);
//         const temperature = document.querySelector('.temperature');
//         temperature.textContent = weather.forecastTimestamps[0].airTemperature;
//         document.querySelector('.every-hour-weather').appendChild(temperature);
//         const wind = document.querySelector('.wind');
//         wind.textContent = weather.forecastTimestamps[0].windSpeed;
//         document.querySelector('.every-hour-weather').appendChild(wind);
//
//         const weatherItems2 = document.querySelector('.every-hour-weather2');
//         const hours2 = document.querySelector('.hours');
//         hours2.textContent = weather.forecastTimestamps[1].forecastTimeUtc;
//         document.querySelector('.every-hour-weather2').appendChild(hours2);
//         const temperature2 = document.querySelector('.temperature');
//         temperature2.textContent = weather.forecastTimestamps[1].airTemperature;
//         document.querySelector('.every-hour-weather2').appendChild(temperature2);
//         const wind2 = document.querySelector('.wind');
//         wind2.textContent = weather.forecastTimestamps[1].windSpeed;
//         document.querySelector('.every-hour-weather2').appendChild(wind2);
//
//
//     }
// }
// showWeather()

function today(value){
    return  value.forecastTimeUtc.includes('2019-12-10');
}

const fetchWeather = async () => {
    weather = await fetch(
        'https://api.meteo.lt/v1/places/kaunas/forecasts/long-term'
    ).then(res => res.json());
};
const showWeather = async () => {
// getting the weather data from api
    await fetchWeather();
    // filtruojam duomenys tik konkrecios dienos
    let weatherItems = weather.forecastTimestamps;
    weatherItems = weatherItems.filter(today)

//     let weatherData = [];
//     for(weatherItem in weatherItems){
//         weatherData [weatherItem] = weatherItems[weatherItem];
//         console.log(weatherItems[weatherItem])
//     }

    for(let i=0; i < weatherItems.length; i++){
        const weatherByHours = document.createElement('div');
        weatherByHours.classList.add("col-sm", "border", "every-hour-forecast");
        document.querySelector('.weather-by-hours').appendChild(weatherByHours);

        for(weatherItem in weatherItems[i]){
            let hours = document.createElement('div');
            hours.classList.add("hours");
            hours.textContent = weatherItems[i]['airTemperature'];
            weatherByHours.appendChild(hours);
            console.log(weatherItems[i])

            let weatherIcon = document.createElement('div');
            weatherIcon.classList.add("weather-icon");
            weatherIcon.textContent = weatherItems[i]['windSpeed'];
            weatherByHours.appendChild(weatherIcon);

        }
    }
}
showWeather()