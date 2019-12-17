let place = document.querySelector('input'); // paieskos inputas
let city;
city = place.addEventListener('input',  e => {
    const fetchWeather = async (callback) => {
        weather = await fetch(
            'https://api.meteo.lt/v1/places/'+e.target.value+'/forecasts/long-term'
        ).then(res => res.json());
    };

// // fetchinam API
// async function getData(city) {
//     let url = 'https://api.meteo.lt/v1/places/' + city + '/forecasts/long-term';
//     let response = await fetch(url);
//     return await response.json();
// }

// pasiemam duomenis is API
async function showWeather() {
    await fetchWeather(city);
    // const weather = await getData('Kaunas');
    let weatherItems = weather.forecastTimestamps;


    // susikuriu icons kiekvienam galimam conditionCode
    let weatherIcons = {
        clear: '<i class="fas fa-sun"></i>',
        isolatedClouds: '<i class="fas fa-cloud"></i>',
        scatteredClouds: '<i class="fas fa-cloud-sun"></i>',
        overcast: '<i class="fas fa-cloud"></i>',
        lightRain: '<i class="fas fa-cloud-rain"></i>',
        moderateRain: '<i class="fas fa-cloud-rain"></i>',
        heavyRain: '<i class="fas fa-cloud-showers-heavy"></i>',
        sleet: '<i class="fas fa-cloud-meatball"></i>',
        lightSnow: '<i class="fas fa-snowflake"></i>',
        moderateSnow: '<i class="fas fa-snowflake"></i>',
        heavySnow: '<i class="fas fa-snowflake"></i>',
        fog: '<i class="fas fa-smog"></i>',
        humidityIcon: '<i class="fas fa-tint"></i>'
    };


    // su switch padarom, kad rodytu icons pagal esama conditionCode
    async function getWeatherIcon(conditionCode) {
        switch (conditionCode) {
            case ("clear"):
                return weatherIcons.clear;
            case ("isolated-clouds"):
                return weatherIcons.isolatedClouds;
            case ("scattered-clouds"):
                return weatherIcons.scatteredClouds;
            case ("overcast"):
                return weatherIcons.overcast;
            case ("light-rain"):
                return weatherIcons.lightRain;
            case ("moderate-rain"):
                return weatherIcons.moderateRain;
            case ("heavy-rain"):
                return weatherIcons.heavyRain;
            case ("sleet"):
                return weatherIcons.sleet;
            case ("light-snow"):
                return weatherIcons.lightSnow;
            case ("moderate-snow"):
                return weatherIcons.moderateSnow;
            case ("heavy-snow"):
                return weatherIcons.heavySnow;
            case ("fog"):
                return weatherIcons.fog;
        }
    }


    // filtruojam duomenis sios dienos + 6 dienu i prieki
    for (i=0; i < 7; i++) {
        let weatherByDay = weatherItems.filter(function (value) {
            let currentDate = new Date();
            let day = currentDate.getDate() + i;
            let month = currentDate.getMonth() + 1;
            let year = currentDate.getFullYear();
            let formedDate = year + "-" + month + "-" + day;
            console.log(formedDate)
            return value.forecastTimeUtc.includes(formedDate);
        });

        // MIN temperatura kiekvienai dienai
        const mintemp = Math.min(...weatherByDay.map(o => o.airTemperature));
        console.log(mintemp)

        // MAX temperatura kiekvienai dienai
        const maxtemp = Math.max(...weatherByDay.map(o => o.airTemperature));
        console.log(maxtemp)

        // kuriame vietas gautiems duomenims
        const weatherByDays = document.createElement('div');
        weatherByDays.classList.add("col-sm", "border");
        document.querySelector('.weather-by-days').appendChild(weatherByDays);

        let weatherIcon = document.createElement('div');
        weatherIcon.classList.add("weather-icon");
        weatherIcon.innerHTML = await getWeatherIcon(weatherItems[i]['conditionCode']);
        weatherByDays.appendChild(weatherIcon);

        let MinTemperatureDay = document.createElement('div');
        MinTemperatureDay.classList.add("min-temperature-day");
        MinTemperatureDay.textContent = "Min " + mintemp + "°";
        weatherByDays.appendChild(MinTemperatureDay);

        let MaxTemperatureDay = document.createElement('div');
        MaxTemperatureDay.classList.add("max-temperature-day");
        MaxTemperatureDay.textContent = "Max " + maxtemp + "°";
        weatherByDays.appendChild(MaxTemperatureDay);
    }


    // filtruojam duomenys tik dabartines dienos
    function today(value) {
        let currentDate = new Date();
        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();
        let formedDate = year + "-" + month + "-" + day;
        return value.forecastTimeUtc.includes(formedDate);
    }

    weatherItems = weatherItems.filter(today)

    // kuriame vietas gautiems duomenims
    for (let i = 0; i < weatherItems.length; i++) {

        const weatherByHours = document.createElement('div');
        weatherByHours.classList.add("col-sm", "border");
        document.querySelector('.weather-by-hours').appendChild(weatherByHours);

        let hours = document.createElement('div');
        var str = weatherItems[i]['forecastTimeUtc'];
        var res = str.slice(-8, -3);
        hours.classList.add("hours");
        hours.textContent = res;
        weatherByHours.appendChild(hours);

        let weatherIcon = document.createElement('div');
        weatherIcon.classList.add("weather-icon");
        weatherIcon.innerHTML = await getWeatherIcon(weatherItems[i]['conditionCode']);
        weatherByHours.appendChild(weatherIcon);

        let temperature = document.createElement('div');
        temperature.classList.add("temperature");
        temperature.textContent = weatherItems[i]['airTemperature'] + " °";
        weatherByHours.appendChild(temperature);

        let humidityIcon = document.createElement('div');
        humidityIcon.classList.add("humidity-icon");
        humidityIcon.innerHTML = weatherIcons.humidityIcon;
        weatherByHours.appendChild(humidityIcon);

        let humidityValue = document.createElement('div');
        humidityValue.classList.add("humidity-value");
        humidityValue.textContent = weatherItems[i]['totalPrecipitation'] + "%";
        weatherByHours.appendChild(humidityValue);

        let wind = document.createElement('div');
        wind.classList.add("wind");
        wind.textContent = weatherItems[i]['windSpeed'] + "m/s";
        weatherByHours.appendChild(wind);
    }
}

showWeather()
});