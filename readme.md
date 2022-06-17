# 安装
## 使用 npm 或 yarn 安装
```
$ npm install vue-ue-sdk --save
```
```
$ yarn add vue-ue-sdk --save
```
如果你的网络环境不佳，推荐使用 [cnpm](https://github.com/cnpm/cnpm)。

# 使用方法
```
import { app_load，api_register, api_send } from "vue-ue-sdk";
const url = "127.0.0.1:777"; // UE的服务器地址
app_load(url, () => {
    console.log('画面出现之前的回调，可进行一些初始操作');
    // 监听UE发送过来的消息
    api_register("onUE4Call", (info) => {
      console.log(info);
    });
    api_send("changeWeather", { stauts: 'windy' }, (res)=>{
        console.log(res);
    });
});
```