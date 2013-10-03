FME Server Installation Instructions
====================================

To install these workspaces on FME Server:

1) Install the custom transformer, VehicleMover.fmx
2) Publish the three workspaces to FME Server, making sure to also publish the necessary resources.
3) Schedule the sf_bus_reader.fmw workspace to run at a suitable update frequency
4) Run ais_reader.fmw and plane_generator.fmw - they will run indefinitely, until you stop them.

NOTE: this setup requires 3 engines on your FME Server.