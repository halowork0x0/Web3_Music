<script setup>
  import { ref,onMounted } from 'vue';
  import { doGetRequest } from '../util/networkUtil'
  import { useRouter } from 'vue-router';

  const fundAry = ref([])

  onMounted(async() => {
    try {
      let fundlistreq = await doGetRequest("https://continental-jade-wildcat.myfilebase.com/ipfs/QmVsKwaNeHRGjrcAAL9NRDVWfyoadMu2vN5idWX9C3qHxG");
      fundAry.value = fundlistreq;
      console.log("fundlistreq===", fundlistreq);
    } catch(error) {
      console.log("onMounted error==", error)
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
    <div class="fundItem flex_column" v-for="item in fundAry" >
      <img class="fundItemImg" :src="item.image_url" @click="forwardToDetail(item.contract)"></img>
      <div class="fundMsgView flex_spacebetween_center">
        <p>歌曲: {{item.song}}</p>
        <p>歌手: {{item.singer}}</p>
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

.fundItem {
  position: relative;
  margin-bottom: 40px;
  margin-left: 80px;
  width: 522px;
  border-radius: 10px;
  padding: 10px;
  border-width: 1px;
  border-color: lightgray;
  border-style: solid;
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
}

.detailTxt {
  color: #13227a;
  font-weight: bold;
}
</style>