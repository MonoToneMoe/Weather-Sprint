import { LocalWeather } from "./localWeather.js";
import { weatherKey } from "./apiKeys.js";

let lat;
let long;
let description;
let icon

let locationName = document.getElementById("locationName");
let date = document.getElementById("date");
let focusedtemp = document.getElementById("focusedtemp");

LocalWeather().then(({ localLat, localLong }) => {
  lat = localLat;
  long = localLong;

  console.log(lat, long);
  WeatherApiTest();
  HourlyForecast();
});

function WeatherApiTest() {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${weatherKey}&units=imperial`)
    .then((response) => response.json())
    .then((result) => {
      const dailyTemps = {};
      result.list.forEach((item) => {
        const date = item.dt_txt.split(" ")[0];
        const temperature = item.main.temp;
        if (!dailyTemps[date] || temperature < dailyTemps[date].min) {
          dailyTemps[date] = { min: temperature, max: temperature };
        }
        if (temperature > dailyTemps[date].max) {
          dailyTemps[date].max = temperature;
        }
      });
      console.log(dailyTemps);
    });
}

function HourlyForecast() {
  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m&hourly=temperature_2m&temperature_unit=fahrenheit&forecast_days=1`)
    .then((response) => response.json())
    .then((data) => {
      console.log(
        "Hourly Forecast:",
        data.hourly.temperature_2m,
        data.current.temperature_2m
      );
    });
}
