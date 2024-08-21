# Publishing data

Publishing data to GeoServer can be done in a multitude of ways.

## GeoServer's administration interface

A requirement of using this method is that you need direct access to the GeoServer data directory. In order for this
method to work, the data needs to be copied to the GeoServer data directory. Subsequently the data can be published by
creating a store and a layer. For more information on using this method, check the
documentation: <https://docs.geoserver.org/latest/en/user/gettingstarted/shapefile-quickstart/index.html>.

## GeoCat Bridge QGIS plugin

This is probably the most convenient as hassle-free way to publish data to GeoServer. The GeoCat Bridge QGIS plugin
allows data to be published to GeoServer from your local machine, provided the credentials to the GeoServer instance are
known.
The website (<https://www.geocat.net/docs/bridge/qgis/v4.0/index.html>) provides a complete guide on how to install and
use the plugin. In general, the flow is as follows:

- Install the plugin in QGIS: <https://www.geocat.net/docs/bridge/qgis/v4.0/installation.html#installation>
- Load your data in QGIS. Could be raster or a shapefile data.
- Apply the desired styling to the layers. The styling you configure in GeoServer will be published to GeoServer.
- Save the QGIS project. The name you give the QGIS project will be used as the name of the GeoServer workspace.
- In the GeoCat Bridge dialog, set up the GeoServer
  connection: <https://www.geocat.net/docs/bridge/qgis/v4.0/bridge_dialog.html>, <https://www.geocat.net/docs/bridge/qgis/v4.0/server_configuration.html>
- Select the layers you want to publish and click publish: <https://www.geocat.net/docs/bridge/qgis/v4.0/publish.html>

## GeoServer REST API

At the time of writing, this option has not been looked into. However, this could be the most hands-off experience due
to these steps being scriptable. You as a developer could write a script which calls a bunch of API endpoints to upload
the data and their corresponding styling. The GeoServer website contains documentation on this
topic: <https://docs.geoserver.org/stable/en/user/rest/>.

## Storing shapefiles in a database

GeoServer supports shapefile storage in a PostgreSQL database with PostGIS enabled. GeoCat Bridge has an option to let
the data be saved in a database instead of files on a machine. See the Geocat documentation for further details.

As far as I know at the time of writing, storing raster data in the database is impossible or at least very inconvenient
compared to file storage.
