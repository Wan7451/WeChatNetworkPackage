# WeChatNetworkPackage


## 微信小程序网络库的简单封装


微信有封装好的网络请求 wx.request() 方法，但是在项目中实际使用时，需要作大量的重复操作，所以就把相同的操作进行了封装。

封装的主要思想是根据当时的网络框架，通信协议，进行封装的，使用时候需要根据自己的情况进行参考，切勿完整复制。

**仅供参考，小白勿喷**


-------

实现功能

1. 封装请求队列，所以的请求会放在队列中处理
2. 请求失败，会自动重试2次
3. 统一处理Loading效果，失败结果
4. 自动处理session过期问题，自动无感知登陆（-401错误）
5. 借鉴Android MVP思想，封装 presenter,简化 js中的代码


--------

使用

````
参考代码，注释写的很详细
````

--------

喜欢收藏、点赞

简书详细介绍地址，教你一步步搭建

[第一篇 简介](https://www.jianshu.com/p/c12b24fdbad9)

[第二篇 简单搭建](https://www.jianshu.com/p/0bfe513c60da)

[第三篇 处理网络响应](https://www.jianshu.com/p/a4ef65339958)

[第四篇 打印日志](https://www.jianshu.com/p/522536dd6bbc)

[第五篇 加入请求队列](https://www.jianshu.com/p/aff82a61b9fb)

[第六篇 简单使用](https://www.jianshu.com/p/68f1446d37aa)

[第七篇 加上Presenter](https://www.jianshu.com/p/7e6ed4e12f46)


