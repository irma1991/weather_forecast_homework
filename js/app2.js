let weather;
let place = document.querySelector('input'); //paieskos inputas
let city;
city = place.addEventListener('input',  e => {
    const fetchWeather = async (callback) => {
        weather = await fetch(
            'https://api.meteo.lt/v1/places/'+e.target.value+'/forecasts/long-term'
        ).then(res => res.json());
    };
//Filter today
    function today(value) {
        var currentDate = new Date();
        var day = currentDate.getDate();
        var month = currentDate.getMonth() + 1;
        var year = currentDate.getFullYear();
        var formedDate = year + "-" + month + "-" + day;
        return value.forecastTimeUtc.includes(formedDate);
    }
    const showWeather = async () => {
        // getting the weather data from api
        await fetchWeather(city);
        let weatherItems = weather.forecastTimestamps; //duomenys
        weatherItems = weatherItems.filter(today)


        //Rendering

        //susikuriu icons kieknievam galimam conditionCode
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


        // for (i=0; i<7; i++){
        //     let weekdata = weatherItems.filter(function (item2) {
        //         let currentDate2 = new Date();
        //         let day2 = currentDate2.getDate() + i;
        //         let month2 = currentDate2.getMonth() + 1;
        //         let year2 = currentDate2.getFullYear();
        //         let formatd2 = year2 + "-" + month2 + "-" + day2;
        //         console.log(formatd2)
        //         return item2.forecastTimeUtc.includes(formatd2);
        //     });
        // }

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