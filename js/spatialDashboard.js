function initialize() {
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

		//============= AIS ====================
		ws = new WebSocket("ws://fmeserver.com:9998/ais", "None");

		// open
		ws.onopen = function() {
			ws.send("consumer");
		};

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

			var data = evt.data;
			dataObj = eval('(' + data + ')');
			//document.getElementById('container').innerHTML = dataObj['latitude'];
			mmsi = dataObj['mmsi_number'];
			var point = new google.maps.LatLng(dataObj['latitude'],dataObj['longitude']);
			//alert(markers[mmsi]);

			var image = "http://maps.google.com/mapfiles/kml/shapes/ferry.png";
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

			//var imgScaledSize = new google.maps.Size(20,20);
			var markerImg = new google.maps.MarkerImage(image, null, null, null, imgScaledSize);
			//var markerImg = new google.maps.MarkerImage(image, imgScaledSize , imgScaledOrigin, imgScaledAnchor, imgSize);

			//var markerImg = new google.maps.MarkerImage("http://maps.google.com/mapfiles/kml/shapes/ferry.png",new google.maps.Size(50, 50))
			if(markers[mmsi] == undefined) {

				var title = "Vessel: " + dataObj['vessel_name'] + "\n Class: " + dataObj['class_special_desc'] + "\n Tonnage: " + dataObj['tonnage'];
				//alert('a');
				var marker = new google.maps.Marker({
					position: point,
					map: map,
					title: title,
					icon: markerImg
				});
				markers[mmsi] = marker;
			}
			else {
				//alert('b');
				markers[mmsi].setPosition(point);
			}

			//alert(data);
		};

		// close
		ws.onclose = function() {
		};

		//============= BUS ====================
		wsBus = new WebSocket("ws://fmeserver.com:9998/bus", "None");

		// open
		wsBus.onopen = function() {
			wsBus.send("consumer");
		};

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

			var data = evt.data;
			dataObj = eval('(' + data + ')');

			bus_id = dataObj['bus_id'];
			var point = new google.maps.LatLng(dataObj['latitude'],dataObj['longitude']);

			var image = "http://maps.google.com/mapfiles/kml/shapes/bus.png";
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
		wsPlane = new WebSocket("ws://fmeserver.com:9998/plane", "None");

		// open
		wsPlane.onopen = function() {
			wsPlane.send("consumer");
		};

		// receive
		wsPlane.onmessage = function (evt) {
			/*
			{
			"flight_id": "VRD740",
			"latitude": "39.5647",
			"longitude": "-122.235",
			"altitude": "33300",
			"heading": "358",
			"aircraft_model": "A320",
			"speed": "484.4"
			}
			*/

			var data = evt.data;
			dataObj = eval('(' + data + ')')

			the_id = dataObj['flight_id'];
			var point = new google.maps.LatLng(dataObj['latitude'],dataObj['longitude']);

			var image = "http://maps.google.com/mapfiles/kml/shapes/airports.png";
			var imgScaledSize = new google.maps.Size(30,30);

			var markerImg = new google.maps.MarkerImage(image, null, null, null, imgScaledSize);

			if(markersPlane[the_id] == undefined) {
				//alert('a');
				var marker = new google.maps.Marker({
					position: point,
					map: map,
					title: "Flight: " + the_id + "\n Aircraft:" + dataObj['aircraft_model'] + "\n Altitude: " + dataObj['altitude'] + "\n Speed: " + dataObj['speed'] + " km/h",
					icon: markerImg
				});
				markersPlane[the_id] = marker;
			}
			else {
				//alert('b');
				markersPlane[the_id].setPosition(point);
			}

			//alert(data);
		};

		// close
		wsPlane.onclose = function() {
		};

		//================= CUSTOM =======================
		wsCustom = new WebSocket("ws://fmeserver.com:9998/custom", "None");

		// open
		wsCustom.onopen = function() {
			wsCustom.send("consumer");
		};

		// receive
		wsCustom.onmessage = function (evt) {
			/*
			{
			"id": "10000001",
			"latitude": "37.50125",
			"longitude": "-121.005",
			"title": "FMEROX",
			"icon_url": "https://dl.dropbox.com/u/3725882/ufo/ufo_8.gif",
			"icon_size": "50"
			}
			*/

			var data = evt.data;
			dataObj = eval('(' + data + ')')

			the_id = dataObj['id'];

			var point = new google.maps.LatLng(dataObj['latitude'],dataObj['longitude']);
			var image = dataObj['icon_url'];
			//var imgScaledSize = new google.maps.Size(dataObj['icon_size'],dataObj['icon_size']);
			var markerImg = new google.maps.MarkerImage(image);//, null, null, null, imgScaledSize);

			if(markersCustom[the_id] == undefined) {
				var marker = new google.maps.Marker({
					position: point,
					map: map,
					title:"FMEROX",
					icon: markerImg
				});
				markersCustom[the_id] = marker;
			}
			else {
				markersCustom[the_id].setPosition(point);
				markersCustom[the_id].setIcon(markerImg);
			}

		};

		// close
		wsCustom.onclose = function() {
		};

	} else {
		alert("You have no web sockets. Try using the latest Firefox, Chrome or Safari browser.");

	};

}