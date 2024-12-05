sudo docker container stop front
sudo docker container rm front
sudo docker image rm mtd/frontend
sudo docker load -i front
sudo sh start.sh
