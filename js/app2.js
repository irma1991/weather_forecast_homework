'use strict';

(function () {
    const PLACES_URL = 'https://api.meteo.lt/v1/places';
    const URL_SEPARATOR = '/';
    const FORECAST_URL_ENDING = 'forecasts/long-term';
    const DEFAULT_PLACE = 'kaunas';

    let dateTimeFormatWeekday = new Intl.DateTimeFormat('en-Us', {weekday: 'short'});
    let dateTimeFormatHour = new Intl.DateTimeFormat('lt', {hour: 'numeric'});

    // classes according to conditionCode - oro sąlygos, kodas:
    const conClear = 'clear';
    const conIsolatedClouds = 'isolated-clouds';
    const conScatteredClouds = 'scattered-clouds';
    const conOvercast = 'overcast';
    const conLightRain = 'light-rain';
    const conModerateRain = 'moderate-rain';
    const conHeavyRain = 'heavy-rain';
    const conSleet = 'sleet';
    const conLightSnow = 'light-snow';
    const conModerateSnow = 'moderate-snow';
    const conHeavySnow = 'heavy-snow';
    const conFog = 'fog';

    let weatherIcons = {
        day:
            {
                clear: "wi-day-sunny",
                isolatedClouds: "wi-day-sunny",
                scatteredClouds: "wi-day-cloudy",
                overcast:"wi-cloudy",
                lightRain: "wi-day-sprinkle",
                moderateRain: "wi-day-showers",
                heavyRain: "wi-day-rain",
                sleet: "wi-day-sleet",
                lightSnow: "wi-day-snow",
                moderateSnow: "wi-day-snow-wind",
                heavySnow: "wi-day-snow-thunderstorm",
                fog: "wi-day-fog"
            },
        night:
            {
                clear: "wi-night-clear",
                isolatedClouds: "wi-night-alt-partly-cloudy",
                scatteredClouds: "wi-night-alt-cloudy",
                overcast: "wi-cloudy",
                lightRain: "wi-night-alt-sprinkle",
                moderateRain: "wi-night-alt-showers",
                heavyRain: "wi-night-alt-rain",
                sleet: "wi-night-alt-sleet",
                lightSnow: "wi-night-alt-snow",
                moderateSnow: "wi-night-alt-snow-wind",
                heavySnow: "wi-night-alt-snow-thunderstorm",
                fog: "wi-night-alt-fog"
            },
        other:
            {
                na: "wi-na",
                degreeSymbol: "wi-degrees",
                raindropSymbol: "wi-raindrops",
                weatherIconClass: 'wi'
            }
    };

    // current coords
    // let locationCoordinates = {};
    // navigator.geolocation.getCurrentPosition(function (position) {
    //     locationCoordinates.latitude = position.coords.latitude;
    //     locationCoordinates.longitude = position.coords.longitude;
    // });

    //Data and manipulation
    async function getData(place) {
        let response = await fetch(PLACES_URL + URL_SEPARATOR + place + URL_SEPARATOR + FORECAST_URL_ENDING);

        return await response.json();
    }

    async function filterDataByDate(data, date) {
        return data['forecastTimestamps'].filter(item => new Date(item['forecastTimeUtc']).getDate() === date);
    }

    async function getMinTemp(dayData) {
        return Math.round(Math.min(dayData
            .map(data => data['airTemperature'])
            .sort((a, b) => a - b)[0]));
    }

    async function getMaxTemp(dayData) {
        return Math.round(Math.min(dayData
            .map(data => data['airTemperature'])
            .sort((a, b) => b - a)[0]));
    }

    async function createHtmlWeekdays(minMaxTempByDate, conditionCode, hourTime, today = false, focused = false) {
        const weekdays = document.querySelector('.weekdays');
        const divWeekday = document.createElement('div');
        divWeekday.classList.add('weekday');
        today ? divWeekday.classList.add('today', 'focused') : divWeekday.classList.add('other-day');
        if (focused) {
            divWeekday.classList.add('focused')
        }
        //first row of weekday
        const divRowDate = document.createElement('div');
        divRowDate.classList.add('row', 'justify-content-start');
        const divDate = document.createElement('div');
        divDate.classList.add('col');
        today ? divDate.classList.add('today', 'date') : divDate.classList.add('date');
        divDate.textContent = 'Today';
        if (!today) {
            const spanDate = document.createElement('span');
            divDate.textContent = dateTimeFormatWeekday.format(hourTime) + ' ';
            spanDate.textContent = minMaxTempByDate.date;
            divDate.append(spanDate);
        }
        divRowDate.append(divDate);
        divWeekday.append(divRowDate);

        //second row of weekday
        const divRowIconTemp = document.createElement('div');
        divRowIconTemp.classList.add('row');
        const divColIconTemp = document.createElement('div');
        divColIconTemp.classList.add('icon-temp');
        today ? divColIconTemp.classList.add('col-5') : divColIconTemp.classList.add('col');
        const divRowLine = document.createElement('div');
        divRowLine.classList.add('row', 'line');
        if (today) {
            divRowLine.classList.add('line-separator-right');
        }
        const divColIcon = document.createElement('div');
        divColIcon.classList.add('col-6', 'icon');

        let iconClass = await getWeatherIcon(conditionCode, true);
        let iconWeather = document.createElement('i');
        iconWeather.classList.add(weatherIcons.other.weatherIconClass, iconClass);
        divColIcon.append(iconWeather);

        divRowLine.append(divColIcon);

        const divColTemp = document.createElement('div');
        divColTemp.classList.add('col-6', 'temp');
        const divRowMaxTemp = document.createElement('div');
        divRowMaxTemp.classList.add('row');
        const divColMaxTemp = document.createElement('div');

        divColMaxTemp.classList.add('col', 'max-temp');
        let iconDegree = document.createElement('i');
        iconDegree.classList.add(weatherIcons.other.weatherIconClass, weatherIcons.other.degreeSymbol);
        divColMaxTemp.textContent = minMaxTempByDate.maxTemperature;
        divColMaxTemp.append(iconDegree);

        divRowMaxTemp.append(divColMaxTemp);
        divColTemp.append(divRowMaxTemp);

        const divRowMinTemp = document.createElement('div');
        divRowMinTemp.classList.add('row');
        const divColMinTemp = document.createElement('div');
        divColMinTemp.classList.add('col', 'min-temp');
        iconDegree = document.createElement('i');
        iconDegree.classList.add(weatherIcons.other.weatherIconClass, weatherIcons.other.degreeSymbol);
        divColMinTemp.textContent = minMaxTempByDate.minTemperature;
        divColMinTemp.append(iconDegree);

        divRowMinTemp.append(divColMinTemp);
        divColTemp.append(divRowMinTemp);

        divRowLine.append(divColTemp);
        divColIconTemp.append(divRowLine);
        divRowIconTemp.append(divColIconTemp);

        const divWeatherInfo = document.createElement('div');
        divWeatherInfo.classList.add('col-7', 'weather-info');
        if (!today) {
            divWeatherInfo.classList.add('d-none');
        }
        divWeatherInfo.textContent = conditionCode.replace('-', ' ');
        divWeatherInfo.setAttribute('style', 'text-transform: capitalize');
        divRowIconTemp.append(divWeatherInfo);
        divWeekday.append(divRowIconTemp);

        weekdays.append(divWeekday);
    }

    // switch weather icon
    async function getWeatherIcon(conditionCode, day = false) {
        let timeOfDay = day ? weatherIcons.day : weatherIcons.night;
        switch (conditionCode) {
            case (conClear):
                return timeOfDay.clear;
            case (conIsolatedClouds):
                return timeOfDay.isolatedClouds;
            case (conScatteredClouds):
                return timeOfDay.scatteredClouds;
            case (conOvercast):
                return timeOfDay.overcast;
            case (conLightRain):
                return timeOfDay.lightRain;
            case (conModerateRain):
                return timeOfDay.moderateRain;
            case (conHeavyRain):
                return timeOfDay.heavyRain;
            case (conSleet):
                return timeOfDay.sleet;
            case (conLightSnow):
                return timeOfDay.lightSnow;
            case (conModerateSnow):
                return timeOfDay.moderateSnow;
            case (conHeavySnow):
                return timeOfDay.heavySnow;
            case (conFog):
                return timeOfDay.fog;
            default:
                return weatherIcons.other.na;
        }
    }

    async function getWindIcon(degrees) {
        return "<i class=\"wi wi-wind from-" + degrees + "-deg\"></i>"
    }

    async function getIconCelsiusPositionStep(absoluteTemperatures) {
        let availableSpace = 140;
        let temperatureDiff = Math.round(absoluteTemperatures.max) - Math.round(absoluteTemperatures.min);

        return availableSpace / temperatureDiff;
    }

    async function checkHourForNewDate(time, todayFirstHour = false) {
        const divRowWeekday = document.createElement('div');
        divRowWeekday.classList.add('row', 'hour-weekday');
        if (time.getHours() === 0) {
            divRowWeekday.textContent = dateTimeFormatWeekday.format(time);
        }

        if (todayFirstHour) {
            divRowWeekday.textContent = 'Today';
        }

        return divRowWeekday;
    }

    async function createHtmlHourly(hour, absoluteTemperatures, todayFirstHour = false) {
        const hours = document.querySelector('.hours');
        const divHour = document.createElement('div');
        divHour.classList.add('hour');

        const divRowTime = document.createElement('div');
        divRowTime.classList.add('row');
        divRowTime.textContent = dateTimeFormatHour.format(new Date(hour['forecastTimeUtc'])) + ':00';

        const divIconCelsius = document.createElement('div');
        divIconCelsius.classList.add('row', 'icon-celsius');
        //Hourly Icon & Celsius position
        let step = await getIconCelsiusPositionStep(absoluteTemperatures);
        let positionCompensator = 0;
        if (absoluteTemperatures.min < 0) {
            positionCompensator = (-1) * Math.round(absoluteTemperatures.min);
        }
        let divIconCelsiusPosition = step * (Math.round(hour['airTemperature']) + positionCompensator);
        divIconCelsius.setAttribute('style', 'bottom: ' + divIconCelsiusPosition + 'px');

        const divRowIcon = document.createElement('div');
        divRowIcon.classList.add('row');
        //Hourly Icon
        let hourTime = new Date(hour['forecastTimeUtc']).getHours();
        let timeOfDay = !(hourTime > 21 && hourTime < 6);
        let iconWeatherCondition = await getWeatherIcon(hour['conditionCode'], timeOfDay);
        let iconWeather = document.createElement('i');
        iconWeather.classList.add(weatherIcons.other.weatherIconClass, iconWeatherCondition);
        divRowIcon.append(iconWeather);

        const divRowDegree = document.createElement('div');

        divRowDegree.classList.add('row');
        let iconDegree = document.createElement('i');
        iconDegree.classList.add(weatherIcons.other.weatherIconClass, weatherIcons.other.degreeSymbol);
        divRowDegree.textContent = Math.round(hour['airTemperature']).toString();
        divRowDegree.append(iconDegree);
        divIconCelsius.append(divRowIcon, divRowDegree);

        const divRowIconRainfallWind = document.createElement('div');

        divRowIconRainfallWind.classList.add('row', 'icon-rainfall-wind');
        const divRowRainfall = document.createElement('div');
        divRowRainfall.classList.add('row');
        let iconRainfall = document.createElement('i');
        iconRainfall.classList.add(weatherIcons.other.weatherIconClass, weatherIcons.other.raindropSymbol);
        divRowRainfall.append(iconRainfall);
        const divRowPrecipitation = document.createElement('div');
        divRowPrecipitation.classList.add('row');
        divRowPrecipitation.textContent = hour['totalPrecipitation'] + ' mm';
        const divRowWind = document.createElement('div');
        divRowWind.classList.add('row');
        divRowWind.innerHTML = await getWindIcon(hour['windDirection']);
        const divRowWindSpeed = document.createElement('div');
        divRowWindSpeed.classList.add('row');
        divRowWindSpeed.textContent = hour['windSpeed'] + 'm/s';
        divRowIconRainfallWind.append(divRowRainfall, divRowPrecipitation, divRowWind, divRowWindSpeed);

        let time = new Date(hour['forecastTimeUtc']);
        let newDayName = todayFirstHour ? await checkHourForNewDate(time, true) : await checkHourForNewDate(time);

        divHour.append(divRowTime, newDayName, divIconCelsius, divRowIconRainfallWind);

        hours.append(divHour);
    }

    //generate data and weather content
    async function showData(place = DEFAULT_PLACE, name = DEFAULT_PLACE) {
        const data = await getData(place);
        const headerCity = document.querySelector('.city');
        headerCity.textContent = name.toUpperCase();

        //initial date
        let initialTime = new Date(data['forecastTimestamps'][0]['forecastTimeUtc']);
        let year = initialTime.getFullYear();
        let month = initialTime.getMonth();
        let day = initialTime.getDate();
        let firstHour = initialTime.getHours();
        let absoluteTemperatures = {};
        absoluteTemperatures.max = await getMaxTemp(data['forecastTimestamps']);
        absoluteTemperatures.min = await getMinTemp(data['forecastTimestamps']);

        let minMaxTempByDate = {};
        let dayData = null;
        let dayTime = null;
        let firstDay = true;
        for (let hour of data['forecastTimestamps']) {
            if (!dayTime) {
                let hourTime = new Date(hour['forecastTimeUtc']);
                dayTime = hourTime.getDate();
                dayData = await filterDataByDate(data, dayTime);

                minMaxTempByDate.date = dayTime;
                minMaxTempByDate.minTemperature = await getMinTemp(dayData);
                minMaxTempByDate.maxTemperature = await getMaxTemp(dayData);
                let conditionCode = hour['conditionCode'];

                await createHtmlWeekdays(minMaxTempByDate, conditionCode, hourTime, firstDay);
                firstDay = false;
            }
            if (new Date(hour['forecastTimeUtc']).getHours() === firstHour) {
                await createHtmlHourly(hour, absoluteTemperatures, true);
                firstHour = null;
            } else {
                await createHtmlHourly(hour, absoluteTemperatures);
            }

            //check if next day
            dayTime = new Date(hour['forecastTimeUtc']).getDate();
            if (year + month + dayTime > year + month + day) {
                day = dayTime;
                dayTime = null;
                dayData = null;
            }
        }
        addWeekdayEventListeners();
    }

    // Toggle active day
    function addWeekdayEventListeners() {
        const weekdays = document.querySelectorAll('.weekday');
        for (let weekday of weekdays) {
            weekday.addEventListener('click', function () {
                const days = document.querySelectorAll('.weekday');
                document.querySelector('.focused').querySelector('.weather-info').classList.add('d-none');
                document.querySelector('.focused').querySelector('.icon-temp').classList.remove('col-5');
                document.querySelector('.focused').querySelector('.icon-temp').classList.add('col');
                document.querySelector('.focused').querySelector('.line').classList.remove('line-separator-right');
                for (let day of days) {
                    day.classList.remove('focused');
                }
                weekday.classList.add('focused');
                document.querySelector('.focused').querySelector('.line').classList.add('line-separator-right');
                document.querySelector('.focused').querySelector('.weather-info').classList.remove('d-none');
                document.querySelector('.focused').querySelector('.weather-info').classList.add('col-7');
                document.querySelector('.focused').querySelector('.icon-temp').classList.remove('col');
                document.querySelector('.focused').querySelector('.icon-temp').classList.add('col-5');

                const day = weekday.querySelector('.date').textContent;

                const hourOfDate = document.querySelectorAll('.hour-weekday');
                for (let hour of hourOfDate) {
                    if (hour.textContent === day.split(' ', 1).toString()) {
                        hour.scrollIntoView({behavior: "smooth", block: "end", inline: "start"});
                    }
                }
            })
        }
    }

    //find city
    const weekdays = document.querySelector('.weekdays');
    const hours = document.querySelector('.hours');
    async function findPlace(searchQuery = null) {
        let response = await fetch(PLACES_URL);
        let placesData = await response.json();
        for (let placesDataPart of placesData) {
            if (searchQuery) {
                if (placesDataPart.code.toLowerCase() === searchQuery.toLowerCase() || placesDataPart.name.toLowerCase() === searchQuery.toLowerCase()) {
                    //reset page content
                    weekdays.innerHTML = null;
                    hours.innerHTML = null;
                    await showData(placesDataPart.code,  placesDataPart.name);
                }
            }
        }
    }

    const datalist = document.querySelector('#searchCity');
    const searchInput = document.querySelector('.search-city');
    searchInput.setAttribute('autocomplete', 'on');
    const searchResults = document.querySelector('.search-results');

    //autocomplete
    (async () => {
        let response = await fetch(PLACES_URL);
    let placesData = await response.json();

    for (let placesDataPart of placesData) {
        let option = document.createElement('option');
        option.textContent = placesDataPart.name;
        datalist.append(option);
    }
    searchResults.append(datalist);
})();

    (async () => await showData())();
    searchInput.addEventListener('input', async e => await findPlace(e.target.value));

}());