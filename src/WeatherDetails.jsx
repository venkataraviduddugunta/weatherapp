// WeatherDetails.jsx

import React, { useState, useEffect } from 'react';
import Loader from './Loader'; // Import Loader component
import './styles.css';

const WeatherDetails = () => {
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('');

  useEffect(() => {
    if (city) {
      fetchData();
    }
  }, [city]);

  const fetchData = async () => {
    setLoading(true);
    const apiKey = '1635890035cbba097fd5c26c8ea672a1';
    const apiUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      const processedData = processData(data);
      setWeatherData(processedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processData = (data) => {
    const processedData = data.list.reduce((acc, item) => {
      const date = item.dt_txt.split(' ')[0];
      if (!acc[date]) {
        acc[date] = {
          date,
          temperature: {
            min: item.main.temp_min + '°C',
            max: item.main.temp_max + '°C',
          },
          pressure: item.main.pressure + ' hPa',
          humidity: item.main.humidity + '%',
        };
      }
      return acc;
    }, {});

    return Object.values(processedData);
  };

  const handleSearch = () => {
    if (city) {
      fetchData();
    }
  };

  return (
    <div className="weather-container">
      <div className="header">
        <h2 className="city-heading">Weather In Your City</h2>
        <div className="search-box">
          <input
            type="text"
            placeholder="Enter City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button onClick={handleSearch}>? Search</button>
        </div>
      </div>
      {loading && <Loader />}
      {weatherData && city && (
        <table className="weather-table">
          <tbody>
            <tr>
              {weatherData.slice(0, 5).map((day, index) => (
                <td key={index}>
                  <h3>Date: {day.date}</h3>
                  <table className="inner-table">
                    <tbody>
                      <tr>
                        <td>Min</td>
                        <td>Max</td>
                      </tr>
                      <tr>
                        <td>{day.temperature.min}</td>
                        <td>{day.temperature.max}</td>
                      </tr>
                      <tr>
                        <td colSpan="2">Pressure: {day.pressure}</td>
                      </tr>
                      <tr>
                        <td colSpan="2">Humidity: {day.humidity}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      )}
      {!city && <p className="center">Please enter a city name to get weather details.</p>}
    </div>
  );
};

export default WeatherDetails;
