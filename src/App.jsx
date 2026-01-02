import { useState } from "react"
import axios from "axios"
import "./index.css"

import {
  FaCloudRain,
  FaSearch,
  FaSun,
  FaCloud,
  FaWind,
} from "react-icons/fa"
import { FaDroplet, FaGlassWater } from "react-icons/fa6"

const API_KEY = import.meta.env.VITE_OPEN_WEATHER_API_KEY

const App = () => {
  const [city, setCity] = useState("")
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const getWeatherData = async () => {
    if (!city.trim()) return

    setLoading(true)
    setError("")
    setWeather(null)

    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather`,
        {
          params: {
            q: city,
            appid: API_KEY,
            units: "metric",
          },
        }
      )
      setWeather(res.data)
    } catch (err) {
      setError("City not found ❌")
    } finally {
      setLoading(false)
    }
  }

  const weatherIcon = (main) => {
    switch (main) {
      case "Clear":
        return <FaSun size={80} className="text-yellow-300" />
      case "Clouds":
        return <FaCloud size={80} className="text-white" />
      case "Rain":
      case "Drizzle":
        return <FaCloudRain size={80} className="text-blue-300" />
      case "Snow":
        return <FaCloudRain size={80} className="text-white" />
      case "Thunderstorm":
        return <FaCloudRain size={80} className="text-purple-400" />
      default:
        return <FaCloud size={80} className="text-white" />
    }
  }

  return (
    <div className="background">
      <div className="relative flex justify-center items-center px-4 min-h-screen bg-weather-gradient">

        <div className="max-w-4xl w-full shadow-2xl p-8 backdrop-blur-sm rounded-2xl space-y-6 border border-white/20">

          {/* HEADER */}
          <div className="flex justify-between items-center gap-4">
            <h1 className="text-4xl text-white font-bold">Weather App</h1>

            <div className="flex items-center gap-3">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Search any city worldwide"
                className="px-4 py-2 bg-white/20 text-white rounded-xl outline-none"
              />
              <button onClick={getWeatherData}>
                <FaSearch size={22} className="text-white" />
              </button>
            </div>
          </div>

          {/* LOADING */}
          {loading && (
            <p className="text-white text-center text-xl">Loading...</p>
          )}

          {/* ERROR */}
          {error && (
            <p className="text-red-400 text-center text-lg">{error}</p>
          )}

          {/* WEATHER CARD */}
          {weather && (
            <>
              <div className="flex items-center justify-between bg-white/10 p-6 rounded-xl">
                <div className="flex items-center gap-6">
                  {weatherIcon(weather.weather[0].main)}
                  <div>
                    <h2 className="text-6xl text-white font-bold">
                      {Math.round(weather.main.temp)}°
                    </h2>
                    <p className="text-white text-xl">
                      {weather.name}, {weather.sys.country}
                    </p>
                    <p className="text-white capitalize">
                      {weather.weather[0].description}
                    </p>
                  </div>
                </div>
              </div>

              {/* INFO BOXES */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
                <Box
                  icon={<FaDroplet size={30} />}
                  title="Humidity"
                  value={`${weather.main.humidity}%`}
                />
                <Box
                  icon={<FaGlassWater size={30} />}
                  title="Pressure"
                  value={`${weather.main.pressure} hPa`}
                />
                <Box
                  icon={<FaWind size={30} />}
                  title="Wind"
                  value={`${weather.wind.speed} m/s`}
                />
                <Box
                  icon={<FaSun size={30} />}
                  title="Feels Like"
                  value={`${Math.round(weather.main.feels_like)}°C`}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const Box = ({ icon, title, value }) => (
  <div className="backdrop-blur-sm rounded-2xl p-4 shadow-xl flex flex-col items-center space-y-2 border border-white/20">
    {icon}
    <h2 className="text-lg font-semibold">{title}</h2>
    <p className="text-xl font-bold">{value}</p>
  </div>
)

export default App
