#!/bin/sh

export TZ=Asia/Tokyo
latest_tag=$(date +"%y-%m-%d.%H-%M")

docker tag nextjs_tutorial:latest 609984871633.dkr.ecr.us-east-1.amazonaws.com/nextjs_tutorial_ecr:$latest_tag
docker push 609984871633.dkr.ecr.us-east-1.amazonaws.com/nextjs_tutorial_ecr:$latest_tag

cd ../personal-aws-infra/nextjs-tutorial

terraform apply -var="ecr_image_latest_tag=$latest_tag" -auto-approve
