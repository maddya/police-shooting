var map;

// Function to draw your map
var drawMap = function() {
 	// Create map and set view
 	var latitude = 34;
 	var longitude = -100;
 	var zoom = 4;

 	var dataSet;


 	map = L.map('mapContainer').setView([latitude, longitude], zoom)
 	// Create a tile layer variable using the appropriate url
	var layer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png')
 	// Add the layer to your map
 	layer.addTo(map)
 	getData()
}

// Function for getting data
var getData = function() {

    // Execute an AJAX request to get the data in data/response.js
    $.getJSON("data/response.json").then(function (data) {
    	dataSet = data;
    }) 

    // When your request is successful, call your customBuild function
    .done(function() {
    	customBuild()
    })

}

// Loop through your data and add the appropriate layers and points
var customBuild = function() {

	var asian = new L.LayerGroup();
	var black = new L.LayerGroup();
	var americanIndian = new L.LayerGroup();
	var pacificIslander= new L.LayerGroup();
	var white = new L.LayerGroup();
	var unknown = new L.LayerGroup();

	var males = 0;
	var females = 0;
	var maleHit = 0;
	var femaleHit = 0;

	for (var i = 0; i < dataSet.length; i++) {
		var d = dataSet[i];
		var lat = d.lat;
		var lng = d.lng;
		var race = d.Race;
		var gen = d["Victim's Gender"];
		var circle; 
		var text = d.Summary + "\nSource Link: " + d["Source Link"];
		var col;
		var injury = d["Hit or Killed?"];

		if (gen == "Male") {
			col = '#0080ff';
			males++;
			if (injury == "Hit") {
				maleHit++;
			}
		} else if (gen == "Female") {
			col = '#ff69ff';
			females++;
			if (injury == "Hit") {
				femaleHit++;
			}
		} else {
			col = '#32CD99';
		}

		circle = new L.circleMarker([lat, lng], {color: col});

		if (race == "Asian") {
			circle.addTo(asian);
		} else if (race == "Black or African American") {
			circle.addTo(black);
		} else if (race == "American Indian or Alaska Native") {
			circle.addTo(americanIndian);
		} else if (race == "Native Hawaiian or Other Pacific Islander") {
			circle.addTo(pacificIslander);
		} else if (race == "White") {
			circle.addTo(white);
		} else {
			circle.addTo(unknown);
		}

		circle.bindPopup(text);

	}

	document.getElementById('malesHit').textContent = maleHit;
	document.getElementById('femalesHit').textContent = femaleHit;
	document.getElementById('malesKilled').textContent = males - maleHit;
	document.getElementById('femalesKilled').textContent = females - femaleHit;
	document.getElementById('maleTotal').textContent = males;
	document.getElementById('femaleTotal').textContent = females;

	var main = {
		"Asian" : asian,
		"Black or African American" : black,
		"American Indian or Alaska Native" : americanIndian,
		"Native Hawaiian or Other Pacific Islander" : pacificIslander,
		"White" : white,
		"Unknown" : unknown
	};

	// Be sure to add each layer to the map

	asian.addTo(map);
	black.addTo(map);
	americanIndian.addTo(map);
	pacificIslander.addTo(map);
	white.addTo(map);
	unknown.addTo(map)
;
	// Once layers are on the map, add a leaflet controller that shows/hides layers
  	L.control.layers(null, main).addTo(map)
}

