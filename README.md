# Geothermal Atlas for Africa

This repository contains the code for the web components of the Geothermal Atlas for Africa. It does not include GeoServer, as this component is directly downloaded from the internet as a `.war` file. The website is deployed on Microsoft Azure.

The directories of this repositories contain the following:
- `api`: Node.js REST API that gives the client access to the database
- `client`: React frontend with OpenLayers map viewer
- `doc`: Detailed documentation of the website's components, how they work, how they're configured and how they're deployed in Azure.
- `proxy`: NGINX reverse proxy to protect components from being accessed outside the Azure virtual network.