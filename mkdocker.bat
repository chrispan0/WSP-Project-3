git fetch
git pull
docker stop wsp-project-3
docker rm wsp-project-3
cd C:\Users\Chris\Documents\GitHub\WSP-Project-3\WSP-Project-3
docker build -t wsp-project-3 .
docker run -d -p 8008:4000 --name wsp-project-3 wsp-project-3:latest