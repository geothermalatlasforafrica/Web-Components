# Known issues

- Redeploying a WAR file due to a configuration change might lead to a loss of data. First, verify that this is the case
  by redeploying GeoServer from the Tomcat interface. If data is lost, see if the GeoServer data directory can be
  changed by setting an environment variable. The data directory could also be a Azure storage account, although
  performance of this setup has yet to be tested. A safe bet would be to just move the data directory out of the
  tomcat/webapps folder and set it to /home/... where data is retained instead of overwritten.
