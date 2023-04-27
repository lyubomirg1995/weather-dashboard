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
  event.preventDefault();
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

  fetch(queryURL)
    .then((response) => response.json())
    .then((result) => {
      console.log("Data ", result);
      //converts unix dt to human readable time
      //unix and date variables moved out of global scope to 2nd then block to avoid undefined result variable
      var unixTimeStamp = result.dt;
      var date = new Date(unixTimeStamp * 1000);
      var lat = result.coord.lat;
      var lon = result.coord.lon;

      getFiveDayForecastData(lat, lon);

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
            $('#future-title').text("5-Day Forecast").css('margin-top', '5%');

            futureEl.empty(); // prevents new forecast data from appending to old forecast data


            for (var i = 0; i < resultFuture.list.length; i += 8) {
              
              
              var arrayData = resultFuture.list[i];
              fiveDayForecast.push(arrayData);
              
              var futureUnixTimeStamp = arrayData.dt
              var futureDate = new Date(futureUnixTimeStamp * 1000);
              var futureReadableData = futureDate.toLocaleDateString("en-US");
              

              var futureCardEl = $('<div></div>').attr("id", "future-card");
              futureCardEl.addClass('card');
              futureEl.append(futureCardEl);

              var futureCardBodyEl = $('<div></div>').addClass('card-body');
              futureCardEl.append(futureCardBodyEl);

              var futureCardTitleEl = $('<h5></h5>').addClass('card-title');
              futureCardTitleEl.text(futureReadableData);
              futureCardBodyEl.append(futureCardTitleEl);

              var futureTempEl = $('<p>' + "Temperature: " + arrayData.main.temp + "°F" + '</p>')
              futureTempEl.addClass('card-text');
              futureCardBodyEl.append(futureTempEl);
              

              var futureWindEl = $('<p>' + "Wind: " + arrayData.wind.speed + "MPH" + '</p>');
              futureWindEl.addClass('card-text');
              futureCardBodyEl.append(futureWindEl);
              

              var futureHumidityEl = $('<p>' + "Humidity: " + arrayData.main.humidity + "%" + '</p>');
              futureHumidityEl.addClass('card-text');
              futureCardBodyEl.append(futureHumidityEl);
            

            } 

            return resultFuture;
          });
      }

      dataOutput.css("display", "block");
      dateEl.text(city + ", " + date.toLocaleDateString("en-US"));
      tempEl.text("Temperature: " + result.main.temp + "°F");
      windEl.text("Wind: " + result.wind.speed + " MPH");
      humEl.text("Humidity: " + result.main.humidity + "%");

      var searchHistoryArray= JSON.parse(localStorage.getItem('searchHistory')) || [];

      if(!searchHistoryArray.includes(city)) {
        
        searchHistoryArray.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistoryArray));

        var searchHistoryList = $('<li></li>');
        searchHistoryList.css('list-style', 'none');
        searchHistoryList.addClass('history-list')
        var searchHistoryBtn = $('<button></button>');
        searchHistoryBtn.text(city);
        searchHistoryBtn.addClass('search-history-btn');
        searchHistoryBtn.attr('data-city', city);
        searchHistoryList.append(searchHistoryBtn);
        historyContainer.append(searchHistoryList);

      
      }
      return result; // stops function from executing indefinitely (was missing)
    });
}

$("#search-city").on("click", getWeatherData);

  function retrieveStoredHistory() {
  var searchHistoryArray= JSON.parse(localStorage.getItem('searchHistory')) || [];

  
  for (var i = 0; i < searchHistoryArray.length; i++) {
    var searchHistoryList = $('<li></li>');
    searchHistoryList.css('list-style', 'none');
    searchHistoryList.addClass('history-list');
    var searchHistoryBtn =  $('<button></button>');
    searchHistoryBtn.text(searchHistoryArray[i]);
    searchHistoryBtn.addClass('search-history-btn');
    searchHistoryBtn.attr('data-city', searchHistoryArray[i]);
    searchHistoryList.append(searchHistoryBtn);
    historyContainer.append(searchHistoryList);
  }
}

retrieveStoredHistory();
  
$('#search-history-container').on("click", function(event) {
  event.preventDefault();
  var clickedButton = event.target

  if ($(clickedButton).hasClass('search-history-btn')) {
      city = $(clickedButton).data('city');
      getCurrentWeatherData(city);
  };

  
})

$("#clear-history").on("click", function() {
  localStorage.removeItem("searchHistory")
  $('#search-history-container').empty();
})

