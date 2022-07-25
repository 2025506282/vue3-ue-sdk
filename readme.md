<!--
 * @Author: sunji 2025506282@qq.com
 * @Date: 2022-06-17 16:32:42
 * @LastEditors: sunji 2025506282@qq.com
 * @LastEditTime: 2022-07-25 15:31:06
 * @FilePath: \vue-ue-sdk\readme.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
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

## UE 提供接口

###  查看风险一张图
```
api_send("changeRiskChart", {}, ()=> {
  // to do
})
```
### 查看监控一张图
```
api_send("changeMonitorChart", {}, ()=> {
  // to do
})
```
### 前往水灾详情
```
api_send('goToWaterDetail', { }, ()=> {
  // to do
})
```
### 前往火灾详情
```
api_send('goToFireDetail', { }, ()=> {
  // to do
})
```

### 打开火灾与关闭火灾
```
api_send('switchFire', { isOpen: false }, ()=> {
  // to do
})
isOpen是布尔值，true是打开，false是关闭
```
### 打开水灾与关闭水灾
```
api_send('switchWater', { isOpen: false }, ()=> {
  // to do
})
isOpen是布尔值，true是打开，false是关闭

```

### 前往场景并切换火灾火水灾详情
```
api_send('change3DScene', { id: 6 }, ()=> {
  // to do
})
id: 6 水灾详情
id: 0 火灾详情
```
### 监听UE点击火灾详情还是水灾详情

```
api_register('Enter3DSecene',  (res)=> {
  if(res.type === 'fire') {
    //
  }
  if(res.type === 'water') {
    //
  }
})
```
