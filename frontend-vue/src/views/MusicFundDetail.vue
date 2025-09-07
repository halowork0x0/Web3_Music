<script setup>
  function goBackPathFn () {
    window.history.back()
  }
</script>

<template>
  <div class="detailBox">
    <p class="goBackView" @click="goBackPathFn">< Back</p>
    <div class="detailMsgBox">
      <div class="detailImg"></div>
      <div class="detailTxtBox">
        <div class="titleTimeView">
          <p style="font-size: 20px; color: black; font-weight: bold;">Introduce</p>
          <p>倒计时:  16D-14H-26M</p>
        </div>
        <p style="margin-top: 20px;">Song: 千里之外</p>
        <p>Singer: 周杰伦</p>
        <p>Fundme Create: 2025-11-10</p>
        <p>Fundme End: 2025-12-10</p>
        <p>plan fund: 5000 usd</p>
        <p>now fund: 2000 usd</p>

        <button class="fundBtn">
          Fund
        </button>
      </div>
    </div>

    <div class="regularBox">
      <p style="font-size: 20px; color: black; font-weight: bold;">regular</p>
      <p style="margin-top: 12px;">1. 该活动交易为测试展示所用，没有任何经济价值</p>
      <p style="margin-top: 6px;">2. 该活动是为歌手发行新歌宣传筹集的资金，在活动倒计时内可以质押相应金额的代币</p>
      <p style="margin-top: 6px;">3. 当在活动期间筹集超过所需的金额，用户筹集的总费用可让歌曲筹集发行者领走去制作歌曲，而质押了代币的用户
        可以mint一张歌曲NFT, 等待后期该筹集歌曲发行成功后可burn掉获取web3歌曲, NFT支持发送或交易
      </p>
      <p style="margin-top: 6px;">4. 当在活动结束后, 筹集的总金额不达到预期目标时, 用户可以领取回之前质押的代币</p>
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
  bottom: 20px;
  right: 20px;
  width: 100px;
  height: 40px;
  background: #13227a;
  color: white;
}

.regularBox {
  margin-top: 40px;
  width: 640px;
  height: 600px;
}
</style>