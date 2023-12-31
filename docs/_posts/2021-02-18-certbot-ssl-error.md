---
title: certbot 获取数字证书失效问题
author: Narule
date: 2021-02-18 10:45:00 +0800
categories: [technology]
tags: [writing, docker, certbot, ssl]
---



# certbot 获取数字证书失效问题

## 数字证书

> 数字证书就是一个网站域名在通信时使用了安全加密的证明

数字证书为网站数据交互提供加密，用于保障通信保密安全，数字证书不是随意创建的，一般需要比较有公信力的组织或团队提供数字证书才会被认可。 
个人创建一个证书，即使技术厉害别人也要花较多时间成本去了解一个团队，类似谷歌微软BAT确认可靠的数字证书，还是会有比较多的人容易信任认可的。


## certbot

<!--more-->

[certbot](https://certbot.eff.org/)是一个网站https免费证书工具，可以申请获取自己域名的证书，保证客户端与网站的通信安全

### certbot 获取数字证书失效

certbot --nginx 获取证书失败

```bash
[root@ip-172-31-36-22 ~]# certbot --nginx
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Plugins selected: Authenticator nginx, Installer nginx

Which names would you like to activate HTTPS for?
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
2: narule.net
3: www.narule.net
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Select the appropriate numbers separated by commas and/or spaces, or leave input
blank to select all options shown (Enter 'c' to cancel): 2
Requesting a certificate for narule.net
Performing the following challenges:
http-01 challenge for narule.net
Waiting for verification...
Challenge failed for domain narule.net
http-01 challenge for narule.net
Cleaning up challenges
Some challenges have failed.

IMPORTANT NOTES:
 - The following errors were reported by the server:

   Domain: narule.net
   Type:   connection
   Detail: Fetching
   http://narule.net/.well-known/acme-challenge/ghMvWhw-3tOEmI7d5zNZGuQ:
   Connection refused

   To fix these errors, please make sure that your domain name was
   entered correctly and the DNS A/AAAA record(s) for that domain
   contain(s) the right IP address. Additionally, please check that
   your computer has a publicly routable IP address and that no
   firewalls are preventing the server from communicating with the
   client. If you're using the webroot plugin, you should also verify
   that you are serving files from the webroot path you provided.
```



这个问题很棘手，一开始还以为是nginx需要关闭，以前数字证书自动续签没有成功是因为nginx没有关闭，关闭就能成功，但是这次怎么都不行，最后通过日志发现，80端口从外网根本不能进去，只能内网访问，是80端口出了问题。



### 原因

最后思考，近期学习使用docker容器的时候，停止过nginx，使用docker占用了nginx的80端口。虽然docker我已经没运行了，80端口也被闲置，但是linux-centos7的环境没什么变化，推测很有可能与安装了docker有关，也许是安装docker占用了什么资源



## 解决方法

### 卸载docker



```bash
sudo yum remove docker-ce docker-ce-cli containerd.io

sudo rm -rf /var/lib/docker
```





### certbot --nginx

按照上面两步卸载完docker后，在尝试运行`certbot --nginx` 获取数字证书成功！



```bash
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Congratulations! You have successfully enabled https://narule.net
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

IMPORTANT NOTES:
 - Congratulations! Your certificate and chain have been saved at:
   /etc/letsencrypt/live/narule.net/fullchain.pem
   Your key file has been saved at:
   /etc/letsencrypt/live/narule.net/privkey.pem
   Your certificate will expire on 2021-05-19. To obtain a new or
   tweaked version of this certificate in the future, simply run
   certbot again with the "certonly" option. To non-interactively
   renew *all* of your certificates, run "certbot renew"
 - If you like Certbot, please consider supporting our work by:

   Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
   Donating to EFF:                    https://eff.org/donate-le

```

