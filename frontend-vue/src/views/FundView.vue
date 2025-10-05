<script setup>
  import { ref,onMounted } from 'vue';
  import { customFundAry } from '../customdata/localdata'
  const fundAry = ref(customFundAry)
</script>

<template>
  <div class="activityBox">
    <div class="flex_row_wrap">
      <div class="fundItem" v-for="item in fundAry">
        <div class="flex_spacebetween_center">
          <p>Song: {{item.song}}</p>
          <p>Singer: {{item.singer}}</p>
        </div>
        <img class="fundItemImg"></img>
        <div class="fundItemBottom">
          <!-- <p>completed: {{(item.nowFund/item.targetFund * 100).toFixed(2)}}%</p> -->
          <p class="detailTxt" @click="forwardToDetail(item)">Detail ></p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.activityBox {
  width: 100%;
  height: 100%;
  padding: 40px;
  display: flex;
  flex-direction: column;
}

.fundItem {
  position: relative;
  margin-bottom: 20px;
  margin-right: 40px;
  width: 580px;
  height: 310px;
  border-radius: 20px;
  padding: 20px;
  border-width: 4px;
  border-color: gray;
  border-style: solid;
}

.fundItemImg {
  margin-top: 20px;
  width: 540px;
  height: 180px;
}

.fundItemBottom {
  width: 540px;
  height: 40px;
  position: absolute;
  bottom: 10px;
  display: flex;
  flex-direction: row;
  justify-content: end;
  align-items: center;
}

.detailTxt {
  color: #13227a;
  font-weight: bold;
}
</style>