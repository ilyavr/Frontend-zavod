rm frontend
docker image rm frontend
docker build -t mtd/frontend -f docker/Dockerfile .
docker save mtd/frontend -o frontend
#sudo chown kozlovskiy-di:kozlovskiy-di front
