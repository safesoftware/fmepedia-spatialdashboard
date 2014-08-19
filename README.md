FME Server Demo - spatialdashboard
======================================

A web application that shows some live feeds on Google Maps using FME Server.

http://fmepedia.safe.com/articles/Samples_and_Demos/Live-Spatial-Dashboard

Installation Instructions
-------------------------

- Configure recorded_ais_reader.fmw (ais_reader_workaround.fmw to avoid using FeatureReader) with token for REST API. (http://fmeserver/fmetoken) - it needs this
to clean up temporary files

- Publish all workspaces (*.fmw files) to FME Server. Default repository is *spatialdashboard*, and you
will need to modify some settings, such as those in the FMEServerJobSubmitter, if you change this.

- Set up topics: sd_plane, sd_bus, sd_ship

- Set up WebSocket publishers as follows:

   - https://fmeserver:7078/websocket, stream id: **plane_in**, publish to **sd_plane**

   - https://fmeserver:7078/websocket, stream id: **bus_in**, publish to **sd_bus**

   - https://fmeserver:7078/websocket, stream id: **ship_in**, publish to **sd_ship**

- Set up WebSocket subscribers as follows:

   - https://fmeserver:7078/websocket, stream id: **plane_out**, subscribe to **sd_plane**

   - https://fmeserver:7078/websocket, stream id: **bus_out**, subscribe to **sd_bus**

   - https://fmeserver:7078/websocket, stream id: **ship_out**, subscribe to **sd_ship**

- Run recorded_ais_reader (ais_reader_workaround.fmw). Note that it is quite resource intensive, and will relaunch itself on completion.

- Run plane_generator, making sure to specify the output location as $(FME_SHAREDRESOURCE_TEMP)/planez.ffs
   
- Schedule workspaces as follows:

   - plane_displacer: 10 seconds

   - sf_bus_reader: 10 seconds (is a live feed, so do not abuse)

- Configure spatialdashboard.js to connect to your server. You will need a token here.

- Host contents of /www on a publicly accessible web host (S3 is fine)

- Remember to [enable CORS](http://docs.safe.com/fme/html/FME_Server_Documentation/Default.htm#Configuring_CORS_Filtering.htm) on FME Server

- Visit http://fmeserver/spatialdashboard to view