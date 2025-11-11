<script setup>
import { ref } from 'vue';
import img_warning from "@/assets/images/warning.png"
import img_success from "@/assets/images/success.png"
import img_loading from "@/assets/images/loading.png"

  defineExpose({
    showSuccessTip,
    showWarningTip,
    showLoadingTipConstantly,
    closeTipView
  })

  const tiptext = ref('')
  const imagePath = ref('')
  const isShow = ref('')

  function showSuccessTip(txt) {
    imagePath.value = img_success;
    tiptext.value = txt;
    isShow.value = true;
    setTimeout(() => {
      isShow.value = false;
    }, 2000);
  }

  function showWarningTip(txt) {
    imagePath.value = img_warning;
    tiptext.value = txt;
    isShow.value = true;
    setTimeout(() => {
      isShow.value = false;
    }, 2000);
  }

  function showLoadingTipConstantly(txt) {
    imagePath.value = img_loading;
    tiptext.value = txt;
    isShow.value = true;
  }

  function closeTipView() {
    isShow.value = false;
  }

</script>

<template>
  <div class="tipViewBox flex_column_center" v-if="isShow">
    <img class="tip_img" :src="imagePath"></img>
    <p class="tip_txt">{{tiptext}}</p>
  </div>
</template>

<style scoped>
.tipViewBox {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  padding: 30px 20px;
  border-radius: 8px;
  border-style: solid;
  border-color: #f2f2f2;
  border-width: 2px;
  background: rgba(0, 0, 0, 0.8);
  z-index: 10000;
}

.tip_img {
  width: 60px;
  height: 60px;
}

.tip_txt {
  margin-top: 10px;
  display: inline-block;
  width: 160px;
  font-size: 14px;
  color: white;
  overflow: hidden;
  word-wrap: break-word;
  text-align: center;
}
</style>