login-ecr:
	aws ecr get-login-password --region us-east-1 --profile personal-sso-access | docker login --username AWS --password-stdin 609984871633.dkr.ecr.us-east-1.amazonaws.com

login-ecr-ci:
	aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 609984871633.dkr.ecr.us-east-1.amazonaws.com

login-ecr-public:
	aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws/e9k7x3b6

login:
	make login-ecr
	make login-ecr-public

build:
	npm run build \
	&& docker build -t nextjs_tutorial .

run:
	docker run --name nextjs_tutorial --rm -d -p 3000:3000 nextjs_tutorial

stop:
	docker stop nextjs_tutorial

exec:
	docker exec -it nextjs_tutorial /bin/bash

deploy:
	zsh scripts/deploy_aws.sh

deploy-ci:
	bash scripts/deploy_aws_ci.sh
