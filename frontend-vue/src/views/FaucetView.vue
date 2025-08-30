<script setup>
let hadRequest = false
function requestTestToken() {
  this.hadRequest = true;
  console.log('hadRequest====', this.hadRequest)
}
</script>

<template>
  <div class="faucetBox">
    <p style="font-size: 24px; font-weight: bold;">Faucet for WMC test token</p>
    
    <p style="display: block;">you can claim 500 WMC again every 24 hours</p>

    <div class="inputBox">
      <input class="addressInput" placeholder="request evm address"></input>
      <div class="testTokenView">
        <img class="tokenIcon"></img>
        <p class="tokenTxt">WMC</p>
      </div>
    </div>

    <button class="requestBtn" v-if="hadRequest==false" @click="requestTestToken()">
      Claim
    </button>

    <button class="windowBtn" v-if="hadRequest==true">
      you can request after 16:20:11
    </button>
    
  </div>
</template>

<style scoped>
.faucetBox {
  display: flex;
  flex-direction: column;
  width: 600px;
  height: 400px;
  background:rgb(207, 197, 197);
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
  background: gray;
}

.tokenIcon {
  width: 30px;
  height: 30px;
  border-radius: 30px;
}

.tokenTxt {
  margin-left: 10px;
  font-size: 14px;
  color: white;
  font-weight: bold;
}

.requestBtn {
  margin: 30px auto;
  width: 160px;
  height: 50px;
  border-radius: 30px;
  background: orange;
}

.windowBtn {
  margin: 30px auto;
  width: 240px;
  height: 50px;
  border-radius: 30px;
  background: rgb(237, 196, 120);
}
</style>