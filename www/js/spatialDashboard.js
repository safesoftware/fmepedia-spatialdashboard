function initialize() {
	FMEServer.init({
		server: "https://demos-safe-software.fmecloud.com",
		token : "35bd9bbd4c15116518070ce4fe4a38e1d2a26292"
	});

	var shipcount = document.getElementById('shipcount');
	var buscount = document.getElementById('buscount');
	var planecount = document.getElementById('planecount');

	L.mapbox.accessToken = 'pk.eyJ1IjoibmF0aGFuYXRzYWZlIiwiYSI6ImNqazRqN2VuazA0dHczcXAyYjkyeTczcnUifQ.ZcD7wuTSCbsLRb_Y-drHjg'
	var map = new L.mapbox.map(document.getElementById("map"),'mapbox.streets').setView([37.78,-122.41],10);

	// Storage for Markers
	var markersShip = new Array();
	var markersBus = new Array();
	var markersPlane = new Array();

	// Storage for WebSocket connections
	var wsShip;
	var wsBus;
	var wsPlane;
	var wsCustom;

	// Do we have web sockets?
	if ("WebSocket" in window) {

		// ============= AIS ====================
		wsShip = FMEServer.getWebSocketConnection("sd_ship");
		// receive
		wsShip.onmessage = function (evt) {

			// {
			// "mmsi_number": "366919770",
			// "heading": "511",
			// "latitude": "37.9054756164551",
			// "longitude": "-122.371559143066",
			// "call_sign": "WDB6192",
			// "class_general": "MM",
			// "class_special": "TUG",
			// "ship_length": "",
			// "tonnage": "196",
			// "vessel_name": "Lynn Marie",
			// "class_general_desc": "Merchant ship ",
			// "class_special_desc": "Pusher/Tug "
			// }

			shipcount.textContent = parseInt(shipcount.textContent) + 1;

			var data = evt.data;
			dataObj = JSON.parse(data);
			mmsi = dataObj.mmsi_number;

			if(markersShip[mmsi] == undefined) {

				var marker = L.marker([dataObj['latitude'],dataObj['longitude']], {
					icon: L.mapbox.marker.icon({
						'marker-color': '#4286f4',
						'marker-size': 'medium',
						'marker-color': '#4286f4',
						'marker-symbol': 'ferry'
					}),
					title: dataObj['vessel_name'],
					description: dataObj['class_general_desc']
				});

				//create html for popup
				var info = '<table><tr><td><strong>Vessel Name<strong></td><td>'+dataObj['vessel_name']+'</td><tr><td><strong>Call Sign</strong></td><td>'+dataObj['call_sign']+' </td></tr><tr><td><strong>Class</strong></td><td>'+dataObj['class_general_desc']+' </td></tr><tr><td><strong>Type</strong></td><td>'+dataObj['class_special_desc']+' </td></tr></table>'
				var popup = L.popup()
					.setContent(info)
				//add popup
				marker.bindPopup(popup);

				marker.addTo(map);
				markersShip[mmsi] = marker;
			}
			else {
				markersShip[mmsi].setLatLng([dataObj['latitude'],dataObj['longitude']]);
			}
		}
		// close
		wsShip.onclose = function() {
		};
		//============= BUS ====================
		wsBus = FMEServer.getWebSocketConnection("sd_bus");
		// receive
		wsBus.onmessage = function (evt) {

			// {
			// "bus_id": "1514",
			// "latitude": "37.75173",
			// "longitude": "-122.38429",
			// "speed": "0.0"
			// }

			buscount.textContent = parseInt(buscount.textContent) + 1;

			var data = evt.data;
			dataObj = JSON.parse(data);
			bus_id = dataObj['bus_id'];

			if(markersBus[bus_id] == undefined) {
				var marker = L.marker([dataObj['latitude'],dataObj['longitude']], {
					icon: L.mapbox.marker.icon({
						'marker-color': '#4286f4',
						'marker-size': 'medium',
						'marker-color': '#23a046',
						'marker-symbol': 'bus'
					}),
					title: dataObj['bus_id']
				});

				//create html for popup
				var info = '<table><tr><td><strong>Bus ID<strong></td><td>'+dataObj['bus_id']+'</td><tr><td><strong>Speed</strong></td><td>'+dataObj['speed']+' MPH</td></tr></table>'
			  var popup = L.popup()
					.setContent(info)
				//add popup
				marker.bindPopup(popup);

				marker.addTo(map);
				markersBus[bus_id] = marker;
			}
			else {
				markersBus[bus_id].setLatLng([dataObj['latitude'],dataObj['longitude']]);
			}
		}
		//close
		wsBus.onclose = function() {
		};
		//================= PLANE =======================
		wsPlane = FMEServer.getWebSocketConnection("sd_plane");
		// receive
		wsPlane.onmessage = function (evt) {

			// {
			// "id": "27b48c",
			// "flight_id": "VRD740",
			// "latitude": "39.5647",
			// "longitude": "-122.235",
			// "altitude": "33300",
			// "heading": "358",
			// "aircraft_model": "A320",
			// "speed": "484.4"
			// }

			planecount.textContent = parseInt(planecount.textContent) + 1;

			var data = evt.data;
			dataObj = JSON.parse(data);
			ship_id = dataObj['id'];

			if(markersShip[ship_id] == undefined) {
				var marker = L.marker([dataObj['latitude'],dataObj['longitude']], {
					icon: L.mapbox.marker.icon({
						'marker-color': '#4286f4',
						'marker-size': 'medium',
						'marker-color': '#a03723',
						'marker-symbol': 'airport'
					}),
					title: dataObj['flight_id'],
					description: dataObj['aircraft_model']
				});

				//create html for popup
				var info = '<table><tr><td><strong>Flight ID<strong></td><td>'+dataObj['flight_id']+'</td><tr><td><strong>Aircraft Model</strong></td><td>'+dataObj['aircraft_model']+' </td></tr><tr><td><strong>Altitude</strong></td><td>'+dataObj['altitude']+' </td></tr></table>'
				var popup = L.popup()
					.setContent(info)
				//add popup
				marker.bindPopup(popup);


				//marker.setPopupContent("title:" + dataObj['flight_id']);
				marker.addTo(map);
				markersShip[ship_id] = marker;
			}
			else {
				markersShip[ship_id].setLatLng([dataObj['latitude'],dataObj['longitude']]);
			}
		}
		// close
		wsPlane.onclose = function() {
		};

	} else {
		alert("Your broswer does not support WebSockets. Try using the latest Firefox, Chrome or Safari browser.");
	};
}
