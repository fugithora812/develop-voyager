#!/bin/sh

export TZ=Asia/Tokyo
latest_tag=$(date +"%y-%m-%d.%H-%M")

make login-ecr-ci

docker tag nextjs_tutorial:latest 609984871633.dkr.ecr.us-east-1.amazonaws.com/nextjs_tutorial_ecr:$latest_tag
docker push 609984871633.dkr.ecr.us-east-1.amazonaws.com/nextjs_tutorial_ecr:$latest_tag

aws lambda update-function-code --function-name NextJsTutorial --image-uri 609984871633.dkr.ecr.us-east-1.amazonaws.com/nextjs_tutorial_ecr:$latest_tag
