#!/bin/bash

# 默认配置
IMAGE_NAME="react-router-framework"
DEFAULT_TAG="v1.0.0"
DOCKERFILE="Dockerfile.npm"
PORT_HOST=8080
PORT_CONTAINER=3000

# 解析参数
while [[ $# -gt 0 ]]; do
  case $1 in
    -f|--file)
      DOCKERFILE="Dockerfile.$2"
      shift 2
      ;;
    -t|--tag)
      TAG="$2"
      shift 2
      ;;
    *)
      echo "错误: 未知参数 $1"
      exit 1
      ;;
  esac
done

# 若未指定 TAG，使用默认值
TAG=${TAG:-$DEFAULT_TAG}

# 执行清理和构建
docker stop ${IMAGE_NAME} 2>/dev/null || true
docker rm ${IMAGE_NAME} 2>/dev/null || true
OLD_IMAGE=$(docker images -q "${IMAGE_NAME}:${TAG}" 2>/dev/null)

docker build -t ${IMAGE_NAME}:${TAG} -f ${DOCKERFILE} .

docker run -d \
  --name ${IMAGE_NAME} \
  -p ${PORT_HOST}:${PORT_CONTAINER} \
  ${IMAGE_NAME}:${TAG}

echo "部署完成！镜像: ${IMAGE_NAME}:${TAG}"
