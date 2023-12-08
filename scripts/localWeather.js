import { geoapifyKey } from "./apiKeys.js";
export {LocalWeather};

function LocalWeather() {
    return fetch(`https://api.geoapify.com/v1/ipinfo?apiKey=${geoapifyKey}`)
        .then(response => response.json())
        .then(data => {
            let localLat = data.location.latitude;
            let localLong = data.location.longitude;
            let localCity = data.city.name;
            return { localLat, localLong, localCity };
        });
}