window.onload = function() {

//Get, format and insert current date
var d = new Date();
var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var months = ["January", "February", "March", "April", "May", "June", "July", 
	"August", "September", "October", "November", "December"];
var day = days[d.getDay()];
var month = months[d.getMonth()];
var date = d.getDate();
var year = d.getFullYear();

document.getElementById("today").innerHTML = day +' '+ month +' '+ date +', '+year;

/* Initialize variables */     
var latitude, longitude, url, httpRequest;
var temp, wind, windDegrees, windDir, description, id;
var tempScale = 'fahrenheit';
var windScale = 'mph'
var isMetric = false;

/* Check for Geolocation API browser support */
var geo = navigator.geolocation;

/* Get current position of user */
function getLocation() {       
  if( geo ) {    
    geo.getCurrentPosition( getUrl );       
    } 
    else  { alert( "Oops, Geolocation API is not supported");        
    }     
}           

function getUrl(position) {         
	latitude = position.coords.latitude.toString();        
 	longitude = position.coords.longitude.toString();
 	url =  'http://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&units=imperial&appid=b6c5c6f4845bfe9501d3ddd641fc5875';
 	makeRequest();
	} 

function convertWeather () {
	if (!isMetric) {
		temp = (temp - 32) * 5/9;
		wind = wind / .62137;
		tempScale = 'celsius';
		windScale = 'km/h';
		isMetric = true;
	} else {
		temp = temp * 9/5 + 32;
		wind = wind * .62137;
		tempScale = 'fahrenheit';
		windScale = 'mph';
		isMetric = false;
	}
	showWeather();
}

function windToDirection (degrees) {
	console.log(degrees);
	var range = 360/16;
	var low = 360 - range/2;
	var high = (low + range) % 360;
	var angles = ["North", "NNE", "NE", "ENE", "East", "ESE", "SE", "SSE", "South", "SSW", "SW", "WSW", "West", "WNW", "NW", "NNW"];

	for (i in angles) {
		if (degrees >= low && degrees < high) {
			return angles[i];
		}
		low = (low + range) % 360;
		high = (high + range) % 360;
	}
	return "North";
}

document.getElementById("checkbox").addEventListener("click", convertWeather);

function showWeather() {
	document.getElementById("weather-icon").setAttribute("src", getIcon(id));
	document.getElementById("weather").innerHTML = description;
	document.getElementById("scale").innerHTML = tempScale;
	document.getElementById("direction").innerHTML = windDir;
	document.getElementById("temp").innerHTML = Math.round(temp) + '&deg';
	document.getElementById("wind").innerHTML = Math.round(wind) + ' ' + windScale;
	document.getElementById("data").style.display = 'inline-block';
	document.getElementById("compass").style.transform = 'rotate(' + windDegrees + 'deg)';
}

function getIcon(code) {
	var icon;
	var weatherImages = ["cloudy.svg", "cloudy2.svg", "lightning3.svg", "rainy2.svg", "snowy3.svg", "sun.svg", "wind.svg", "windy2.svg"];
	switch (true) {
		case code === 800:
			icon = "sun.svg";
			break;
		case (200 <= code && code < 300):
			icon = "lightning3.svg";
			break;
		case (300 <= code && code < 600):
			icon = "rainy2.svg";
			break;
		case (600 <= code && code < 700):
			icon = "snowy3.svg";
			break;
		case (800 < code && code <= 804):
			icon = "cloudy2.svg";
			break;
		default:
			icon = "weather.svg";
			break;
	}
	return "images/" + icon;
}

var x = 'http://api.openweathermap.org/data/2.5/weather?lat=-35.821025&lon=-78.6506472&units=imperial&appid=b6c5c6f4845bfe9501d3ddd641fc5875';
function makeRequest() {
	httpRequest = new XMLHttpRequest();
  	if (!httpRequest) {
      alert('Giving up :( Cannot create an XMLHTTP instance');
      return false;
    }
  httpRequest.onreadystatechange = getWeather;
  httpRequest.open('GET', url);
  httpRequest.send();
}

function getWeather() {
  if (httpRequest.readyState === XMLHttpRequest.DONE) {
    if (httpRequest.status === 200) {
     	var response = JSON.parse(httpRequest.responseText);
     	id = response.weather[0].id;

     	temp = response.main.temp;
     	description = response.weather[0].description;
     	wind = response.wind.speed; 
      windDegrees = response.wind.deg;
      windDir = windToDirection(response.wind.deg);
      windDegrees = windDegrees.toString();

      console.log(windDir);
     	document.getElementById("locate").innerHTML = response.name;
       	
     	if (response.sys.country !== 'US') {
     		document.getElementById("checkbox").checked = true;
     		convertWeather();
      	} else {
      		showWeather();
      	}
      } else {
        alert('There was a problem with the request.');
      }
    }
  }
 	
getLocation();



}



