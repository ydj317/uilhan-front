#!/bin/bash

npm run build
zip -r dist.zip dist
scp -P26846 dist.zip ubuntu@10.144.0.200:/home/apps
