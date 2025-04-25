const express = require('express');
const path = require('path');
const forecast = require('./utils/forecast');
const geocode = require('./utils/geocode');

const app = express();
const port = process.env.PORT || 3000;

// Setup static directory to serve
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

// API endpoint for weather data
app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        });
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error });
        }

        forecast(longitude, latitude, (error, forecastData) => {
            if (error) {
                return res.send({ error });
            }

            res.send({
                location,
                forecast: forecastData,
                address: req.query.address
            });
        });
    });
});

// Client-side JavaScript
app.get('/app.js', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/app.js'));
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});



document.getElementById('weatherForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const location = document.getElementById('location').value;
    
    fetch(`/weather?address=${encodeURIComponent(location)}`)
        .then(response => response.json())
        .then(data => {
            const errorElement = document.getElementById('error');
            const weatherCard = document.querySelector('.weather-card');
            
            if (data.error) {
                errorElement.textContent = data.error;
                errorElement.classList.remove('hidden');
                weatherCard.classList.add('hidden');
                return;
            }
            
            errorElement.classList.add('hidden');
            weatherCard.classList.remove('hidden');
            
            document.getElementById('locationName').textContent = data.location;
            document.getElementById('weatherCondition').textContent = data.forecast.condition;
            document.getElementById('temperature').textContent = `Temperature: ${data.forecast.temperature}°C`;
            document.getElementById('coordinates').textContent = `Coordinates: ${data.forecast.coordinates}`;
            
            // You could add an icon based on the weather condition
            // document.getElementById('weatherIcon').src = getWeatherIcon(data.forecast.condition);
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('error').textContent = 'An error occurred while fetching weather data';
            document.getElementById('error').classList.remove('hidden');
        });
});