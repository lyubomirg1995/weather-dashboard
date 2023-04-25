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
var today = dayjs().format('M-D-YYYY');
 

function getWeatherData(event) {
  city = $("#city-input").val();
  //console commands provide essential data collection for further feature implementation
    console.log("City ", city);
    var queryURL =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial" +
    "&appid=" +
    APIKey;
    console.log("Query ", queryURL);


  fetch(queryURL)
    .then((response) => response.json()) // implied return was missing, switched to arrow functions
    .then((result) => {
      console.log("Data ", result);
      //converts unix dt to human readable time
      var unixTimeStamp = result.dt
      var date = new Date(unixTimeStamp * 1000);
      //dynamically generates text content to premade HTML card
      dataOutput.css('display', 'block');
      dateEl.text(date.toLocaleDateString("en-US"));
      tempEl.text("Temperature: " + result.main.temp + "°F" );
      windEl.text("Wind: " + result.wind.speed + " MPH");
      humEl.text("Humidity: " + result.main.humidity + "%");

      
      return result; // stops function from executing indefinitely (was missing)
    });
  
    //prevents input (and therefore its output) from disappearing after clicking the search button (was missing)
    event.preventDefault();
  }
      
$('#search-city').on('click', getWeatherData);