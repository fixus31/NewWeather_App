//const WEATHER_API_KEY = "*3653a9155d671*b947cd8bb3**c016*";

export const setLocationObject = (locationObj, coordsObj) => {
    const { lat, lon, name, unit} = coordsObj;
    locationObj.setLat(lat);
    locationObj.setLon(lon);
    locationObj.setName(name);
    if (unit) {
        locationObj.setUnit(unit);
    }
};

export const getHomeLocation = () => {
    return localStorage.getItem("defaultWeatherLocation");
};

export const getWeatherFromCoords = async(locationObj) => {
 
    const lat = locationObj.getLatitude();
    const lon = locationObj.getLongitude();
    const units = locationObj.getUnit();
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&
    exclude=minutely,hourly,alerts&units=${units}&appid=${WEATHER_API_KEY}`;
    try {
        const weatherStream = await fetch(url);
        const weatherJson = await weatherStream.json();
        return weatherJson;
    } catch (err) {
        console.error(err);
    }

    const urlDataObj = {
         lat: locationObj.getLatitude(),
         lon: locationObj.getLongitude(),
         units: locationObj.getUnit()
    };

};

export const getCoordsFromApi = async (entryText, units) => {
    const urlDataObj = {
        text: entryText,
        units: units
    };

 /*   try {
        const dataStream = await fetch('./.netlify/functions/get_coords', {
            method: "POST",
            body: JSON.stringify(urlDataObj)
        });
        const jsonData = await dataStream.json();
        return jsonData;
    } catch (err) {
        console.error(err);
    }*/
};
