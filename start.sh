#!/bin/bash



# 构建新镜像,指定镜像名称和标签（可自定义）。 
# .：表示使用当前目录的 Dockerfile。
docker build -t react-router-framework:v1.0.0  -f Dockerfile.npm .

# 停止并删除旧容器
docker stop react-router-framework
docker rm react-router-framework



# 启动新容器
docker run -d --name react-router-framework -p 8080:3000 react-router-framework:v1.0.0 .
# 删除旧镜像
docker rmi react-router-framework:v1.0.0