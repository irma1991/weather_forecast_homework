// async function getData(){
//     let url = 'https://api.meteo.lt/v1/places/kaunas/forecasts/long-term';
//     let response = await fetch(url);
//
//     let orai = await response.json();
//
//     // console.log(orai);
//     console.log(orai['forecastTimestamps'])
// }
//
// // start()
// getData()

// async function getData(api){
//     let url = api;
//     let response = await fetch(url);
//     return await response.json();
// }
//
// async function showData(){
//     const data = await getData('https://api.meteo.lt/v1/places/kaunas/forecasts/long-term');
//
//     console.log(data)
// }
//
// showData()

async function getData(city){
    let url = 'https://api.meteo.lt/v1/places/'+city+'/forecasts/long-term';
    let response = await fetch(url);
    return await response.json();
}

async function showData(){
    const data = await getData('Kaunas');
    console.log(data)
}

showData()