var APIKey = "68a6c3ea978b84aa2cc19e3a7396855c"; 
var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
var dateEl = $('.card-title');
var tempEl = $('#temperature');
var humEl = $('#humidity');
var windEl = $('#wind-speed');
var cityInput = $('#city-input');
var cityForm = $('#search-cities');
var dataOutput = $('#weather-card');
var clearHistory = $('#clear-history');
var historyContainer = $('#search-history-container');
var futureEl = $('#future-forecast');

