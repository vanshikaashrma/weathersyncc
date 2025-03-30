import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function Forecast({ weather }) {
  const { data } = weather;
  const [forecastData, setForecastData] = useState([]);
  const [isCelsius, setIsCelsius] = useState(true);

  useEffect(() => {
    const fetchForecastData = async () => {
      const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${data.name}&appid=${apiKey}&units=metric`;

      try {
        const response = await axios.get(url);
        const dailyForecast = response.data.list.filter((_, index) => index % 8 === 0);
        setForecastData(dailyForecast);
      } catch (error) {
        console.error("Error fetching forecast data:", error);
      }
    };

    if (data.name) {
      fetchForecastData();
    }
  }, [data.name]);

  const toggleTemperatureUnit = () => {
    setIsCelsius((prevState) => !prevState);
  };

  const convertToFahrenheit = (temperature) => Math.round((temperature * 9) / 5 + 32);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2>{data.name}, {data.sys?.country}</h2>
      <p>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>

      <motion.div
        className="temp"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <img src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`} alt={data.weather[0].description} />
        {isCelsius ? Math.round(data.main.temp) : convertToFahrenheit(data.main.temp)}°
        <sup onClick={toggleTemperatureUnit}>
          {isCelsius ? "C | F" : "F | C"}
        </sup>
      </motion.div>

      <p>{data.weather[0].description}</p>
      <p><strong>Humidity:</strong> {data.main.humidity}%</p>

      <h3>5-Day Forecast:</h3>
      <motion.div
        className="forecast-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {forecastData.map((day, index) => (
          <motion.div
            key={index}
            className="day"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <p>{new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "long" })}</p>
            <img src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`} alt={day.weather[0].description} />
            <p>{Math.round(day.main.temp_min)}° / {Math.round(day.main.temp_max)}°</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default Forecast;
