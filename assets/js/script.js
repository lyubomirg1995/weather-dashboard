var APIKey = "68a6c3ea978b84aa2cc19e3a7396855c";
var city = $('#city-input').val()
var dateEl = $(".card-title");
var tempEl = $("#temperature");
var humEl = $("#humidity");
var windEl = $("#wind-speed");
var cityInput = $("#city-input");
var cityForm = $("#search-cities");
var dataOutput = $("#weather-card");
var clearHistory = $("#clear-history");
var historyContainer = $("#search-history-container");
var futureEl = $("#future-forecast");
var searchButton = $('#search-city');
 

function getWeatherData() {
  city = $('#city-input').val()
  var queryURL =
  "http://api.openweathermap.org/data/2.5/weather?q=" +
  city +
  "&appid=" +
  APIKey;
  // var geoAPIUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1" + "&appid=" + APIKey
  fetch(queryURL).then(function (response) {
    console.log(response);
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data);
      });
    } else {
      alert("Error: " + response.statusText);
    }
  });
}

$('#search-city').on('click', getWeatherData);