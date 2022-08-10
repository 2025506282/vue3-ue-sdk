<!--
 * @Author: sunji 2025506282@qq.com
 * @Date: 2022-07-27 16:08:05
 * @LastEditors: sunji 2025506282@qq.com
 * @LastEditTime: 2022-08-10 14:50:23
 * @FilePath: \vue-ue-sdk\src\Components\ue-player\UEPlayer.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div id="playerUI">
    <div id="player"></div>
    <video
      id="streamingVideo"
      playsinline
      style="width: 100%; height: 100%; position: absolute; object-fit: fill"
    />
  </div>
</template>
<script setup>
// import { ref, watch, onMounted, nextTick, defineEmit, defineProps } from "vue";
</script>
<!-- <script>
export default {
  name: "UEPlayer",
  methods: {
    xxx(){
      //console.log('123');
    }
  },
};
</script> -->

<style scoped>
#playerUI {
  width: 100%;
  height: 100%;
  position: absolute;
  /*top: 0;
	left: 0;*/
  z-index: 10;
}

#player {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #000;
}

/* State to hide overlay, WebRTC communication is in progress and or is playing */
.hiddenState {
  display: none;
}
</style>
