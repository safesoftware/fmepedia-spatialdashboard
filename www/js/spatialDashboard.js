function initialize() {
	FMEServer.init({
		server: "https://demos-safe-software.fmecloud.com",
		token : "35bd9bbd4c15116518070ce4fe4a38e1d2a26292"
	});

  var shipcount = document.getElementById('shipcount');
  var buscount = document.getElementById('buscount');
  var planecount = document.getElementById('planecount');
  
	var myLatlng = new google.maps.LatLng(37.7850,-122.4183);

	var myOptions = {
		zoom: 11,
		center: myLatlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		mapTypeControl: true,
		mapTypeControlOptions: {
			style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
			position: google.maps.ControlPosition.LEFT_BOTTOM
		},

	}

	var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	var iconroot = "http://demos.fmeserver.com/spatialdashboard/libs/";

	// Storage for Markers
	var markers = new Array();
	var markersBus = new Array();
	var markersCustom = new Array();
	var markersPlane = new Array();

	// Storage for WebSocket connections
	var ws;
	var wsBus;
	var wsPlane;
	var wsCustom;

	// Do we have web sockets?
	if ("WebSocket" in window) {

	
		// ============= AIS ====================
		ws = FMEServer.getWebSocketConnection("sd_ship");

		// receive
		ws.onmessage = function (evt) {
			/*
			{
			"mmsi_number": "366919770",
			"heading": "511",
			"latitude": "37.9054756164551",
			"longitude": "-122.371559143066",
			"call_sign": "WDB6192",
			"class_general": "MM",
			"class_special": "TUG",
			"ship_length": "",
			"tonnage": "196",
			"vessel_name": "Lynn Marie",
			"class_general_desc": "Merchant ship ",
			"class_special_desc": "Pusher/Tug "
			}
			*/

      
      shipcount.textContent = parseInt(shipcount.textContent) + 1;
      
			var data = evt.data;
			dataObj = JSON.parse(data);
			// document.getElementById('container').innerHTML = dataObj['latitude'];
			mmsi = dataObj.mmsi_number;
			var point = new google.maps.LatLng(dataObj['latitude'],dataObj['longitude']);
			// alert(markers[mmsi]);

			var image = iconroot + "ship.png";
			var ton = dataObj['tonnage'];
			if (ton < 100) {
				var imgScaledSize = new google.maps.Size(30,30);
			}
			else if (ton > 100 && ton < 10000) {
				var imgScaledSize = new google.maps.Size(35,35);
			}
			else if (ton > 10000) {
				var imgScaledSize = new google.maps.Size(50,50);
			}
			else {
				var imgScaledSize = new google.maps.Size(30,30);
			}

			// var imgScaledSize = new google.maps.Size(20,20);
			var markerImg = new google.maps.MarkerImage(image, null, null, null, imgScaledSize);
			// var markerImg = new google.maps.MarkerImage(image, imgScaledSize , imgScaledOrigin, imgScaledAnchor, imgSize);
      
			if(markers[mmsi] == undefined) {

				var title = "Vessel: " + dataObj['vessel_name'] + "\n Class: " + dataObj['class_special_desc'] + "\n Tonnage: " + dataObj['tonnage'];
				// alert('a');
				var marker = new google.maps.Marker({
					position: point,
					map: map,
					title: title,
					icon: markerImg
				});
				markers[mmsi] = marker;
			}
			else {
				// alert('b');
				markers[mmsi].setPosition(point);
			}

			// alert(data);
		};

		// close
		ws.onclose = function() {
		};

		//============= BUS ====================
		wsBus = FMEServer.getWebSocketConnection("sd_bus");

		// receive
		wsBus.onmessage = function (evt) {
			/*
			{
			"bus_id": "1514",
			"latitude": "37.75173",
			"longitude": "-122.38429",
			"speed": "0.0"
			}
			*/
      
      buscount.textContent = parseInt(buscount.textContent) + 1;
      
			var data = evt.data;
			dataObj = JSON.parse(data);

			bus_id = dataObj['bus_id'];
			var point = new google.maps.LatLng(dataObj['latitude'],dataObj['longitude']);

			var image = iconroot + "bus.png";
			var imgScaledSize = new google.maps.Size(30,30);

			var markerImg = new google.maps.MarkerImage(image, null, null, null, imgScaledSize);

			if(markersBus[bus_id] == undefined) {
				var title = "Bus: " + dataObj['bus_id'] + "\n Speed: " + dataObj['speed'] + " km/h";
				var marker = new google.maps.Marker({
					position: point,
					map: map,
					title: title,
					icon: markerImg
				});
				markersBus[bus_id] = marker;
			}
			else {
				markersBus[bus_id].setPosition(point);
			}

		};

		// close
		wsBus.onclose = function() {
		};

		//================= PLANE =======================
		wsPlane = FMEServer.getWebSocketConnection("sd_plane");

		// receive
		wsPlane.onmessage = function (evt) {
			/*
			{
      "id": "27b48c",
			"flight_id": "VRD740",
			"latitude": "39.5647",
			"longitude": "-122.235",
			"altitude": "33300",
			"heading": "358",
			"aircraft_model": "A320",
			"speed": "484.4"
			}
			*/

      planecount.textContent = parseInt(planecount.textContent) + 1;
      
			var data = evt.data;
			dataObj = JSON.parse(data);

			the_id = dataObj['id'];
			var point = new google.maps.LatLng(dataObj['latitude'],dataObj['longitude']);

			var image = iconroot + "plane.png";
			var imgScaledSize = new google.maps.Size(30,30);

			var markerImg = new google.maps.MarkerImage(image, null, null, null, imgScaledSize);

			if(markersPlane[the_id] == undefined) {
				var marker = new google.maps.Marker({
					position: point,
					map: map,
					title: "Flight: " + dataObj['flight_id'] + "\n Aircraft: " + dataObj['aircraft_model'] + "\n Altitude: " + dataObj['altitude'] + " m\n Speed: " + dataObj['speed'] + " km/h",
					icon: markerImg
				});
				markersPlane[the_id] = marker;
			}
			else {
				markersPlane[the_id].setPosition(point);
			}

			//alert(data);
		};

		// close
		wsPlane.onclose = function() {
		};

	} else {
		alert("Your broswer does not support WebSockets. Try using the latest Firefox, Chrome or Safari browser.");

	};

}