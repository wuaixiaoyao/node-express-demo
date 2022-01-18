# web端Docker部署
# 在Docker项目根目录下运行
# 镜像需要定期备份和清理（一个镜像1.5GB左右，发布过于频繁会导致硬盘空间不足）

env="dev"
# step1 获取当前版本号
image_name="evolut-admin-web-$env"
read image_old_version < <(sudo docker images|awk -v image_name=$image_name '{if($1==image_name||$1==image_name) print $2|"sort -r -n"}')
image_new_version=$[1+image_old_version]
echo "old images: $image_name:$image_old_version"

# step2 构建新镜像
echo "new images: $image_name:$image_new_version"
echo "build start, please wait..."
docker build -f ./_deploy/Dockerfile-$env -t $image_name:$image_new_version .
docker images
echo "build done!"

# step3 销毁容器
container_name="$image_name-run"
echo "remove old container: $container_name"
(docker stop $container_name && docker rm $container_name ) || docker rm $container_name

# step4 运行新容器
echo "deploy new container: $image_name:$image_new_version"
docker run -d -p 3011:3000 --name $container_name $image_name:$image_new_version
docker ps
echo "all done!"