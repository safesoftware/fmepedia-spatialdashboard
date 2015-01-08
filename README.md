FME Server Demo - spatialdashboard
======================================

A web application that shows some live feeds on Google Maps using FME Server.

http://fmepedia.safe.com/articles/Samples_and_Demos/Live-Spatial-Dashboard

Installation Instructions
-------------------------

- Confiure the workspaces with the correct URL and port for your server in the WebSocketSender's - you may wish to use localhost.

- Publish all workspaces (*.fmw files) to FME Server.

- To test, run sd_ship.fmw and sd_plane.fmw. If they work, cancel them, and submit with the RTC (run 'til cancelled) option set to true. This will ensure that the jobs get resubmitted when they finish.

- Schedule the sd_bus.fmw workspace to run every 10 seconds. This is a third-party feed, so please do not abuse it.

- Configure spatialdashboard.js to connect to your server. You will need a token here.

- Host contents of /www on a publicly accessible web host (S3 is fine).

- Remember to enable CORS (Cross-Origin Resource Sharing) on FME Server. This is available under the administration dropdown menu.

- Visit the web site to view.