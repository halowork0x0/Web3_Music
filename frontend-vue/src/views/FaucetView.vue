<script setup>
import { ref } from 'vue';

const hadRequest = ref(false)
function requestTestToken() {
  hadRequest.value = true
}
</script>

<template>
  <div class="faucetBox">
    <p style="font-size: 24px; font-weight: bold;">Faucet for WMC test token</p>
    
    <p style="display: block;">you can claim 500 WMC again every 24 hours</p>

    <div class="inputBox">
      <input class="addressInput" placeholder="enter address"></input>
      <div class="testTokenView">
        <img class="tokenIcon" src="../assets/images/icon_blue.png"></img>
        <p class="tokenTxt">WMC</p>
      </div>
    </div>

    <div class="requestBtn" v-if="hadRequest==false" @click="requestTestToken()">
      Claim
    </div>

    <div class="windowBtn" v-if="hadRequest==true">
      you can request after 16:20:11
    </div>
    
  </div>
</template>

<style scoped>
.faucetBox {
  display: flex;
  flex-direction: column;
  width: 600px;
  height: 400px;
  background: #f2f2f2;
  border-radius: 12px;
  margin: 50px auto;
  padding: 20px;
}

.inputBox {
  display: flex;
  align-items: center;
  margin-top: 40px;
  padding: 20px;
  width: 560px;
  height: 160px;
  background: white;
  border-radius: 12px;
}

.addressInput {
  padding-left: 10px;
  width: 400px;
  height: 50px;
}

.testTokenView {
  margin-left: 20px;
  padding: 8px;
  display: flex;
  align-items: center;
  width: 100px;
  height: 50px;
  background: #f2f2f2;
}

.tokenIcon {
  width: 30px;
  height: 30px;
  border-radius: 30px;
}

.tokenTxt {
  margin-left: 10px;
  font-size: 14px;
  color: gray;
  font-weight: bold;
}

.requestBtn {
  margin: 30px auto;
  width: 160px;
  height: 50px;
  line-height: 50px;
  color: white;
  text-align: center;
  border-radius: 30px;
  background: #13227a;
}

.windowBtn {
  margin: 30px auto;
  width: 240px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  border-radius: 30px;
  color: white;
  background: rgb(113, 134, 228);
}
</style>