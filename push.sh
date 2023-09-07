#!/bin/bash

npm run build
zip -r dist.zip dist
scp -P26846 dist.zip ubuntu@43.129.162.214:/home/apps
