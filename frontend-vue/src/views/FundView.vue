<script setup>
  import { ref,onMounted } from 'vue';
  import { doGetRequest } from '../util/networkUtil'
  import { useRouter } from 'vue-router';

  const fundAry = ref([])

  onMounted(async() => {
    try {
      let fundlistreq = await doGetRequest("https://continental-jade-wildcat.myfilebase.com/ipfs/QmYoZG8Wa2DPnZeuKW4SsSSQvE6oV8iXouPHgzfi7CWY4U");
      fundAry.value = fundlistreq;
    } catch(error) {
      console.log("error==", error)
    }
  });

  const router = useRouter();
  function forwardToDetail(fundcontract) {
    router.push({
      name: 'fundDetail',
      params: {contract: fundcontract}
    });
  }
</script>

<template>
  <div class="activityBox flex_row_wrap">
    <div class="fundBox">
      <div class="fundItem flex_column" v-for="item in fundAry" >
        <img class="fundItemImg"  v-lazy="item.image_url" @click="forwardToDetail(item.contract)"></img>
        <div class="fundMsgView flex_spacebetween_center">
          <p>歌曲: {{item.song}}</p>
          <p>歌手: {{item.singer}}</p>
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
}

.fundBox {
  width: 100%;
  display: grid;
  grid-template-columns: 50% 50%;
}

.fundItem {
  margin: 20px auto;
  position: relative;
  width: 522px;
  border-radius: 10px;
  padding: 10px;
  border-width: 1px;
  border-color: lightgray;
  border-style: solid;
}

.fundItem:hover {
  cursor: pointer;
}

.fundMsgView {
  position: absolute;
  bottom: 10px;
  left: 10px;
  width: 500px;
  height: 40px;
  background: rgba(0, 0, 0, 0.6);
  padding: 0 10px;
  color: white;
}

.fundItemImg {
  width: 500px;
  height: 300px;
  background-image: url('../assets/images/bg_fund.jpg');
  background-size: cover;
}

.detailTxt {
  color: #13227a;
  font-weight: bold;
}
</style>