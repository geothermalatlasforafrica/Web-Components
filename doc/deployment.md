# Deployment

Make sure you have created the Container Registry in Azure in order for your containers to be available to
publish. <https://learn.microsoft.com/en-us/azure/container-registry/>

## Publish script

Example shell script for publishing the proxy Dockerfile to Azure Container registry

```sh
#!/bin/bash

docker --version
if [ $? -eq 0 ]; then
    echo OK - DOCKER IS RUNNING
else
    echo FAIL - DOCKER IS NOT RUNNING
    exit 1
fi

VERSION=0.0.13
REPOSITORY=gaaregistry

docker context use myacicontext

az acr build --image proxy:${VERSION} --registry ${REPOSITORY} --file ./Dockerfile.prod ./

docker context use default
```
