git fetch
git pull
docker stop wsp-project-3-client
docker rm wsp-project-3-client
cd C:\Users\Chris\Documents\GitHub\WSP-Project-3\WSP-Project-3\client
docker build -t wsp-project-3-client .
docker run -d -p 8007:4000 --name wsp-project-3-client wsp-project-3-client:latest