const API_KEY = "241cda15c08c8c1edf72f548a252458d";

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const geoBtn = document.getElementById("geoBtn");
const weatherCard = document.getElementById("weatherCard");
const errorBox = document.getElementById("errorBox");

function showError(msg){
  errorBox.style.display = "block";
  errorBox.textContent = msg;
  weatherCard.style.display = "none";
}

function clearError(){
  errorBox.style.display = "none";
  errorBox.textContent = "";
}

function updateCard(data){
  clearError();

  document.getElementById("cityName").textContent =
    `${data.name}, ${data.sys.country}`;
  document.getElementById("weatherDesc").textContent = data.weather[0].description;
  document.getElementById("temperature").textContent =
    Math.round(data.main.temp) + "°C";

  document.getElementById("feels").textContent =
    "Feels: " + Math.round(data.main.feels_like) + "°C";
  document.getElementById("humidity").textContent =
    "Humidity: " + data.main.humidity + "%";
  document.getElementById("wind").textContent =
    "Wind: " + data.wind.speed + " m/s";

  const iconCode = data.weather[0].icon;
  document.getElementById("weatherIcon").src =
    `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  document.getElementById("metaLine").textContent =
    "Updated: " + new Date(data.dt * 1000).toLocaleString();

  weatherCard.style.display = "grid";
}

async function fetchWeatherByCity(city){
  try{
    clearError();
    const url =
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

    const res = await fetch(url);
    const body = await res.json();

    if (!res.ok){
      showError(body.message || "API Error");
      return;
    }

    updateCard(body);
  }catch(err){
    showError(err.message);
  }
}

async function fetchWeatherByCoords(lat, lon){
  try{
    clearError();
    const url =
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;

    const res = await fetch(url);
    const body = await res.json();

    if (!res.ok){
      showError(body.message || "API Error");
      return;
    }

    updateCard(body);
  }catch(err){
    showError(err.message);
  }
}

searchBtn.addEventListener("click", ()=>{
  const city = cityInput.value.trim();
  if (!city) return showError("Please enter a city name.");
  fetchWeatherByCity(city);
});

cityInput.addEventListener("keydown", (e)=>{
  if (e.key === "Enter") searchBtn.click();
});

geoBtn.addEventListener("click", ()=>{
  if (!navigator.geolocation)
    return showError("Geolocation not supported.");

  navigator.geolocation.getCurrentPosition(
    (pos)=>{
      fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
    },
    (err)=> showError(err.message)
  );
});
