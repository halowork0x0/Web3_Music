<script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  import { ethers } from 'ethers'
  import { doGetRequest } from '../util/networkUtil'
  import { fundContractAbi } from '../contractABI/myFundAbi';

  const myFundAry = ref([])
  const isloading = ref(true)

  onMounted(async()=>{
    let fundlisReq = await doGetRequest("https://continental-jade-wildcat.myfilebase.com/ipfs/QmVsKwaNeHRGjrcAAL9NRDVWfyoadMu2vN5idWX9C3qHxG");
    console.log('fundlistreq===', fundlisReq)
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const address = await signer.getAddress()
    let fundAry = []
    for(let index = 0; index < fundlisReq.length; index++) {
      let mycontract =  new ethers.Contract(fundlisReq[index].contract, fundContractAbi, provider);
      let fundEthValue = (await mycontract.musicFund(address)).toString()/10 ** 18;
     
      if (fundEthValue>0) {
        let deployTimestamp = await mycontract.deployTimeStamp();
        let windowTimestamp = await mycontract.windowTimeStamp();
        let status = getFundActivityStatus(deployTimestamp + windowTimestamp);

        let myfundItem = {
          fundContract: fundlisReq[index].contract,
          singer: fundlisReq[index].singer,
          song: fundlisReq[index].song,
          fundEthValue: fundEthValue,
          fundActivityStatus: status
        }

        fundAry.push(myfundItem);
        console.log('myfundItem=====', myfundItem)
      }
    }
    myFundAry.value = fundAry;
    isloading.value = false
  })

  function getFundActivityStatus(endDateTimestamp) {
    let presentTimes = new Date().getTime();
    let endDateTimes = (endDateTimestamp.toString()) * 1000;

    if (presentTimes <= endDateTimes) {
      return 1;
    }else {
      return 2;
    }
  }

</script>

<template>
  <div class="activityBox flex_row_wrap">
    <div class="fundItem flex_column" v-for="item in myFundAry" v-if="isloading==false">
      <div class="flex_row_center">
        <p class="txtLeft">合约: </p>
        <p class="txtRight">{{item.fundContract}}</p>
      </div>

      <div class="flex_row_center" style="margin-top: 6px;">
        <p class="txtLeft">歌曲: </p>
        <p class="txtRight">{{item.song}}</p>
      </div>

      <div class="flex_row_center" style="margin-top: 6px;">
        <p class="txtLeft">歌手: </p>
        <p class="txtRight">{{item.singer}}</p>
      </div>

      <div class="flex_row_center" style="margin-top: 6px;">
        <p class="txtLeft">活动状态: </p>
        <p class="txtRight">{{item.fundActivityStatus==1?'进行中':'已结束'}}</p>
      </div>

      <div class="flex_row_center" style="margin-top: 6px;">
        <p class="txtLeft">我的筹款: </p>
        <p class="txtRight">{{item.fundEthValue}} ETH</p>
      </div>
    </div>
    <p v-if="isloading==false&&myFundAry.length==0" style="margin: 0 auto;">暂无发现你的捐筹</p>
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
  width: 522px;
  border-radius: 10px;
  padding: 20px;
  border-width: 1px;
  border-color: lightgray;
  border-style: solid;
}

.txtLeft {
  display: block;
  width: 80px;
}

.txtRight {
  display: block;
  width: 200px;
}
</style>