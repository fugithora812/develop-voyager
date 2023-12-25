#!/bin/sh

image_id=$1
latest_tag=$2
ecr_repo_uri=$3

echo "image_id: $image_id"
echo "latest_tag: $latest_tag"
echo "ecr_repo_uri: $ecr_repo_uri"

if [ -z "$image_id" ]; then
    echo "image_id is empty."
    exit 1
fi
if [ -z "$latest_tag" ]; then
    echo "latest_tag is empty."
    exit 1
fi
if [ -z "$ecr_repo_uri" ]; then
    echo "ecr_repo_uri is empty."
    exit 1
fi

export TZ=Asia/Tokyo
make login-ecr-ci
docker tag $image_id $ecr_repo_uri:$latest_tag
docker push $ecr_repo_uri:$latest_tag

aws lambda update-function-code \
  --function-name NextJsTutorial \
  --image-uri $ecr_repo_uri:$latest_tag

REPOSITORY_NAME="nextjs_tutorial_ecr"
IMAGE_TAG=$(git rev-parse --short HEAD~2)

# ECRからイメージのリストを取得
images=$(aws ecr list-images --repository-name "$REPOSITORY_NAME" --query 'imageIds[?imageTag==`'"$IMAGE_TAG"'`]' --output json)

# イメージが見つかったか確認
if [[ $images != "[]" ]]; then
    # イメージを削除
    aws ecr batch-delete-image --repository-name "$REPOSITORY_NAME" --image-ids "$images"
    echo "Image with tag $IMAGE_TAG has been deleted."
else
    echo "No image found with tag $IMAGE_TAG. Deployment Complete."
fi
