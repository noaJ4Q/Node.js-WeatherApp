import axios from 'axios';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3000;
const OPEN_WEATHER_API_KEY = process.env.OPEN_WEATHER_API_KEY;

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'October', 'November', 'December'];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_DIFFERENCE = 8; // * 3 hours

let weatherResults;
let forecastResults = [];
let latitude = '33.44';
let longitude = '-94.84';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended : true}));

app.get('/', async (req, res) => {

    forecastResults = [];

    const configWeather = {
        url: '/data/2.5/weather',
        baseURL: 'https://api.openweathermap.org',
        params: {
            lat: latitude,
            lon: longitude,
            appid: OPEN_WEATHER_API_KEY,
        }
    }

    const configForecast = {
        url: '/data/2.5/forecast',
        baseURL: 'https://api.openweathermap.org',
        params: {
            lat: latitude,
            lon: longitude,
            appid: OPEN_WEATHER_API_KEY
        }
    }

    // try{
    //     const [weatherResponse, forecastResponse] = await Promise.all([
    //             axios.request(configWeather),
    //             axios.request(configForecast)
    //         ]);

    //     const weatherData = weatherResponse.data;

    //     weatherResults = {
    //         temp: getTemperature(weatherData.main.temp, 2),
    //         description: getDescription(weatherData.weather[0].description),
    //         location: getLocation(weatherData.name),
    //         date: getDateFromUnix(weatherData.dt),
    //         wind: getWindSpeed(weatherData.wind.speed),
    //         humidity: weatherData.main.humidity,
    //         pressure: weatherData.main.pressure,
    //         visibility: getVisibility(weatherData.visibility),
    //         sunrise: getHourFromUnix(weatherData.sys.sunrise),
    //         sunset: getHourFromUnix(weatherData.sys.sunset)
    //     }

    //     const forecastData = forecastResponse.data;
    //     for (let i = 7; i < forecastData.list.length; i += 8){
    //         const weatherDayData = forecastData.list[i];

    //         const forecastResult = {
    //             day: getDayFromUnix(weatherDayData.dt),
    //             hour: getHourFromUnix(weatherDayData.dt),
    //             temp: getTemperature(weatherDayData.main.temp, 1),
    //         }
    //         forecastResults.push(forecastResult);
    //     }

    //     return res.render('index.ejs', {
    //         dataWeather: weatherResults,
    //         dataForecast: forecastResults
    //     });
    // } catch (error) {
    //     console.error(error);
    //     return res.redirect('/');
    // }
    res.render('index.ejs');

});

app.post('/search', async (req, res) => {
    const location = req.body.location;

    const configGeocoding = {
        url: '/geo/1.0/direct',
        baseURL: 'http://api.openweathermap.org',
        params: {
            q: location,
            appid: OPEN_WEATHER_API_KEY,
        }
    }

    try {
        const response = await axios.request(configGeocoding);
        const data = response.data[0];
        console.log(data);
        latitude = data.lat;
        longitude = data.lon;

        console.log(location);
        
    } catch (error) {
        console.log(error);
    }
    
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

function getTemperature(temperatureKelvin, decimals){
    return Math.round((temperatureKelvin - 273.15) * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

function getDescription(lowerCaseDescription){
    const words = lowerCaseDescription.split(' ');
    const description = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    // console.log(description);
    return description.join(' ');
}

function getLocation(lowerCaseLocation){
    return lowerCaseLocation.charAt(0).toUpperCase() + lowerCaseLocation.slice(1);
}

function getWindSpeed(speedMS){
    return Math.round(speedMS * (18/5));
}

function getVisibility(visibilityMeters){
    return visibilityMeters / 1000;
}

function getHourFromUnix(unixDate){
    const date = new Date(unixDate*1000);
    const hour = date.toISOString().split('T')[1].slice(0, 5);
    return hour;
}

function getDateFromUnix(unixDate){
    const date = new Date(unixDate*1000);
    const day = DAYS[date.getDay()];
    const month = MONTHS[date.getMonth()];
    return `${date.getDate()} ${month} ${day}`;
}

function getDayFromUnix(unixDate){
    const date = getDateFromUnix(unixDate);
    return date.split(' ').slice(-1);
}