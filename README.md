# start the server
* Add firebase config in config/firebase.json
* Add databaseUEL in server/firebase.js line 7:17
* sudo docker-compose up --build
* npm install
* npm start
* http://localhost -> for nginx
* http://localhost/config -> for configuration UI
* http://localhost:8000 -> for configuration UI

# firebase is used as DB for saving configuration

# main-home for setting home options

# proxy_pass http://stag.bomayshirts.com;
# proxy_pass http://server_name;

# For ssl issue
> proxy_ssl_server_name on;

> micro service thinks its getting request for url
# proxy_set_header Host stag.bombayshirts.com;

## Nginx commands
* sudo service nginx start
* systemctl status nginx.service
* sudo service nginx reload
> Reload will update config with any server pause

## Docker commands
* sudo docker ps -> view all running
* sudo docker rm docker-nginx -> remove a container
* sudo docker rmi docker-nginx -> remove a image
* sudo docker stop docker-nginx -> stop a container
* sudo docker run -d --name docker-nginx -p 80:80 nginx -> run docker-nginx container
* sudo docker exec -it docker-nginx /bin/bash -> ssh into running docker

## Docker listing
* sudo docker image ls -> list built images
* sudo docker container ls -> running container list
* sudo docker build . -t custom-nginx -> build an image with Dockerfile in current folder
* sudo docker-compose up --build -> run a compose file

## Running Docker command
> docker container exec <container> nginx -s reload

## iframe without referrer
```
<iframe id="inlineFrameExample"
    title="Inline Frame Example"
    width="300"
    height="200"
    referrerpolicy="no-referrer"
    src="http://localhost/enigma/">
</iframe>
```

# Nginx
> All variables https://www.javatpoint.com/nginx-variables

```
# ~ for checking regex without case check
if ($http_referer ~ /(\w+)/(\w+)(.*)$ ) {
    # save sub path if any                              
    set $subpath $2;cases as well in regex
}
```
```
# ~* for checking cases as well in regex
if ($http_referer ~* /(\w+)/(\w+)(.*)$ ) {
    # save sub path if any                              
    set $subpath $2;
}
```