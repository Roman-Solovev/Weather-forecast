import { WEATHER_API_KEY } from "./config.js";

const api_base = "https://api.openweathermap.org/data/2.5/weather";

const form = document.getElementById("weatherForm");
const resultDiv = document.getElementById("result");
const cityInput = form.elements.city;


async function urlWeather(params) {
    const url = new URL(api_base);

    for (const [key, val] of Object.entries(params)) {
        url.searchParams.set(key, val)
    }
    url.searchParams.set("appid", WEATHER_API_KEY);
    url.searchParams.set("units", "metric");
    url.searchParams.set("lang", "en");

    const response = await fetch(url);
    if (!response.ok) throw new Error("Could not be found");
    return response.json();
}

function getPosition () {
    return new Promise ((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {timeout: 5000});
    })
}

async function prefillCity() {
    if (!("geolocation" in navigator)) return;

    try {
        const {coords} = await getPosition();
        const data = await urlWeather({lat: coords.latitude, lon: coords.longitude});
        if (!cityInput.value) cityInput.value = data.name;
    } catch {

    }
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const city = cityInput.value
    if (!city) return;

    resultDiv.textContent = "Loading...";

    try {
        const data = await urlWeather({q: city});
        resultDiv.textContent = `${data.name}: ${data.main.temp}, ${data.weather[0].description}`
    } catch (err) {
        resultDiv.textContent = `Error: ${err.message}`
    }
    cityInput.value = "";
})


prefillCity()