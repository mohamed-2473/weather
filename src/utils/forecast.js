const request = require('request');

const forecast = (longitude, latitude, callback) => {
    const url = `https://api.weatherapi.com/v1/current.json?key=1cc00dbafcdd4c29b4f210752230905&q=${longitude},${latitude}`;

    request({ url, json: true }, (error, response) => {
        if (error) {
            callback("Unable to connect to weather service", undefined);
        } else if (response.body.error) {
            callback(response.body.error.message, undefined);
        } else {
            callback(undefined, {
                condition: response.body.current.condition.text,
                temperature: response.body.current.temp_c,
                coordinates: `${longitude}, ${latitude}`,
                location: response.body.location.name
            });
        }
    });
};

module.exports = forecast;