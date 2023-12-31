---
title: nginx使用配置
author: Narule
date: 2018-12-17 18:00:00 +0800
categories: [technology]
tags: [writing, nginx, nginx代理]
---



### 使用案列

使用nginx首先要明确使用场景，这里是一台服务器实现多种类型访问：网站首页访问，GitLab访问，note(私人springboot项目)，静态文件访问。''
<!--more-->
下面是一份配置文件 nginx.conf，这里假设服务起域名是www.test.com(配置文件是从真实主机copy过来的，仅原域名www.xxx.com被改为www.test.com)。它实现了以下功能:

1.http://www.test.com-------------------------------------------> 访问网站首页：html/index.html    实际访问/usr/local/nginx/html/index.html

2.http://www.test.com/note/online---------------------------> 访问springboot项目controller层接口　 note 是一个springboot项目，实际访问 127.0.0.1:11181/online

3.http://www.test.com/stc/jquery.js--------------------------> 访问静态文件　　　　　　　　　　　　 实际访问服务器静态文件夹位置 /usr/local/nginx/html/static/jquery.js

4.http://www.test.com/git--------------------------------------> 访问GitLab首页　　　　　　　　　　　已经安装了GitLab私服，使用的是自己的nginx，没有用gitlab中集成的nginx

### nginx.conf：

```nginx
user root root;   #这里用户是root 可能权限大了点，需要指出：这里配置root还有一个原因是本人安装gitlab时配置文件指定用户为root,避免访问gitlab时可能有权限冲突，将gitlab用户与nginx的配置文件中用户设置为一致。
worker_processes  1;

events {
    accept_mutex on;   #设置网路连接序列化，防止惊群现象发生，默认为on
    multi_accept on;  #设置一个进程是否同时接受多个网络连接，默认为off
    #use epoll;      #事件驱动模型，select|poll|kqueue|epoll|resig|/dev/poll|eventport
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;
    log_format  main  '$time_local |$remote_addr-$remote_user| $http_host | $http_referer | $request | $status |$request_body | $body_bytes_sent|$http_user_agent|$http_x_forwarded_for';
    access_log  logs/test_access.log  main;
        
    sendfile        on;

    #gitlab节点   gitlab项目 真实访问入口
    upstream gitlab-workhorse {
        server unix:/var/opt/gitlab/gitlab-workhorse/socket;
    }
    #note项目 真实访问入口
    upstream  note{
           server 127.0.0.1:11181;
    }
    keepalive_timeout  65;
    #gzip  on;
    #域名配置
    server {
        listen        80;        #监听端口号 80
        server_name  www.test.com;    #服务器域名
        root html;            #根目录
        error_page 404 /404.html;    #错误跳转
        index index.html;        #首页
            #开启代理服务的404页面
            #针对代理服务的404
        proxy_intercept_errors on;
        #charset koi8-r;

         #gitlab   gitlab项目后缀名匹配，直接从gitlab的nginx配置文件中搬过来的
        location ~ (\.git/gitlab-lfs/objects|\.git/info/lfs/objects/batch$) {
            proxy_pass http://gitlab-workhorse;
            proxy_request_buffering off;
          }

        # /gitlab 项目配置路径
        location /git {
            proxy_pass  http://gitlab-workhorse;
          }

        # 静态路径匹配 
        location ^~ /stc {
            alias html/static;
            #//访问http://www.test.com/stc/jquery.js  实际访问的是 html/static/jquery.js 
        }
    
        # note项目
        location /note {
        #一些ip地址头信息预处理
        proxy_set_header Host $http_host;    
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-NginX-Proxy true;
        proxy_pass http://note/;  
        #proxy_pass的note后面添加'/'有截断效果，有'/'：http://www.test.com/note/online-->http://127.0.0.1:11118/online | 没有'/'：http://www.test.com/note/online-->http://127.0.0.1:11181/note/online
        #http://www.test.com/note/online  实际上访问的是  127.0.0.1:11181/online 
        error_page 404 /404.html;
    }

    #防止盗链
    location ~* \.(gif|jpg|png|swf|flv)$ {
        valid_referers  www.test.com;
        if ($invalid_referer) {
        return 404;
        } 
    }


    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   html;
    }
    }

}
```

 这里的nginx安装位置为：/usr/local/nginx/，启动程序nginx也在此处，所以配置文件中 root html； 前面没有'/' 表示相对路径，html 实际位置是 /usr/local/nginx/html

 

### 配置细节

#### 　　location路径匹配规则　 *location [=|~|~\*|^~|@] /uri/ { … }*

　　=：精确匹配，url完全等于 等于号后面的值才会匹配 　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　

　　^～：url以常规字符匹配，如果匹配该选项，不匹配别的选项，本文中有用到来匹配静态文件目录　　　　　　　　　　　　　　　 

　　～：表示正则匹配，区分大小写　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　 

　　*～：表示正则匹配，但是不区分大小写　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　

　　/：通用匹配，任何请求都可以匹配到　　

　　@：定义一个命名的location，用于内部定向，本文中未使用　　　

#### 　　alias 与 root 区别

　　alias 访问路径 截取

　　root 访问路径 拼接  

```nginx
# 静态路径匹配      这里列出访问一个静态文件  alisa 与 root 使用效果区别  
    location ^~ /stc {
        alias html/static;
        #http://www.test.com/stc/jquery.js --> html/static/jquery.js
    }
    location ^~ /stc {
        root html/static;
        #http://www.test.com/stc/jquery.js --> html/static/stc/jquery.js   
    }
```

 

本文不定期更新