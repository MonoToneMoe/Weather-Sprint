import { LocalWeather } from "./localWeather.js";
import { weatherKey } from "./apiKeys.js";

let lat;
let long;
let city;

let userInput = document.getElementById("userInput");
let searchBtn = document.getElementById("searchBtn");

let locationName = document.getElementById("locationName");
let date = document.getElementById("date");
let focusedtemp = document.getElementById("focusedtemp");

let currentCity = document.getElementById('focused-weather-city').innerText;
let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];

LocalWeather().then(({ localLat, localLong, localCity }) => {
  lat = localLat;
  long = localLong;
  city = localCity;

  CurrentWeather()
  FiveDayForecast();
  HourlyForecast();
});

function FiveDayForecast() {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${weatherKey}&units=imperial`)
    .then((response) => response.json())
    .then((result) => {
      const dailyData = {};

      result.list.forEach((item) => {
        const date = new Date(item.dt_txt).toLocaleDateString('en-US', { weekday: 'short' });
        const temperature = item.main.temp;
        const icon = item.weather[0].icon;

        if (!dailyData[date] || temperature < dailyData[date].min) {
          dailyData[date] = { min: temperature, max: temperature, icon };
        }

        if (temperature > dailyData[date].max) {
          dailyData[date].max = temperature;
        }
      });

      Object.keys(dailyData).forEach((date, index) => {
        const minMaxElement = document.getElementById(`mm${index + 1}`);
        const dayElement = document.getElementById(`d${index + 1}`);
        const iconElement = document.getElementById(`wi${index + 1}`);

        if (minMaxElement && dayElement && iconElement) {
          minMaxElement.textContent = `Min: ${Math.round(dailyData[date].min)}°F Max: ${Math.round(dailyData[date].max)}°F`;
          dayElement.textContent = date;
          iconElement.src = `../assets/imgs/${dailyData[date].icon}@2x.png`;
        }
      });
    });
}

function HourlyForecast() {
  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m&hourly=temperature_2m&temperature_unit=fahrenheit&forecast_days=1`)
    .then((response) => response.json())
    .then((data) => {
      const timeArray = data.hourly.time.map((timestamp) => {
        const date = new Date(timestamp);
        const time = date.toLocaleTimeString('en-US', { hour12: false });

        return time;
      });
      const temperatureArray = data.hourly.temperature_2m;

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
      },    }
  });
}

function CurrentWeather() {
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${weatherKey}&units=imperial`)
    .then((response) => response.json())
    .then((data) => {
      let focusedWeatherDesc = data.weather[0].description;
      let focusedWeatherTemp = Math.round(data.main.temp);
      let focusedWeatherMax = Math.round(data.main.temp_max);
      let focusedWeatherMin = Math.round(data.main.temp_min);
      let focusedWeatherImg = data.weather[0].icon;
      let focusedWeatherCity = data.name;
      let focusedWeatherDate = data.dt;

      let date = new Date(focusedWeatherDate * 1000);
      let options = {year: 'numeric', month: 'long', day: 'numeric' };
      let formattedDate = date.toLocaleDateString('en-US', options);

      document.getElementById('focused-weather-city').innerText = focusedWeatherCity;
      document.getElementById('focused-weather-desc').innerText = focusedWeatherDesc;
      document.getElementById('focused-weather-temp').innerText = focusedWeatherTemp + "°F";
      document.getElementById('focused-weather-max').innerText = `Max: ${focusedWeatherMax}°F`;
      document.getElementById('focused-weather-min').innerText = focusedWeatherMin + "°F";
      document.getElementById('focused-weather-date').innerText = formattedDate;
      document.getElementById('focused-weather-img').src = `../assets/imgs/${focusedWeatherImg}@2x.png`;
    })
    .catch((error) => {
      console.error('Error fetching weather data:', error);
    });
}

function FindCity() {
  let cityInput = userInput.value.toLowerCase();

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${weatherKey}&units=imperial`).then
  ((response) => response.json()).then
  ((data) => {
      let focusedWeatherDesc = data.weather[0].description;
      let focusedWeatherTemp = Math.round(data.main.temp);
      let focusedWeatherMax = Math.round(data.main.temp_max);
      let focusedWeatherMin = Math.round(data.main.temp_min);
      let focusedWeatherImg = data.weather[0].icon;
      let focusedWeatherCity = data.name;
      let focusedWeatherDate = data.dt;

      let date = new Date(focusedWeatherDate * 1000);
      let options = {year: 'numeric', month: 'long', day: 'numeric' };
      let formattedDate = date.toLocaleDateString('en-US', options);

      document.getElementById('focused-weather-city').innerText = focusedWeatherCity;
      document.getElementById('focused-weather-desc').innerText = focusedWeatherDesc;
      document.getElementById('focused-weather-temp').innerText = focusedWeatherTemp + "°F";
      document.getElementById('focused-weather-max').innerText = `Max: ${focusedWeatherMax}°F`;
      document.getElementById('focused-weather-min').innerText = focusedWeatherMin + "°F";
      document.getElementById('focused-weather-date').innerText = formattedDate;
      document.getElementById('focused-weather-img').src = `../assets/imgs/${focusedWeatherImg}@2x.png`;

      updateBookmarkButton(focusedWeatherCity);
  }).then
  
  
  
};

function FiveDayForecastSearch() {
  let cityInput = userInput.value.toLowerCase();
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityInput}&appid=${weatherKey}&units=imperial`)
    .then((response) => response.json())
    .then((result) => {
      const dailyData = {};

      result.list.forEach((item) => {
        const date = new Date(item.dt_txt).toLocaleDateString('en-US', { weekday: 'short' });
        const temperature = item.main.temp;
        const icon = item.weather[0].icon;

        if (!dailyData[date] || temperature < dailyData[date].min) {
          dailyData[date] = { min: temperature, max: temperature, icon };
        }

        if (temperature > dailyData[date].max) {
          dailyData[date].max = temperature;
        }
      });

      Object.keys(dailyData).forEach((date, index) => {
        const minMaxElement = document.getElementById(`mm${index + 1}`);
        const dayElement = document.getElementById(`d${index + 1}`);
        const iconElement = document.getElementById(`wi${index + 1}`);

        if (minMaxElement && dayElement && iconElement) {
          minMaxElement.textContent = `Min: ${Math.round(dailyData[date].min)}°F Max: ${Math.round(dailyData[date].max)}°F`;
          dayElement.textContent = date;
          iconElement.src = `../assets/imgs/${dailyData[date].icon}@2x.png`;
        }
      });
    });
}

function HourlyForecastSearch() {
  let cityInput = userInput.value.toLowerCase();

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${weatherKey}&units=imperial`)
    .then((response) => response.json())
    .then((data) => {
      let lat = data.coord.lat;
      let lon = data.coord.lon;

      return fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&hourly=temperature_2m&temperature_unit=fahrenheit&forecast_days=1`);
    })
    .then((response) => response.json())
    .then((data) => {
      const timeArray = data.hourly.time.map((timestamp) => {
        const date = new Date(timestamp);
        const time = date.toLocaleTimeString('en-US', { hour12: false });

        return time;
      });
      const temperatureArray = data.hourly.temperature_2m;

      updateChart(timeArray, temperatureArray);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
}



searchBtn.addEventListener("click", function (e) {
  FindCity();
  FiveDayForecastSearch();
  HourlyForecastSearch();
});



function saveBookmarks() {
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}

function isCityBookmarked(cityName) {
  return bookmarks.some((bookmark) => bookmark.cityName === cityName);
}

function bookmarkCity(cityName) {
  if (!isCityBookmarked(cityName)) {
    bookmarks.push({ cityName });
    saveBookmarks();
    updateBookmarkButton(cityName);
  }
}

function unbookmarkCity(cityName) {
  bookmarks.splice(bookmarks.findIndex((bookmark) => bookmark.cityName === cityName), 1);
  saveBookmarks();
  updateBookmarkButton(cityName);
}

function updateBookmarkButton(cityName) {
  const isBookmarked = isCityBookmarked(cityName);
  bookmarkImg.src = isBookmarked ? "../assets/imgs/bookmark-closed.png" : "../assets/imgs/bookmark-open.png";
}

bookmarkBtn.addEventListener('click', function () {
  const currentCity = document.getElementById('focused-weather-city').innerText;
  if (isCityBookmarked(currentCity)) {
    unbookmarkCity(currentCity);
  } else {
    bookmarkCity(currentCity);
  }
  
  updateDropdown();
});



function updateDropdown() {
  const dropdownContent = document.getElementById('dropdown-content');

  dropdownContent.innerHTML = '';

  bookmarks.forEach((bookmark) => {
    const cityElement = document.createElement('p');
    cityElement.textContent = bookmark.cityName;

    cityElement.addEventListener('click', function () {
      loadWeatherForCity(bookmark.cityName);
    });

    dropdownContent.appendChild(cityElement);
  });
}

updateDropdown();