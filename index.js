import axios from 'axios';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3000;
const OPEN_WEATHER_API_KEY = process.env.OPEN_WEATHER_API_KEY;

let weatherResults;
let latitude = '33.44';
let longitude = '-94.84';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended : true}));

app.get('/', async (req, res) => {

    const configWeather = {
        url: '/data/2.5/weather',
        baseURL: 'https://api.openweathermap.org',
        params: {
            lat: latitude,
            lon: longitude,
            appid: OPEN_WEATHER_API_KEY,
        }
    }

    try{
        // const response = await axios.request(configWeather);
        // const data = response.data;
        // // console.log(data);

        // weatherResults = {
        //     temp: getTemperature(data.main.temp),
        //     description: getDescription(data.weather[0].description),
        //     location: getLocation(data.name),
        //     date: getDate(),
        //     wind: getWindSpeed(data.wind.speed),
        //     humidity: data.main.humidity,
        //     pressure: data.main.pressure,
        //     visibility: getVisibility(data.visibility),
        //     sunrise: getHourFromUnix(data.sys.sunrise),
        //     sunset: getHourFromUnix(data.sys.sunset)
        // }

        return res.render('index.ejs', {
            data: weatherResults
        });
    } catch (error) {
        console.log(error);
        return res.redirect('/');
    }

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

function getTemperature(temperatureKelvin){
    return Math.round((temperatureKelvin - 273.15) * 100) / 100;
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

function getDate(){
    return '28 August Monday';
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
    // console.log(hour);
    return hour;
}