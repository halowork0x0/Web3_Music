<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useWeb3 } from '../composables/useWeb3.js'
import { setTabarIndex,getTabarIndex } from '../sessiondata/accountdata.js'
const SWAP_SELECTED = 1;
const BRIDGE_SELECTED = 2;
const ACTIVITY_SELECTED = 3;
const FAUCET_SELECTED = 4;

console.log('getTabarIndex====', getTabarIndex())
const select_type = ref(getTabarIndex());

function clickRouterLinkFn(selected) {
  select_type.value = selected
  setTabarIndex(selected)
}

const showWalletOperate = ref(false)
function doclickWalletConnectedBtnFn() {
  showWalletOperate.value = !showWalletOperate.value
}

const {
  account,
  chainId,
  isConnected,
  isConnecting,
  connectWallet,
  disconnect
} = useWeb3()

console.log('account===',account)
console.log('chainId===',chainId)
console.log('isConnected===',isConnected)
console.log('isConnecting===',isConnecting)

</script>

<template>
    <div class="header">
      <div class="hearderLeftBox">
        <img src="../assets/images/icon_white.png" class="projectIconImg"/>
        <p class="txstyle">W3 Music</p>
      </div>
      
      <div class="routerlinkBox">
        <RouterLink 
        :class="['rlinkNormal', select_type==SWAP_SELECTED?'selectTagStyle':'unSelectTagStyle']" to="/swap" @click="clickRouterLinkFn(SWAP_SELECTED)">Swap</RouterLink>
        <router-link 
        :class="['rlinkNormal', select_type==BRIDGE_SELECTED?'selectTagStyle':'unSelectTagStyle']" to="/bridge" @click="clickRouterLinkFn(BRIDGE_SELECTED)">Bridge</router-link>
        <router-link 
        :class="['rlinkNormal', select_type==ACTIVITY_SELECTED?'selectTagStyle':'unSelectTagStyle']" to="/activity" @click="clickRouterLinkFn(ACTIVITY_SELECTED)">Activity</router-link>
        <router-link 
        :class="['rlinkNormal', select_type==FAUCET_SELECTED?'selectTagStyle':'unSelectTagStyle']" to="/faucet" @click="clickRouterLinkFn(FAUCET_SELECTED)">Faucet</router-link>
      </div>

      <button class="connectBtn" v-if="isConnected" @click="doclickWalletConnectedBtnFn">{{ account.slice(0, 4) }}...{{ account.slice(-4) }}</button>
      <button class="connectBtn" v-else @click="connectWallet">{{!isConnecting?'连接钱包':'连接中...'}}</button>

      <div class="walletOperateBox" v-if="isConnected && showWalletOperate">
        <div class="operateView" @click="disconnect">
          disconnet
        </div>
        <div class="operateView">
          profile
        </div>
      </div>
    </div>
</template>

<style scoped>
.header{
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  width: 100%;
  height: 100px;
  background: #13227a;
}

.hearderLeftBox {
  margin-left: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100px;
}

.projectIconImg {
  width: 60px;
  height: 60px;
}

.txstyle{
  margin-left: 10px;
  font-size: 20px;
  color: gray;
  font-weight: bold;  
}

.connectBtn {
  padding: 0 10px;
  height: 40px;
  border-radius: 10px;
}

.routerlinkBox {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.rlinkNormal {
  margin-left: 20px;
  display: block;
  height: 100px;
  line-height: 100px;
  font-size: 20px;
}

.selectTagStyle {
  border-bottom-style: solid;
  border-bottom-color: orange;
  border-bottom-width: 4px;
  color: white;
}

.unSelectTagStyle {
  border-bottom-width: 4px;
  color: rgb(167, 157, 157);
}

.walletOperateBox {
  position: absolute;
  right: 0px;
  top: 80px;
  width: 160px;
  height: 120px;
  background: #f2f2f2;
}

.operateView {
  width: 160px;
  height: 60px;
  line-height: 60px;
  border-top-style: solid;
  border-top-color: gray;
  color: black;
  text-align: center;
}
</style>