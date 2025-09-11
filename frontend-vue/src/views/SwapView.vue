<script setup>
import { ref } from 'vue'
const showSlippageSetting = ref(false)
const auto_type = 1
const custom_type = 2
const custom_slippage = ref(0.5)
const slippage_type = ref(1)

function clickSlippageSettingFn() {
  showSlippageSetting.value = !showSlippageSetting.value
  console.log("custom_slippage==", custom_slippage.value)
}

function chooseSlippageTypeFn(type) {
  slippage_type.value = type
}

let tokenAry = [
  {
    tokenName: 'USDC',
    tokenContract: '1111',
    balance: 100,
    tokenValue: 1,
  },
  {
    tokenName: 'USDT',
    tokenContract: '2222',
    balance: 60,
    tokenValue: 1,
  },
  {
    tokenName: 'ETH',
    tokenContract: '3333',
    balance: 10,
    tokenValue: 3000,
  }
]
const showTokenAry = ref(tokenAry)
const dialogShow = ref(false)
const PAY_SELECTTYPE = 1
const RECEIVE_SELECTTYPE = 2
const openType = ref(0)

const payToken = ref({
  tokenName: '',
  tokenContract: '',
  balance: 0,
  tokenValue: 0
})

const receiveToken = ref({
  tokenName: '',
  tokenContract: '',
  balance: 0,
  tokenValue: 0
})

const payTokenValue = ref(0)
const receiveTokenValue = ref(0)

function showSelectTokenDialogFn(type) {
  dialogShow.value = true
  openType.value = type
}

function closeSelectDialogFn() {
  dialogShow.value = false
  openType.value = 0
}

function selectSwapTokenFn(selectToken) {
  if (openType.value == 1 && selectToken.tokenContract != receiveToken.value.tokenContract) {
    payToken.value = selectToken
    swapObject.value.fromTokenContract = selectToken.tokenContract
    dialogShow.value = false
    judgeSwapAvailableFn()
    calSwapRateFn()
  } else if(openType.value == 2 && selectToken.tokenContract != payToken.value.tokenContract){
    receiveToken.value = selectToken
    swapObject.value.toTokenContract = selectToken.tokenContract
    dialogShow.value = false
    judgeSwapAvailableFn()
    calSwapRateFn()
  }
}

const swapRate = ref(0)
function calSwapRateFn() {
  if (payToken.value.tokenContract && receiveToken.value.tokenContract) {
    swapRate.value = (payToken.value.tokenValue / receiveToken.value.tokenValue).toFixed(8)
  }
}

const swapObject = ref({
  fromTokenContract: '',
  fromTokenAmount: '',
  toTokenContract: '',
  toTokenAmount: ''
})

const swapAvail = ref(false)
function judgeSwapAvailableFn () {
  if (swapObject.value.fromTokenContract && 
     swapObject.value.fromTokenAmount && swapObject.value.toTokenContract){
    swapAvail.value = true
  } else {
    swapAvail.value = false
  }
}

function handleSwapAmountInputFn(event) {
  swapObject.value.fromTokenAmount = event.target.value
  judgeSwapAvailableFn()
}

function doclickMaxFn() {
  swapObject.value.fromTokenAmount = payToken.value.balance
  console.log('swapObject==', swapObject.value)
}

function doExchangeSwapTokenFn() {
  if (payToken.value.tokenContract || receiveToken.value.tokenContract) {
    let midObj = receiveToken.value
    receiveToken.value = payToken.value
    payToken.value = midObj

    swapObject.value = {
      fromTokenContract: payToken.value.tokenContract,
      fromTokenAmount: '',
      toTokenContract: receiveToken.value.tokenContract,
      toTokenAmount: ''
    }

    judgeSwapAvailableFn()
  }
}
</script>

<template>
  <div class="swapBox">
    <div class="titleBox">
      <p style="font-size: 24px; font-weight: bold;">swap</p>
      <div class="flex_row_center">
        <p class="slippageShow" v-if="slippage_type==custom_type">{{custom_slippage}}% Slippage</p>
        <img class="gasSetting" src="../assets/images/settings.png" @click="clickSlippageSettingFn"></img>
      </div>

      <div class="settingBox" v-if="showSlippageSetting">
        <p>Max Slippage</p>

        <div class="flex_spacebetween_center" style="margin-top: 20px;">
          <div class="flex_row_center">
            <p :class="['slipsetting', slippage_type==auto_type?'slipSelected':'slipUnselect']"
             style="margin-right: 4px;" @click="chooseSlippageTypeFn(1)">Auto</p>
            <p :class="['slipsetting', slippage_type==custom_type?'slipSelected':'slipUnselect']" 
            @click="chooseSlippageTypeFn(2)">Custom</p>
          </div>

          <div class="flex_row_center" v-if="slippage_type==2">
            <input class="slippageInput" style="margin-right: 4px;" placeholder="0.5" v-model="custom_slippage">
            </input>
            <p>%</p>
          </div>
        </div>
        
      </div>
    </div>
    
    <div class="swapInputBox" style="margin-top: 30px;">
      <div class="inputTitleBox">
        <p style="font-weight: bold;">You pay</p>
        <div class="flex_row_center" v-if="payToken.balance>0">
          <img class="small_img" src="../assets/images/wallet.png"></img>
          <p style="margin-left: 4px;">{{payToken.balance}}</p>
          <p style="margin-left: 8px; color: orange;" @click="doclickMaxFn">Max</p>
        </div>
      </div>

      <div class="selectInputBox">
        <div class="tokenSelectView" @click="showSelectTokenDialogFn(PAY_SELECTTYPE)">
          <p>{{payToken.tokenName}}</p>
          <img class="downImg" src="../assets/images/down.png"/>
        </div>

        <input class="amountInput" placeholder="0" @input="handleSwapAmountInputFn" v-model="swapObject.fromTokenAmount">
        </input>
      </div>

      <p class="swapTotalValueTxt" v-if="payTokenValue>0">${{payTokenValue}}</p>
    </div>

    <div class="changeBox" @click="doExchangeSwapTokenFn">
      <img class="exchangeImg" src="../assets/images/exchange.png" />
    </div>

    <div class="swapInputBox">
      <div class="inputTitleBox">
        <p style="font-weight: bold;">You receive</p>
      </div>

      <div class="selectInputBox">
        <div class="tokenSelectView" @click="showSelectTokenDialogFn(RECEIVE_SELECTTYPE)">
          <p>{{receiveToken.tokenName}}</p>
          <img class="downImg" src="../assets/images/down.png"/>
        </div>

        <input class="amountInput" placeholder="0">
        </input>
      </div>

      <p class="swapTotalValueTxt" v-if="receiveTokenValue>0">${{receiveTokenValue}}</p>
    </div>

    <p class="rateShowTxt" v-if="swapRate!=0"> 1 {{payToken.tokenName}} = {{swapRate}} {{receiveToken.tokenName}} </p>

    <button :class="['swapButton',swapAvail?'availOperate':'notavailOperate']">
      Swap
    </button>
  </div>

  <div class="tokenSelectDialogBox" v-if="dialogShow">
    <div class="selectDialog">
      <div class="dialogTitleBox">
        <p style="font-size: 20px; font-weight: bold;">
          {{openType == PAY_SELECTTYPE? 'Select Pay Token':'Select Receive Token'}}
        </p>
        <img class="deleteBtnImg" src="../assets/images/delete.png" @click="closeSelectDialogFn()"/>
      </div>

      <div class="inputSearchBox">
        <img class="searchImg" src="../assets/images/search.png" />
        <input class="searchInput" placeholder="Search tokens by name or contract address"></input>
      </div>

      <p style="margin-left: 20px; margin-top: 20px;">Token list</p>

      <div class="tokenlistBox">
        <div class="tokenlistItem" v-for="item in showTokenAry" @click="selectSwapTokenFn(item)">
          <p>{{item.tokenName}}</p>
          <p>{{item.balance}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.swapBox{
  display: flex;
  flex-direction: column;
  width: 500px;
  height: 600px;
  background: #f2f2f2;;
  border-radius: 12px;
  margin: 50px auto;
  padding: 20px;
}

.titleBox {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.slippageShow {
  display: block;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background: orange;
  border-radius: 4px;
  margin-right: 6px;
  padding: 0 6px;
}

.gasSetting {
  width: 30px;
  height: 30px;
  border-radius: 30px;
  background: white;
}

.settingBox {
  position: absolute;
  padding: 10px;
  top: 40px;
  right: 0px;
  width: 300px;
  background: white;
  border-radius: 6px;
  border-color: gray;
  border-style: solid;
  border-width: 1px;
}

.slipsetting {
  display: block;
  width: 60px;
  height: 40px;
  line-height: 40px;
  text-align: center;
}

.slipSelected {
  background: orange;
}

.slipUnselect {
  background-color: #f2f2f2;
}

.slippageInput {
  width: 50px;
  height: 30px;
}

.swapInputBox {
  width: 420px;
  height: 140px;
  background: white;
  border-radius: 12px;
  margin: 0 auto;
}

.inputTitleBox {
  display: flex;
  width: 420px;
  height: 30px;
  padding: 40px;
  align-items: center;
  justify-content: space-between;
}

.selectInputBox {
  display: flex;
  width: 420px;
  height: 30px;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
}

.tokenSelectView {
  padding: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80px;
  height: 35px;
  border-width: 1px;
  border-radius: 2px;
  border-style: solid;
  border-color: gray;
}

.downImg {
  width: 12px;
  height: 12px;
}

.amountInput {
  width: 200px;
  height: 35px;
  border-width: 0;
  text-align: right;
  font-size: 18px;
}

.swapTotalValueTxt {
  text-align: right;
  padding-right: 40px;
  color: red;
}

.changeBox {
  width: 40px;
  height: 40px;
  border-radius: 40px;
  background: white;
  margin: 10px auto;
}

.exchangeImg {
  margin-top: 6px;
  margin-left: 6px;
  width: 28px;
  height: 28px;
}

.rateShowTxt {
  margin: 20px 20px;
}

.swapButton {
  margin: 20px auto;
  width: 360px;
  height: 50px;
  border-radius: 25px;
  background-color: #13227a;
  color: white;
  text-align: center;
  font-size: 20px;
  border-width: 0px;
}

.availOperate {
  background-color: #13227a;
}

.notavailOperate {
  background: rgb(113, 134, 228);
}

.tokenSelectDialogBox {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  background-color: rgba(19, 13, 13, 0.6);
}

.selectDialog {
  width: 500px;
  height: 600px;
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

.inputSearchBox {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 10px auto;
  width: 460px;
  height: 50px;
  border-radius: 12px;
  background: #f2f2f2;
}

.searchImg {
  margin-left: 10px;
  width: 24px;
  height: 24px;
}

.searchInput {
  margin-left: 20px;
  padding: 10px;
  width: 380px;
  height: 40px;
  border-width: 0px;
  font-size: 16px;
  color: black;
}

.tokenlistBox {
  display: flex;
  flex-wrap: wrap;
}

.tokenlistItem {
  margin-top: 10px;
  margin-left: 20px;
  width: 220px;
  height: 50px;
  border-color: gray;
  border-width: 1px;
  border-radius: 6px;
  border-style: solid;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
}
</style>