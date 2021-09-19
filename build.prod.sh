#!/bin/bash

echo "build BE english..."
read -p "enter version:    " VER

docker image build --no-cache -t xaythixin/images:english.prod.be.$VER -t xaythixin/images:english.prod.be.latest -f docker/DockerFile.build .

read -p "do you want to push image to docker hub [ y/n ]:   " IS_PUSH

if [ $IS_PUSH == "y" ]; then
    docker image push xaythixin/images:english.prod.be.$VER
    docker image push xaythixin/images:english.prod.be.latest
fi

read -p "finish..." no
