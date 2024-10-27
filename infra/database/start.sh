#!/bin/bash

# Define container name for MySQL
CONTAINER_NAME="mysql_container"

# Check if the MySQL container already exists
if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
    # Check if the container is stopped
    if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
        echo "MySQL is already running."
    else
        echo "MySQL container exists but is stopped. Restarting..."
        docker start $CONTAINER_NAME
    fi
else
    # If no container exists, create and start a new one
    echo "Starting new MySQL container..."
    docker run --name $CONTAINER_NAME -e MYSQL_ROOT_PASSWORD=root_password \
               -e MYSQL_DATABASE=sql10741126 -e MYSQL_USER=user -e MYSQL_PASSWORD=user_password \
               -p 3306:3306 -d mysql:8.0
fi

# Wait for MySQL to become healthy
echo "Waiting for MySQL to be ready..."
until docker exec $CONTAINER_NAME mysqladmin ping --silent; do
    sleep 2
    echo "Waiting for MySQL..."
done

# Grant privileges and create additional databases if needed
echo "Granting privileges to 'user' and creating shadow database..."
docker exec $CONTAINER_NAME mysql -u root -proot_password \
       -e "GRANT ALL PRIVILEGES ON *.* TO 'user'@'%' WITH GRANT OPTION; FLUSH PRIVILEGES;"

echo "MySQL is up and running!"
