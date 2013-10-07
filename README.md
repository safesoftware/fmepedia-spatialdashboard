FME Server Demo - spatialdashboard
======================================

A web application that shows some live feeds on Google Maps using FME Server.

Example demo on FME Cloud will be listed here.

Installation Instructions
-------------------------

- Publish all workspaces (*.fmw files) to FME Server.

- Set up topics: sd_plane, sd_bus, sd_ship

- Set up WebSocket publishers as follows:

   - http://fmeserver:7078/websocket, stream id: plane_in, publish to sd_plane

   - http://fmeserver:7078/websocket, stream id: bus_in, publish to sd_bus

   - http://fmeserver:7078/websocket, stream id: ship_in, publish to sd_ship

- Set up WebSocket subscribers as follows:

   - http://fmeserver:7078/websocket, stream id: plane_out, subscribe to sd_plane

   - http://fmeserver:7078/websocket, stream id: bus_out, subscribe to sd_bus

   - http://fmeserver:7078/websocket, stream id: ship_out, subscribe to sd_ship 

- Schedule workspaces as follows:

   - plane_generator: 5 minutes

   - plane_displacer: 5 seconds

   - sf_bus_reader: 10 seconds (is a live feed, so do not abuse)

- Run recorded_ais_reader. Note that it is quite resource intensive.

- Place contents of /www in <FMEServerDir>\Utilities\tomcat\webapps\ROOT\spatialdashboard

- Visit http://myfmeserver/spatialdashboard to view.