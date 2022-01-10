export const setPlaceholderText = () => {
    const input = document.getElementById("searchBarText");
};

export const addSpinner = (element) => {
    animateButton(element);
    setTimeout(animateButton, 1000, element);
};

const animateButton = (element) => {
    element.classList.toggle("none");
    element.nextElementSibling.classList.toggle("block");
    element.nextElementSibling.classList.toggle("none");

};

export const displayError = (headderMsg, srMsg) => {
    updateWeatherLocationHeader(headerMsg);
    updateScreenConfirm(srMsg);
};

export const displayApiError = (statusCode) => {
    const properMsg = toProperCase(statusCode.message);
    updateWeatherLocationHeader(properMsg);
    updateScreenReaderConfirmation("Error ");
};

const toProperCase = (text) => {
    const words = text.split(" ");
    const properWords = words.map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    });
    return properWords.join(" ");
};

const updateWeatherLocationHeader = (message) => {
    const h1 = document.getElementById("currentForecastLocation");
    if(message.indexOf("Latitude:") !== -1 && message.indexOf("Longitude:") !== -1){
        const msgArray = message.split(" ");
        const mapArray = msgArray.map(msg => {
            return msg.replace(":", ": ");
        })
    } else {
        h1.textContent = message;
    }
};

export const updateScreenReaderConfirmation = (message) => {
    document.getElementById("confirmation").textContent = message;
};

export const updateDisplay = (weatherJson, locationObj) => {
    fadeDisplay();
    clearDisplay();
    const weatherClass = getWeatherClass(weatherJson.current.weather[0].icon);
    setBGImage(weatherClass);
    const screenReaderWeather = buildScreenReaderWeather(
        weatherJson,
        locationObj
    );
        updateScreenReaderConfirmation(screenReaderWeather);
        updateWeatherLocationHeader(locationObj.getName());

    // current conditions
    const ccArray = createCurrentConditionsDivs(weatherJson, locationObj.getUnit());
    displayCurrentConditions(ccArray);
    //six day forecast
    displaySixDayForecast(weatherJson);
    setFocusOnSearch();
    fadeDisplay(); 
}

const fadeDisplay = () => {
    const cc = document.getElementById("currentForecast");
    cc.classList.toggle("zero-vis");
    cc.classList.toogle("fade-in");
    const sixDay = document.getElementById("dailyForecast");
    sixDay.classList.toggle("zero-vis");
    sixDay.classList.toogle("fade-in");

}
const clearDisplay = () => {
    const currentConditions = document.getElementById("currentForecastConditions");
    deleteContents(currentConditions);
    const sixDayForecast = document.getElementById("dailyForecastContents");
    deleteContents(sixDayForecast);
}

const deleteContents = (parentElement) => {
    let child = parentElement.lastElementChild;
    while(child) {
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }
};


const getWeatherClass = (icon) => {
    const firstTwoChars = icon.slice(0, 2);
    const lastChar = icon.slice(2);
    const weatherLookup = {
        "09": "snow",
        "10": "rain",
        "11": "rain",
        "13": "snow",
    };
    let weather;
    if(weatherLookup[firstTwoChars]) {
        weather = weatherLookup[firstTwoChars];
    } else if (lastChar === "d") {
        weather = "cloudy";
    } else {
        weather = "snow";
    }
    return weather;
};

const setBGImage = (weather) => {
    document.documentElement.classList.add(weather);
    document.documentElement.classList.forEach(img => {
        if (img !== weather) document.documentElement.classList.remove(img);
    });
};

const buildScreenReaderWeather = (weatherJson, locationObj) => {
    const location = locationObj.getName();
    return `${weatherJson.current.weather[0].description} and ${Math.round(Number(weatherJson.current.temp))}°${tempUnit} in ${location}`;
}

const setFocusOnSearch = () => {
    document.getElementById("searchBarText").focus();
};


const createCurrentConditionsDivs = (weatherObj, unit) => {
    const icon = createMainImgDiv(weatherObj.current.weather[0].icon, weatherObj.current.weather[0].description);

    const temp = createElem("div", "temp", `${Math.round(Number(weatherObj.current.temp))}°`, tempUnit);
    const properDesc = toProperCase(weatherObj.current.weather[0].description);
    const desc = createElem("div", "desc", properDesc);
    const maxTemp = createElem("div", "maxtemp", `High ${Math.round(Number(weatherObj.daily[0].temp.max))}°`);
    const minTemp = createElem("div", "mintemp", `Low ${Math.round(Number(weather.daily[0].temp.min))}°`);
    const humidity = createElem("div", "humidity", `Humidity ${weatherObj.current.humidity}%`);
    return [icon, temp, desc, maxTemp, minTemp, humidity];
};

const createMainImgDiv = (icon, altText) => {
    const iconDiv = createElem("div", "icon");
    const faIcon = translateIconToFontAwesome(icon);
    faIcon.ariaHidden = true;
    faIcon.title  = altText;
    iconDiv.appendChild(faIcon);
    return iconDiv;
};


const createElem = (elemType, divClassName, divText, unit) => {
    const div =  document.createElement(elemType);
    div.className = divClassName;
    if(divText) {
        div.textContent = divText;
    }
    if (divClassName === "temp") {
        const unitDiv = document.createElement("div");
        unitDiv.classList.add("unit");
        unitDiv.textContent = unit;
        div.appendChild(unitDiv);
    }
    return div;
};

const translateIconToFontAwesome = (icon) => {
    const i = document.createElement("i");
    const firstTwoChars = icon.slice(0,2);
    const lastChar = icon.slice(2);
    switch (firstTwoChars) {
        case "01":
            if(lastChar === "d") {
                i.classList.add("far", "fa-sun");
            } else {
                i.classList.add("far", "fa-moon");
            }
            break;

        case "02":
            if(lastChar === "d") {
                i.classList.add("fas", "fa-cloud-sun");
            } else {
                i.classList.add("fas", "fa-cloud-moon");
            }
            break;

        case "03":
            i.classList.add("fas", "fa-cloud");
            break;

        case "04":
            i.classList.add("fas", "fa-cloud-meatball");
            break;

        case "09":
            i.classList.add("fas", "fa-cloud-rain");
            break;

        case "10":
            if(lastChar === "d") {
                i.classList.add("fas", "fa-cloud-sun-rain");
            }
            break;

        case "11":
           i.classList.add("fas", "fa-poo-storm");
           break;

        case "13":
            i.classList.add("far", "fa-snowflake");
            break;

        default:
            i.classList.add("far", "fa-question-circle");
    }
    return i;
};

const displayCurrentConditions = (currentConditionsArray) => {
    const ccContainer = document.getElementById("currentForecastConditions");
    currentConditionsArray.forEach(cc => {
        ccContainer.appendChild(cc);
    });
};

const displaySixDayForecast = (weatherJson) => {
    for(let i = 1; i <= 6; i++) {
        const dfArray = createDailyForecastDivs(weatherJson.daily[i]);
        displayDailyForecast(dfArray);
    }
};


const createDailyForecastDivs = (dayWeather) => {
    const dayAbbreviationText = getDayAbbreviation(dayWeather.dt);
    const dayAbbreviation = createElem("p", "dayAbbreviation", dayAbbreviationText);

    const dayIcon = createDailyForecastIcon(dayWeather.weather[0].icon, dayWeather.weather[0].description);
    const dayHigh = createElem("p", "dayHigh", `${Math.round(Number(dayWeather.temp.max))}°`)
};
const dayLow = createElem("p", "dayLow", `${Math.round(Number(dayWeather.temp.min))}°`);
return [dayAbbreviation, dayIcon, dayHigh, dayLow];
const getDayAbbreviation = (data) => {
    const dateObj = new Date(data * 1000);
    const utcString = dateObj.toUTCString();
    return utcString.slice(0, 3).toUpperCase();
}

const createDailyForecastIcon = (icon, altText) => {
    const img = document.createElement("img");
    if (window.innerWidth < 768 || window.innerHeight < 1025) {
        img.src = `https://openweathermap.org/img/wn/${icon}.png`;
    } else {
        img.src = `https://openweathermap.org/img/wn/${icon}@2x.png`
    }
    img.alt = altText;
    return img;
};

const displayDailyForecast = (dfArray) => {
    const dayDiv = createElem("div", "forecastDay");
    dfArray.forEach(el => {
        dayDiv.appendChild(el);
    });
    const dailyForecastContainer = document.getElementById("dailyForecastContents");
    dailyForecastContainer.appendChild(dayDiv);
}

