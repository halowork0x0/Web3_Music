<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
    <div class="header"> 
      <p class="txstyle">Web3 Music</p>
      <div>
        <RouterLink class="rlinkNormal" to="/dex">DEX</RouterLink>
        <router-link class="rlinkNormal" to="/bridge">Bridge</router-link>
        <router-link class="rlinkNormal" to="/activity">Activity</router-link>
        <router-link class="rlinkNormal" to="/faucet">Faucet</router-link>
      </div>
      <button class="connectBtn" @click="doConnectFn">connect</button>
    </div>
</template>

<style scoped>
.header{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  width: 100%;
  height: 100px;
  background: orange;
}

.txstyle{
  font-size: 20px;
  color: white;
  font-style: normal;
}

.connectBtn {
  height: 40px;
  border-radius: 10px;
}

.rlinkNormal {
  font-size: 20px;
  color: black;
  margin-left: 20px;
}
</style>