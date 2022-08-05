/*
 * @Author: sunji 2025506282@qq.com
 * @Date: 2022-08-03 13:21:07
 * @LastEditors: sunji 2025506282@qq.com
 * @LastEditTime: 2022-08-05 16:10:48
 * @FilePath: \vue-ue-sdk\src\Components\ue-player\const\type.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 方法类型
export const METHOD_TYPE = {
    // 发送消息
    CHANE_RISK_CHART: 'changeRiskChart',// 查看风险一张图
    CHANE_MONITOR_CHART: 'changeMonitorChart',// 查看监控一张图
    GO_TO_WATER_DETAIL: 'goToWaterDetail',// 前往水灾详情
    GO_TO_FIRE_DETAIL: 'goToFireDetail',// 前往火灾详情
    SWITCH_FIRE: 'switchFire',// 打开火灾与关闭火灾
    SWITCH_WATER: 'switchWater',// 打开水灾与关闭水灾
    CHANGE_3D_SCENE: 'change3DScene',// 前往场景并切换火灾火水灾详情

    // 监听UE点击火灾详情还是水灾详情
    ENTER_3D_SCENE: 'Enter3DSecene', // 监听UE点击火灾详情还是水灾详情
}

// 场景id
export const SCENE_ID = {
    WATER: 'fire', // 水灾详情
    FIRE: 'water',// 火灾详情
}
// 场景type
export const SCENE_TYPE = {
    FIRE: 'fire',// 火灾详情
    WATER: 'water'// 水灾详情
}