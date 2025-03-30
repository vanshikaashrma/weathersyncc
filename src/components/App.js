import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchEngine from "./SearchEngine";
import Forecast from "./Forecast";
import "../styles.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  const [query, setQuery] = useState("Delhi");
  const [weather, setWeather] = useState({
    loading: true,
    data: {},
    error: false,
  });

  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favoriteCities"));
    if (savedFavorites) {
      setFavorites(savedFavorites);
    }
  }, []);

  useEffect(() => {
    if (query) {
      fetchWeather(query);
    }
  }, [query]); // Fetch weather when query changes

  const toDate = () => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const currentDate = new Date();
    return `${days[currentDate.getDay()]} ${currentDate.getDate()} ${months[currentDate.getMonth()]}`;
  };

  const fetchWeather = async (city) => {
    setWeather({ ...weather, loading: true });
  
    const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
    
    if (!apiKey) {
      console.error("API Key is missing! Check your environment variables.");
      setWeather({ ...weather, data: {}, error: true });
      return;
    }
  
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  
    try {
      const res = await axios.get(url);
      setWeather({ data: res.data, loading: false, error: false });
    } catch (error) {
      setWeather({ ...weather, data: {}, error: true });
      console.error("Error fetching weather data:", error);
    }
  };
  

  const search = (event) => {
    event.preventDefault();
    if (event.type === "click" || (event.type === "keydown" && event.key === "Enter")) {
      fetchWeather(query);
    }
  };

  const addToFavorites = () => {
    if (!favorites.includes(query)) {
      const updatedFavorites = [...favorites, query];
      setFavorites(updatedFavorites);
      localStorage.setItem("favoriteCities", JSON.stringify(updatedFavorites));
    }
  };

  const removeFavorite = (city) => {
    const updatedFavorites = favorites.filter((fav) => fav !== city);
    setFavorites(updatedFavorites);
    localStorage.setItem("favoriteCities", JSON.stringify(updatedFavorites));
  };

  return (
    <div className="App">
      <SearchEngine query={query} setQuery={setQuery} search={search} />

      {weather.loading && <h4>Searching...</h4>}
      {weather.error && <span className="error-message">City not found. Please try again.</span>}

      {weather && weather.data && weather.data.weather && (
        <div>
          <Forecast weather={weather} toDate={toDate} />
          <button className="save-btn" onClick={addToFavorites}>⭐ Save to Favorites</button>
        </div>
      )}

      {/* Favorites Section */}
      <div className="favorites-container">
        <h3>Favorites</h3>
        {favorites.map((favCity, index) => (
          <button key={index} onClick={() => setQuery(favCity)} className="favorite-btn">
            {favCity} <span onClick={(e) => { e.stopPropagation(); removeFavorite(favCity); }}>❌</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
