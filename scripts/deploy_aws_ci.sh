#!/bin/sh

export TZ=Asia/Tokyo
# 最新のgitコミットハッシュをlatest_tagに
latest_tag=$(git rev-parse --short HEAD)

make login-ecr-ci
docker tag nextjs_tutorial:latest 609984871633.dkr.ecr.us-east-1.amazonaws.com/nextjs_tutorial_ecr:$latest_tag
docker push 609984871633.dkr.ecr.us-east-1.amazonaws.com/nextjs_tutorial_ecr:$latest_tag

aws lambda update-function-code --function-name NextJsTutorial --image-uri 609984871633.dkr.ecr.us-east-1.amazonaws.com/nextjs_tutorial_ecr:$latest_tag

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
