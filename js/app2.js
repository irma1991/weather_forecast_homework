async function getData(city){
    let url = 'https://api.meteo.lt/v1/places/'+city+'/forecasts/long-term';
    let response = await fetch(url);
    return await response.json();

}


async function showData(callback,today) {
    const data = await getData('Kaunas');
    //console.log(data['forecastTimestamps'][0])
    // su let ar var neveikia
    Alldata = data['forecastTimestamps'];
    console.log(Alldata);

    today();
    callback();
}
function createElements(){
    for(let i=0;i<24;i++) {
        // Sukuria valandos duomenis
        const hourBlock = document.querySelector(".hourWeatherCont");
        const hourdiv = document.createElement("div");
        hourdiv.classList.add("hourWeather");
        hourBlock.appendChild(hourdiv);

        //Sukuria laiko p
        const time = document.createElement("p");
        time.classList.add("time");
        hourdiv.append(time);

        // iskerpa is stringo valandas
        let str = Alldata[i]['forecastTimeUtc'];
        let res = str.slice(-8, -3);
        time.textContent = res + '';
        //console.log(Alldata[i]['conditionCode']);

        // // Condition code ikonos
        let weatherIcon = document.createElement('div');
        weatherIcon.classList.add("weather-icon");
        weatherIcon.innerHTML = getWeatherIcon(Alldata[i]['conditionCode']);
        hourdiv.appendChild(weatherIcon);

        //Sukuria temp p
        const temp = document.createElement("p");
        temp.classList.add("temp");
        hourdiv.append(temp);
        temp.textContent = Alldata[i]['airTemperature'] + '°';

        // Sukuria krituliu p
        const wet = document.createElement("p");
        wet.classList.add("wet");
        hourdiv.append(wet);
        wet.textContent = Alldata[i]['totalPrecipitation'] + 'mm';

        // Sukuria vejo greicio p
        const wind = document.createElement("p");
        wind.classList.add("wind");
        hourdiv.append(wind);
        wind.textContent = Alldata[i]['windSpeed'] + 'm/s';
    }

}
//Sios dienos minimali ir maximali temperatura bei divas
function todayminmax() {
    let todaydata = Alldata.filter(function (item) {
        let currentDate = new Date();
        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();
        let formatd = year + "-" + month + "-" + day;
        return item.forecastTimeUtc.includes(formatd);
    });

    //isrenka didziausia tos dienos temperatura
    const maxtemp = Math.max(...todaydata.map(o => o.airTemperature));
    //console.log(maxtemp)
    //isrenka maziausia temp
    const mintemp = Math.min(...todaydata.map(o => o.airTemperature));
    //console.log(mintemp)

    //Sukuria diva sios savaites dienos
    const weekcontainer = document.querySelector(".weekcont");
    const todaydiv = document.createElement("div");
    todaydiv.classList.add("todayWeather");
    weekcontainer.append(todaydiv);

    // // Condition code ikonos
    let weatherIcon = document.createElement('div');
    weatherIcon.classList.add("todayWeatherIcon");
    weatherIcon.innerHTML = getWeatherIcon(Alldata[2]['conditionCode']);
    todaydiv.appendChild(weatherIcon);

    //Ikelia min ir max temperatura i diva
    const tempp = document.createElement("p");
    tempp.classList.add("todayTemps");
    tempp.textContent = mintemp + "°c / " + maxtemp + "°c";
    todaydiv.append(tempp);
    //Savaites minimali maximali temp
    for (k=1;k<7;k++){
        let weekdata = Alldata.filter(function (item2) {
            let currentDate2 = new Date();
            let day2 = currentDate2.getDate() + k;
            let month2 = currentDate2.getMonth() + 1;
            let year2 = currentDate2.getFullYear();
            let formatd2 = year2 + "-" + month2 + "-" + day2;
            return item2.forecastTimeUtc.includes(formatd2);
        });
        //isrenka didziausias savaites temperaturas
        const maxtemp2 = Math.max(...weekdata.map(o => o.airTemperature));
        //isrenka maziausias savaites temperaturas
        const mintemp2 = Math.min(...weekdata.map(o => o.airTemperature));
        //kuria elementus
        const weekcontainerfull = document.querySelector(".weekcontfull");
        const weekdiv = document.createElement("div");
        weekdiv.classList.add("weekDay");
        weekcontainerfull.append(weekdiv);
        //sukelia paragraphus su duomenimis i diva
        const temper = document.createElement("p");
        temper.classList.add("weekTemps");
        temper.textContent = mintemp2 + "°c / " + maxtemp2 + "°c";
        weekdiv.append(temper);
    }
}

//Ikonu funkcija
function getWeatherIcon(conditionCode) {
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
showData(createElements, todayminmax);