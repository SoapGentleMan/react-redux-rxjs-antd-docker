```
# build
cd {WORKSPACE} 
node ./ci/config.js [prod]
sh ./ci/pre-build.sh

# start
cd {WORKSPACE} 
docker kill project-name > /dev/null 2>&1 || true
docker rm project-name > /dev/null 2>&1 || true
docker rmi project-name > /dev/null 2>&1 || true
cd {WORKSPACE} 
docker load -i project-name.tar 
docker run -d --name project-name -p 8082:8080 project-name-release

```