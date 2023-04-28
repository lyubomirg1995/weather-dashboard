//assign variables with jQuery selection of all relevant HTML elements
var APIKey = "68a6c3ea978b84aa2cc19e3a7396855c";
var city = $("#city-input").val();
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
var searchButton = $("#search-city");
var today = dayjs().format("M-D-YYYY");

function getWeatherData(event) {
  event.preventDefault(); //ensures city input is processed by preventing page refresh
  city = $("#city-input").val();

  getCurrentWeatherData(city);
}

function getCurrentWeatherData(city) {
  //console commands provide essential data collection for further feature implementation
  console.log("City ", city);
  
  var queryURL =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial" +
    "&appid=" +
    APIKey;
  console.log("Query ", queryURL);
  
  //output current weather data
  fetch(queryURL)
    .then((response) => response.json())
    .then((result) => { // result object is logged to the console 
      console.log("Data ", result);
      //converts unix dt to human readable time
      //unix and date variables moved out of global scope to 2nd then block to avoid undefined result variable
      var unixTimeStamp = result.dt;
      var date = new Date(unixTimeStamp * 1000);
      var lat = result.coord.lat;
      var lon = result.coord.lon;
      var iconCode = result.weather[0].icon
      var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png"
      var iconDisplay = $('#wicon').attr('src', iconUrl);

      getFiveDayForecastData(lat, lon);
//imperial units needed for Fahrenheit value, lat and lon needed for 5-day forecast
      function getFiveDayForecastData(lat, lon) {
        var fiveDayApiUrl =
          "http://api.openweathermap.org/data/2.5/forecast?" +
          "units=imperial" +
          "&lat=" +
          lat +
          "&lon=" +
          lon +
          "&appid=" +
          APIKey;
        console.log("Future Query ", fiveDayApiUrl);

        fetch(fiveDayApiUrl)
          .then((responseFuture) => responseFuture.json())
          .then((resultFuture) => {
            console.log("Future Data ", resultFuture);
            var fiveDayForecast = [];
            $("#future-title").text("5-Day Forecast").css("margin-top", "5%");

            futureEl.empty(); // prevents new forecast data from appending to old forecast data

            //increments every 7, instead of 8, to ensure 5 data points from an array of 40 objects
            for (var i = 8; i < resultFuture.list.length; i += 7) {
              var arrayData = resultFuture.list[i];
              fiveDayForecast.push(arrayData);
           
              var futureUnixTimeStamp = arrayData.dt;
              //converts unix time to human time
              var futureDate = new Date(futureUnixTimeStamp * 1000);
              var futureReadableData = futureDate.toLocaleDateString("en-US");
              //dynamically generating card template to be created 5 times for each successive day
              var futureCardEl = $("<div></div>").attr("id", "future-card");
              futureCardEl.addClass("card me-4");
              futureEl.append(futureCardEl);
              

              var futureCardBodyEl = $("<div></div>").addClass("card-body");
              futureCardEl.append(futureCardBodyEl);

              var futureIconCode = resultFuture.list[i].weather[0].icon;
              var futureIconUrl = "https://openweathermap.org/img/w/" + futureIconCode + ".png";
              var futureIconDisplay = $("<img>").attr('src', futureIconUrl);

              var futureCardTitleEl = $("<h5></h5>").addClass("card-title");
              //concatenating an empty space, followed by appending icon to date text ensures its positioning next to the date
              futureCardTitleEl.text(futureReadableData + " ");
              futureCardTitleEl.append(futureIconDisplay);
              futureCardBodyEl.append(futureCardTitleEl);

              


              //each content component on one line is created with successive concatenations between jQuery-created <p> tags
              var futureTempEl = $(
                "<p>" + "Temperature: " + arrayData.main.temp + "°F" + "</p>"
              );
              futureTempEl.addClass("card-text");
              futureCardBodyEl.append(futureTempEl);

              var futureWindEl = $(
                "<p>" + "Wind: " + arrayData.wind.speed + "MPH" + "</p>"
              );
              futureWindEl.addClass("card-text");
              futureCardBodyEl.append(futureWindEl);

              var futureHumidityEl = $(
                "<p>" + "Humidity: " + arrayData.main.humidity + "%" + "</p>"
              );
              futureHumidityEl.addClass("card-text");
              futureCardBodyEl.append(futureHumidityEl);
            }

            return resultFuture;
          });
      }
      //dynamically generating current weather card with jQuery, with same logic for creating content on one line, as commented above
      dataOutput.css("display", "block");
      dateEl.text(city + ", " + date.toLocaleDateString("en-US") + " ");
      dateEl.append(iconDisplay);
      tempEl.text("Temperature: " + result.main.temp + "°F");
      windEl.text("Wind: " + result.wind.speed + " MPH");
      humEl.text("Humidity: " + result.main.humidity + "%");

      //tries to get 'searchHistory' item from localStorage and parse it into an array. If it doesn't exist or is null, the OR operator ensures searchHistoryArray is assigned an array.
      var searchHistoryArray =
        JSON.parse(localStorage.getItem("searchHistory")) || [];

      //conditional prevents a duplicate from being added to search history
      if (!searchHistoryArray.includes(city)) {
        searchHistoryArray.push(city);
        localStorage.setItem(
          "searchHistory",
          JSON.stringify(searchHistoryArray)
        );

        var searchHistoryList = $("<li></li>");
        searchHistoryList.css("list-style", "none");
        searchHistoryList.addClass("history-list");
        var searchHistoryBtn = $("<button></button>");
        searchHistoryBtn.text(city);
        searchHistoryBtn.addClass("search-history-btn");
        searchHistoryBtn.attr("data-city", city);
        searchHistoryList.append(searchHistoryBtn);
        historyContainer.append(searchHistoryList);
      }
      return result; // stops function from executing indefinitely (was missing)
    });
}

$("#search-city").on("click", getWeatherData);

function retrieveStoredHistory() {
  var searchHistoryArray =
    JSON.parse(localStorage.getItem("searchHistory")) || [];
//recreates previous searches with jQuery-created buttons, then appends them to search-history-container
  for (var i = 0; i < searchHistoryArray.length; i++) {
    var searchHistoryList = $("<li></li>");
    searchHistoryList.css("list-style", "none");
    searchHistoryList.addClass("history-list");
    var searchHistoryBtn = $("<button></button>");
    searchHistoryBtn.text(searchHistoryArray[i]);
    searchHistoryBtn.addClass("search-history-btn");
    searchHistoryBtn.attr("data-city", searchHistoryArray[i]);
    searchHistoryList.append(searchHistoryBtn);
    historyContainer.append(searchHistoryList);
  }
}

retrieveStoredHistory(); // ensures search history is loaded as the page loads or refreshes

$("#search-history-container").on("click", function (event) {
  event.preventDefault();
  var clickedButton = event.target;

//current and future weather data is populates the screen after clicking a button in the search history
  if ($(clickedButton).hasClass("search-history-btn")) {
    city = $(clickedButton).data("city");
    getCurrentWeatherData(city);
  }
});
//clears search history by clearing local storage
$("#clear-history").on("click", function () {
  localStorage.removeItem("searchHistory");
  $("#search-history-container").empty();
});
