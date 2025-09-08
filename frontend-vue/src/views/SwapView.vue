<script setup>
import { ref } from 'vue'
let tokenAry = [
  {
    tokenName: 'USDC',
    tokenContract: '1111',
    balance: 100,
  },
  {
    tokenName: 'USDT',
    tokenContract: '2222',
    balance: 60,
  },
  {
    tokenName: 'ETH',
    tokenContract: '3333',
    balance: 10,
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
})

const receiveToken = ref({
  tokenName: '',
  tokenContract: '',
  balance: 0,
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
  console.log('openType===', openType.value)
  if (openType.value == 1 && selectToken.tokenContract != receiveToken.value.tokenContract) {
    payToken.value = selectToken
    dialogShow.value = false
    console.log("aaaaa")
  } else if(openType.value == 2 && selectToken.tokenContract != payToken.value.tokenContract){
    receiveToken.value = selectToken
    dialogShow.value = false
    console.log("bbbbb")
  }
}
</script>

<template>
  <div class="swapBox">
    <div class="titleBox">
      <p style="font-size: 24px; font-weight: bold;">swap</p>
      <img class="gasSetting"></img>
    </div>
    
    <div class="swapInputBox" style="margin-top: 30px;">
      <div class="inputTitleBox">
        <p style="font-weight: bold;">You pay</p>
        <div style="display: flex; flex-direction: row;" v-if="payToken.balance>0">
          <p>{{payToken.balance}}</p>
          <p style="margin-left: 8px; color: orange;">Max</p>
        </div>
      </div>

      <div class="selectInputBox">
        <div class="tokenSelectView" @click="showSelectTokenDialogFn(PAY_SELECTTYPE)">
          <p>{{payToken.tokenName}}</p>
          <img class="downImg" src="../assets/images/down.png"/>
        </div>

        <input class="amountInput" placeholder="0">
      
        </input>
      </div>

      <p class="swapTotalValueTxt" v-if="payTokenValue>0">${{payTokenValue}}</p>
    </div>

    <div class="changeBox">
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

    <p class="rateShowTxt"> 1USDC = 1USDT </p>

    <button class="swapButton">
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
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.gasSetting {
  width: 30px;
  height: 30px;
  border-radius: 30px;
  background: white;
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