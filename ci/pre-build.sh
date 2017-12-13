#!/usr/bin/env bash
source ./ci/config.sh
COMMIT_ID=`git rev-parse HEAD`
export PROJECT_NAME=`git config --get remote.origin.url | cut -d"/" -f2 | awk -F".git$" '{print $1}'`

CONF=./dist/default.conf
OBJECT_NAME=/${PROJECT_NAME}/${IMG_PREFIX}${COMMIT_ID}.tar
rm -rf ./dist
# check is built
if [ -f "$OBJECT_NAME" ]; then
    echo "exist"
else
    echo "build"
    # build
    if docker build -f ./ci/build/Dockerfile -t ${PROJECT_NAME}-build . &&
    docker run --name ${PROJECT_NAME}-release ${PROJECT_NAME}-build &&
    docker cp ${PROJECT_NAME}-release:/project/dist ./dist &&
    docker rm ${PROJECT_NAME}-release; then
        echo "build success"
    else
        echo "build failed"
        exit 1
    fi

    cp ./ci/default.conf ${CONF}
    sed -i -e "s#%PROJECT_NAME%#${PROJECT_NAME}#g" ${CONF}

    if docker build -t ${PROJECT_NAME}-release -f ./ci/release/Dockerfile . &&
    docker save ${PROJECT_NAME}-release -o ./${COMMIT_ID}.tar &&
    cp -rf ${COMMIT_ID}.tar ${OBJECT_NAME}; then
        # build success
        echo "build success && upload success"
    else
        # build failed
        echo "build failed"
        exit 1
    fi
fi

rm -rf ./*
# download
cp -rf ${OBJECT_NAME} ./${PROJECT_NAME}.tar
# publish
echo "success"
#BUILT=`curl -s -o /dev/null -w '%{http_code}' -X HEAD -I http://minio.avlyun.org/insight-container-archive/${PROJECT_NAME}/${COMMIT_ID}.tar`
#if [ ${BUILT} -eq 200 ]; then
#  echo "Got 200! All done!"
#  break
#else
#  echo "Got ${BUILT} :( Not done yet..."
#fi