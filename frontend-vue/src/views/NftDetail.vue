<script setup>
  function goBackPathFn () {
    window.history.back()
  }
</script>

<template>
  <div class="detailBox">
    <p class="goBackView" @click="goBackPathFn">< Back</p>
    <div class="detailMsgBox">
      <div class="nftImg"></div>
      <div class="nftMsgBox">
        <p style="font-size: 20px; color: black; font-weight: bold;">NFT Message</p>
        <p style="margin-top: 20px;">Song: 千里之外</p>
        <p>Singer: 周杰伦</p>
        <p>Total amount: 100000</p>
        <p>Minted amount: 20000</p>
        <p>Remain amount: 80000</p>
        <p>Price: 20 usd</p>

        <button class="mintBtn">
          Mint
        </button>
      </div>
    </div>

    <div class="regularBox">
      <p style="font-size: 20px; color: black; font-weight: bold;">regular</p>
      <p style="margin-top: 12px;">1. 该活动交易为测试展示所用，没有任何经济价值</p>
      <p style="margin-top: 6px;">2. 该NFT可burn掉获取web3歌曲, NFT支持发送或交易
      </p>
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

.nftImg {
  margin-left: 100px;
  width: 300px;
  height: 300px;
  border-radius: 300px;
  background: gray;
}

.nftMsgBox {
  position: relative;
  padding: 10px;
  margin-left: 160px;
  width: 500px;
  height: 300px;
  border-width: 2px;
  border-style: solid;
  border-color: gray;
}

.mintBtn {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 100px;
  height: 40px;
  background: orange;
}

.regularBox {
  margin-top: 40px;
  width: 640px;
  height: 600px;
}
</style>