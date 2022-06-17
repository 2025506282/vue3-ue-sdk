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
main.js
```
import { createApp } from 'vue'
import App from './App.vue'
import vueUeSdk from 'vue-ue-sdk';
const app=createApp(App)
app.use(vueUeSdk)
app.mount('#app')
```
App.vue
```
<template>
  <UEPlayer />
</template>
<script>
import { app_load, api_register, api_send } from "vue-ue-sdk";
export default {
  name: "EditView",
  mounted() {
    const url = "127.0.0.1:777"; // UE的服务器地址
    app_load(url, () => {
        console.log('画面出现后回调，可进行一些初始操作');
        // 监听UE发送过来的消息
        api_register("onUE4Call", (info) => {
          console.log(info);
        });
        // 发送消息给UE
        api_send("changeWeather", { stauts: 'windy' }, (res)=>{
            console.log(res);
        });
    });
  },
  methods: {},
};
</script>
```

## 想了解更多请与UE通信查看API文档

[API文档](https://www.digitaltwinworld.cn/doc?type=sdk)