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
  FiveDayForecast();
  HourlyForecast();
});

function FiveDayForecast() {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${weatherKey}&units=imperial`)
    .then((response) => response.json())
    .then((result) => {
      const dailyTemps = {};

      result.list.forEach((item) => {
        // Use the Date object to convert the date string to a day of the week
        const date = new Date(item.dt_txt).toLocaleDateString('en-US', { weekday: 'short' });
        const temperature = item.main.temp;

        if (!dailyTemps[date] || temperature < dailyTemps[date].min) {
          dailyTemps[date] = { min: temperature, max: temperature };
        }

        if (temperature > dailyTemps[date].max) {
          dailyTemps[date].max = temperature;
        }
      });
      Object.keys(dailyTemps).forEach((date, index) => {
        const minMaxElement = document.getElementById(`mm${index + 1}`);
        const dayElement = document.getElementById(`d${index + 1}`);

        if (minMaxElement && dayElement) {
          minMaxElement.textContent = `Min: ${Math.round(dailyTemps[date].min)}°F Max: ${Math.round(dailyTemps[date].max)}°F`;
          dayElement.textContent = date;
        }
      });
    });
}

function HourlyForecast() {
  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m&hourly=temperature_2m&temperature_unit=fahrenheit&forecast_days=1`)
    .then((response) => response.json())
    .then((data) => {
      // Extract time and temperature data
      const timeArray = data.hourly.time.map((timestamp) => {
        // Convert timestamp to a Date object
        const date = new Date(timestamp);

        // Extract only the time part (HH:mm:ss)
        const time = date.toLocaleTimeString('en-US', { hour12: false });

        return time;
      });
      const temperatureArray = data.hourly.temperature_2m;

      // Log the extracted data (optional)
      console.log("Time Array:", timeArray);
      console.log("Temperature Array:", temperatureArray);

      // If you have a line chart library (e.g., Chart.js), you can call a function to update the chart
      updateChart(timeArray, temperatureArray);
    });
}

function updateChart(timeArray, temperatureArray) {
  const ctx = document.getElementById('myChart').getContext('2d');

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: timeArray,
      datasets: [{
        fill: false,
        lineTension: 0,
        backgroundColor: 'rgba(225, 225, 255, 1.0)',
        borderColor: 'rgba(0, 0, 255, 1)',
        data: temperatureArray
      }]
    },
    options: {
      legend: {
        display: false
      },
      // Add other chart options as needed
    }
  });
}