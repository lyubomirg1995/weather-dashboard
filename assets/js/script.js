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
 

function getWeatherData(event) {
  city = $("#city-input").val();
  //console commands provide essential data collection for further functions
    console.log("City ", city);
    var queryURL =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    APIKey;
    console.log("Query ", queryURL);

  fetch(queryURL)
    .then((response) => response.json()) // implied return was missing, switched to arrow functions
    .then((result) => {
      console.log("Data ", result);
      return result; // stops function from executing indefinitely 
    });
    //prevents input (and therefore its output) from disappearing after submitting result
    event.preventDefault();
  }
      
$('#search-city').on('click', getWeatherData);