<script setup>
  import { ref, onUnmounted } from 'vue'
  import { useRoute } from 'vue-router';
  import { inject } from 'vue';
  const route = useRoute();
  const fundId = route.params.id
  const staticFundAry = inject('staticData_fundAry')

  const fundObj = staticFundAry.find(item=>item.id == fundId)
  const fundDetail = ref(fundObj)

  const countdown = ref({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  const endDate = ref(new Date(fundObj.endDate))
  const updateCountdown = () => {
    const now = new Date();
    const diff = endDate.value.getTime() - now.getTime();
 
    if (diff <= 0) {
      clearInterval(intervalId.value); // 如果时间已经结束，停止计时器
      return;
    }
 
    countdown.value.days = Math.floor(diff / (1000 * 60 * 60 * 24));
    countdown.value.hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    countdown.value.minutes = Math.floor((diff / (1000 * 60)) % 60);
    countdown.value.seconds = Math.floor((diff / 1000) % 60);

    console.log('countdowning===')
  };

  const intervalId = ref(setInterval(updateCountdown, 1000));
  onUnmounted(() => {
    clearInterval(intervalId.value); // 组件销毁时清除计时器
  });
  
  function goBackPathFn () {
    window.history.back()
  }

  const dialogShow = ref(false)

  function showFundDialogFn() {
    dialogShow.value = true
  }

  function closeFundDialogFn() {
    dialogShow.value = false
  }

  const fundValue = ref(0)
  const walletTokenFundAry = ref([
    {
      tokenContract: 'aaa',
      tokenName: 'ETH',
      tokenAmount: 1
    },
    {
      tokenContract: 'aaa',
      tokenName: 'USDT',
      tokenAmount: 100
    },
    {
      tokenContract: 'aaa',
      tokenName: 'USDC',
      tokenAmount: 40
    },
  ])
</script>

<template>
  <div class="detailBox">
    <p class="goBackView" @click="goBackPathFn">< Back</p>
    <div class="detailMsgBox">
      <div class="detailImg"></div>
      <div class="detailTxtBox">
        <div class="titleTimeView">
          <p style="font-size: 20px; color: black; font-weight: bold;">Introduce</p>
          <p>活动倒计时:  {{countdown.days}}天-{{countdown.hours}}时:{{countdown.minutes}}分:{{countdown.seconds}}秒</p>
        </div>
        <div class="flex_row_center" style="margin-top: 12px;">
          <p class="txtLeft">歌曲: </p>
          <p class="txtRight">{{fundDetail.song}}</p>
        </div>
        <div class="flex_row_center" style="margin-top: 6px;">
          <p class="txtLeft">歌手: </p>
          <p class="txtRight">{{fundDetail.singer}}</p>
        </div>
        <div class="flex_row_center" style="margin-top: 6px;">
          <p class="txtLeft">创建日期: </p>
          <p class="txtRight">{{fundDetail.createDate}}</p>
        </div>
        <div class="flex_row_center" style="margin-top: 6px;">
          <p class="txtLeft">结束日期: </p>
          <p class="txtRight">{{fundDetail.endDate}}</p>
        </div>
        <div class="flex_row_center" style="margin-top: 6px;">
          <p class="txtLeft">目标筹集: </p>
          <p class="txtRight">{{fundDetail.targetFund}} USD</p>
        </div>
        <div class="flex_row_center" style="margin-top: 6px;">
          <p class="txtLeft">目前筹集: </p>
          <p class="txtRight">{{fundDetail.presentFund}} USD</p>
        </div>
        <div class="flex_row_center" style="margin-top: 6px;">
          <p class="txtLeft">最低捐筹: </p>
          <p class="txtRight">{{fundDetail.minFund}} USD</p>
        </div>
        <button class="fundBtn" @click="showFundDialogFn">
          Fund
        </button>
      </div>
    </div>

    <div class="regularBox">
      <p style="font-size: 20px; color: black; font-weight: bold;">regular</p>
      <p style="margin-top: 12px;">1. 该活动交易为测试展示所用，没有任何经济价值</p>
      <p style="margin-top: 6px;">2. 该活动是为歌手发行新歌宣传筹集的资金，在活动倒计时内可以捐献相应金额的代币</p>
      <p style="margin-top: 6px;">3. 当在活动期间筹集超过所需的金额，用户筹集的总费用可让歌曲筹集发行者领走去制作歌曲，而质押了代币的用户
        可以mint一张筹集NFT, 等待后期该筹集歌曲发行成功后可burn掉筹集NFT获取音乐NFT, 筹集NFT支持发送或交易
      </p>
      <p style="margin-top: 6px;">4. 当在活动结束后, 筹集的总金额不达到预期目标时, 用户可以领取回之前捐献的代币</p>
    </div>
  </div>

  <div class="fundDialogBox" v-if="dialogShow">
    <div class="fundDialog">
      <div class="dialogTitleBox">
        <p style="font-size: 20px; font-weight: bold;">
          Fund
        </p>
        <img class="deleteBtnImg" src="../assets/images/delete.png" @click="closeFundDialogFn()"/>
      </div>

      <div class="selectInputBox">
        <div class="flex_row_center">
          <p style="margin-right:10px;">Token:</p>
          <select class="selectToken">
            <option v-for="item in walletTokenFundAry">
              {{item.tokenName}}
            </option>
          </select>
        </div>
        
        <div class="flex_row_center">
           <p style="margin-right:10px;">Amount:</p>
          <input class="amountInput" placeholder="0" @input="handleSwapAmountInputFn">
          </input>
        </div>
      </div>

      <div style="margin-left: 30px; margin-top:20px;" class="flex_row_center">
        <p>Fund Value:</p>
        <p style="color: red; margin-left: 6px;">{{fundValue}} USD</p>
      </div>

      <div class="comfirmBtn">Confirm</div>
    </div>
  </div>
</template>

<style scoped>
.detailBox {
  display: flex;
  flex-direction: column;
  padding: 40px;
}

.goBackView {
  width: 100px;
  height: 40px;
  font-weight: bold;
  font-size: 16px;
}

.detailMsgBox {
  margin-top: 40px;
  display: flex;
  flex-direction: row;
}

.titleTimeView {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.txtLeft {
  display: block;
  width: 80px;
}

.txtRight {
  display: block;
  width: 200px;
}

.detailImg {
  width: 640px;
  height: 300px;
  background: gray;
}

.detailTxtBox {
  position: relative;
  padding: 10px;
  margin-left: 50px;
  width: 500px;
  height: 300px;
  border-width: 2px;
  border-style: solid;
  border-color: gray;
}

.fundBtn {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 100px;
  height: 40px;
  background: #13227a;
  color: white;
}

.regularBox {
  margin-top: 40px;
  width: 640px;
}

.fundDialogBox {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  background-color: rgba(19, 13, 13, 0.6);
}

.fundDialog {
  position: relative;
  width: 500px;
  height: 240px;
  margin: 140px auto;
  background: white;
  border-radius: 30px;
}

.dialogTitleBox {
  padding: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.deleteBtnImg {
  width: 28px;
  height: 28px;
}

.selectInputBox{
  display: flex;
  width: 500px;
  height: 30px;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
}

.selectToken {
  width: 100px;
  height: 30px;
  border-style: solid;
  border-color: gray;
  border-width: 1px;
}

.amountInput {
  width: 100px;
  height: 30px;
}

.comfirmBtn {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 80px;
  height: 40px;
  line-height: 40px;
  background: #13227a;
  color: white;
  text-align: center;
}
</style>