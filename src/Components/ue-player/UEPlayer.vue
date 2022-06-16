<template>
  <div id="player">
    <div id="videoPlayOverlay"></div>
    <video id="streamingVideo" playsinline style="width: 100%; height: 100%"/>
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
#player {
  width: 100%;
  height: 100%;
  background-color: black;
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
}
#videoPlayOverlay {
  width: 100%;
  height: 100%;
  /* background-color: rgba(100, 100, 100, 0.7); */
  position: absolute;
  left: 0;
  top: 0;
}
</style>