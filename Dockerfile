# 使用Nginx作为静态文件服务器
FROM nginx:alpine

# 复制项目文件到Nginx默认目录
COPY . /usr/share/nginx/html/

# 暴露端口
EXPOSE 80

# 启动Nginx
CMD ["nginx", "-g", "daemon off;"]