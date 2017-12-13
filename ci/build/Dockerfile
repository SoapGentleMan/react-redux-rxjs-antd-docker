FROM node:8
WORKDIR /project
COPY . /project/
COPY ci/build.sh  /project/
COPY ci/config.sh  /project/
ENTRYPOINT sh ./build.sh
