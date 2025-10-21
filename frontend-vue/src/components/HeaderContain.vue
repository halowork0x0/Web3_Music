<script setup>
import { ref,onMounted } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { checkConnection, connectWallet } from '../composables/useEther.js'
import { 
  getConnectedStatus, 
  getConnectingStatus, 
  getConnectAccount, 
  getConnectChainId,
  setConnectedStatus,
  setConnectingStatus,
  setConnectAccount
} from '../sessiondata/accountdata.js'
import { setTabarIndex,getTabarIndex } from '../sessiondata/accountdata.js'

const isConnected = ref(getConnectedStatus())
const isConnecting = ref(getConnectingStatus())
const account = ref(getConnectAccount())
const chainId = ref(getConnectChainId())

const FUND_SELECTED = 1;
const NFT_SELECTED = 2;
const FAUCET_SELECTED = 3;
const PROFILE_SELECTED = 4;

const select_type = ref(getTabarIndex());

function clickRouterLinkFn(selected) {
  select_type.value = selected
  setTabarIndex(selected)
}

const showWalletOperate = ref(false)
function showHideAccountOperateFn() {
  if (showWalletOperate.value) {
    hideOperateFn();
  }else {
    showOperateFn();
  }
}

function showOperateFn() {
  showWalletOperate.value = true;
}

function hideOperateFn() {
  showWalletOperate.value = false;
}

async function doConnectAccountFn() {
  if (!getConnectingStatus()) {
    console.log('into do connect')
    await connectWallet()
    if (getConnectedStatus()) {
      isConnected.value = true
      isConnecting.value = false
      account.value = getConnectAccount()
    }
  }
}

function disconnectAccountFn() {
  console.log('disconnectAccountFn====')
  if (isConnected.value) {
    isConnected.value = false
    isConnecting.value = false
    account.value = ''
    setConnectedStatus(false)
    setConnectingStatus(false)
    setConnectAccount('')

    console.log('getConnectedStatus====222', getConnectedStatus())
    console.log('getConnectingStatus====222', getConnectingStatus())
    console.log('getConnectAccount====222', getConnectAccount())
  }

  hideOperateFn();
}

const router = useRouter();
function forwardToProfileFn() {
  router.push({
    name: 'profile',
  });

  hideOperateFn();
}

onMounted(async() => {
  console.log('onMounted=====1111')
  await checkConnection()
  // console.log('isConnected value===', getConnectedStatus())
  // if (isConnected.value) {
  //   account.value = getConnectAccount()
  //   console.log('getConnectAccount()===', getConnectAccount())
  // }
  console.log('onMounted======2222')
})

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
        :class="['rlinkNormal', select_type==FUND_SELECTED?'selectTagStyle':'unSelectTagStyle']" to="/fund" @click="clickRouterLinkFn(FUND_SELECTED)">Fund</RouterLink>
        <router-link 
        :class="['rlinkNormal', select_type==NFT_SELECTED?'selectTagStyle':'unSelectTagStyle']" to="/nft" @click="clickRouterLinkFn(NFT_SELECTED)">NFT</router-link>
         <router-link 
        :class="['rlinkNormal', select_type==FAUCET_SELECTED?'selectTagStyle':'unSelectTagStyle']" to="/faucet" @click="clickRouterLinkFn(FAUCET_SELECTED)">Faucet</router-link>
        <router-link 
        :class="['rlinkNormal', select_type==PROFILE_SELECTED?'selectTagStyle':'unSelectTagStyle']" to="/profile" @click="clickRouterLinkFn(PROFILE_SELECTED)">Profile</router-link>
      </div>

      <button class="connectBtn" v-if="isConnected" @click="showHideAccountOperateFn">{{ account.slice(0, 4) }}...{{ account.slice(-4) }}</button>
      <button class="connectBtn" v-else @click="doConnectAccountFn">{{!isConnecting?'连接钱包':'连接中...'}}</button>

      <div class="walletOperateBox" v-if="isConnected && showWalletOperate">
        <div class="operateView" @click="disconnectAccountFn">
          disconnet
        </div>
        <!-- <div class="operateView" @click="forwardToProfileFn">
          profile
        </div> -->
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
  height: 60px;
  background: #f2f2f2;
  z-index: 10000;
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