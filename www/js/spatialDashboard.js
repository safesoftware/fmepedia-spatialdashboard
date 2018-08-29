function initialize() {
	FMEServer.init({
		server: "https://demos-safe-software.fmecloud.com",
		token : "35bd9bbd4c15116518070ce4fe4a38e1d2a26292"
	});

  var shipcount = document.getElementById('shipcount');
  var buscount = document.getElementById('buscount');
  var planecount = document.getElementById('planecount');

L.mapbox.accessToken = 'pk.eyJ1IjoibmF0aGFuYXRzYWZlIiwiYSI6ImNqazRqN2VuazA0dHczcXAyYjkyeTczcnUifQ.ZcD7wuTSCbsLRb_Y-drHjg'
	var map = new L.mapbox.map(document.getElementById("map"),'mapbox.streets').setView([37.78,-122.41],9);

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

			L.mapbox.featureLayer({
		    	type: 'Feature',
		    	geometry: {
		        type: 'Point',
		        coordinates: [
		          dataObj['longitude'],
		          dataObj['latitude']
		        ]
		    	},
					properties: {
				        title: dataObj['vessel_name'],
				        description: dataObj['class_general_desc'],
				        'marker-size': 'medium',
				        'marker-color': '#4286f4',
				        'marker-symbol': 'ferry'
				    }
			}).addTo(map);
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

			L.mapbox.featureLayer({
					type: 'Feature',
					geometry: {
						type: 'Point',
						coordinates: [
							dataObj['longitude'],
							dataObj['latitude']
						]
				},
				properties: {
							title: dataObj['bus_id'],
							'marker-size': 'medium',
							'marker-color': '#23a046',
							'marker-symbol': 'bus'
					}
		}).addTo(map);
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

	L.mapbox.featureLayer({
			type: 'Feature',
			geometry: {
				type: 'Point',
				coordinates: [
					dataObj['longitude'],
					dataObj['latitude']
				]
		},
		properties: {
					title: dataObj['aircraft_model'],
					description: dataObj['flight_id'],
					'marker-size': 'medium',
					'marker-color': '#a03723',
					'marker-symbol': 'airfield'
			}
}).addTo(map);
			};
		// close
		wsPlane.onclose = function() {
		};

	} else {
		alert("Your broswer does not support WebSockets. Try using the latest Firefox, Chrome or Safari browser.");
	};
}
