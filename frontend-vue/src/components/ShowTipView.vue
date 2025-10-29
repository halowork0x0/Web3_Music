<script setup>
import { ref, toRefs, watch } from 'vue';
import img_warning from "@/assets/images/warning.png"
import img_success from "@/assets/images/success.png"
import img_loading from "@/assets/images/loading.png"

import { tiptype_success,tiptype_warning,tiptype_loading } from '../customdata/localdata'

  const props = defineProps({
    tiptype: {
      type: String,
      default: "0"
    },
    tiptext: {
      type: String,
      default: 'halohalo'
    },
    isShow: {
      type: Boolean,
      default: false
    }
  })
  const imagePath = ref('')

  const {tiptype} = toRefs(props)

  watch(tiptype, (newValue, oldValue)=> {
    if (newValue == tiptype_success) {
    imagePath.value = img_success
  } else if(newValue == tiptype_warning){
    imagePath.value = img_warning
  } else if(newValue == tiptype_loading){
    imagePath.value = img_loading
  }
  })

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