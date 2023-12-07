login-ecr:
	aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 609984871633.dkr.ecr.us-east-1.amazonaws.com

login-ecr-public:
	aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws

build:
	docker build -t nextjs_tutorial .

tag:
	docker tag nextjs_tutorial:latest 609984871633.dkr.ecr.us-east-1.amazonaws.com/nextjs_tutorial_ecr

push:
	docker push 609984871633.dkr.ecr.us-east-1.amazonaws.com/nextjs_tutorial_ecr

run:
	docker run --name nextjs_tutorial --rm -d -p 3000:3000 nextjs_tutorial

stop:
	docker stop nextjs_tutorial

exec:
	docker exec -it nextjs_tutorial /bin/bash
