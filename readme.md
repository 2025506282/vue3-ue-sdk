<!--
 * @Author: sunji 2025506282@qq.com
 * @Date: 2022-06-17 16:32:42
 * @LastEditors: sunji 2025506282@qq.com
 * @LastEditTime: 2022-08-09 10:36:51
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
import { app_load, api_register, api_send, SCENE_TYPE, METHOD_TYPE } from "vue-ue-sdk";
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
### 地图标记类交互接口
```
api_send('markSymbol', { type:  'gas'}, ()=> {
  // to do
})
type: default // 默认展示全部
type: gas // 燃气
type: heat // 热力
type: bridge // 桥梁
type: pipe // 综合管廊
type: waterSupply // 供水
type: drain // 排水
type: subwayTunnel // 地铁隧道
type: elevator // 电梯
type: fireControl // 消防
```

### 前往场景例如切换火灾火水灾详情
```
api_send('change3DScene', { type: SCENE_TYPE.WATER }, ()=> {
  // to do
})
type: SCENE_TYPE.WATER 水灾详情 
type: SCENE_TYPE.FIRE 火灾详情
type: SCENE_TYPE.TECHNOLOGY 科技风场景
```

### 关闭科技风侧边栏UI
```
api_send('closeMenuUI')
```

### 监听UE切换场景

```
api_register('Enter3DSecene',  (res)=> {
// 监听用户点击切换火灾详情
  if(res.type === 'fire') {
    //
  }
  // 监听用户点击切换水灾详情
  if(res.type === 'water') {
    //
  }
  // 监听切换到科技风场景
  if(res.type === 'technology') {
    //
  }
  // 监听切换到科技风火灾场景详情
  if(res.type === 'technologyDetailFire') {
    //
  }
  // 监听切换到科技风场景水灾详情
  if(res.type === 'technologyDetailWater') {
    //
  }
})
```



## 枚举类型
```
export const METHOD_TYPE = {
    // 发送消息
    CHANE_RISK_CHART: 'changeRiskChart',// 查看风险一张图
    CHANE_MONITOR_CHART: 'changeMonitorChart',// 查看监控一张图
    GO_TO_WATER_DETAIL: 'goToWaterDetail',// 前往水灾详情
    GO_TO_FIRE_DETAIL: 'goToFireDetail',// 前往火灾详情
    SWITCH_FIRE: 'switchFire',// 打开火灾与关闭火灾
    SWITCH_WATER: 'switchWater',// 打开水灾与关闭水灾
    CHANGE_3D_SCENE: 'change3DScene',// 前往场景并切换火灾火水灾详情
    MARK_SYMBOL: 'markSymbol',//  标记

    // 监听UE点击火灾详情还是水灾详情还是科技风场景
    ON_ENTER_3D_SCENE: 'Enter3DSecene', // 监听UE点击火灾详情还是水灾详情
}
```

```
// 场景type，监听UE点击的事件
export const SCENE_TYPE = {
    FIRE: 'fire',// 火灾详情
    WATER: 'water', // 水灾详情
    TECHNOLOGY: 'technology', // 切换到科技风场景
    TECHNOLOGY_DETAIL: 'technologyDetail', // 切换到科技风场景详情
    TECHNOLOGY_DETAIL_FIRE: 'technologyDetailFire', // 切换到科技风场景火灾详情
    TECHNOLOGY_DETAIL_WATER: 'technologyDetailWater', // 切换到科技风场景水灾详情
}
```


```
// 标记类型
export const MARK_TYPE = {
    DEFAULT: 'default', // 默认展示全部
    GAS: 'gas', // 燃气
    HEAT: 'heat', // 热力
    BRIDGE: 'bridge', // 桥梁
    PIPE: 'pipe', // 综合管廊
    WATER_SUPPLY: 'waterSupply', // 供水
    DRAIN: 'drain', // 排水
    SUBWAY_TUNNEL: 'subwayTunnel', // 地铁隧道
    ELEVATOR: 'elevator', // 电梯
    FIRE_CONTROL: 'fireControl', //  消防
}
```