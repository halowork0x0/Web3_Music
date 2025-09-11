<script setup>
import { ref } from 'vue'
const dialogShow = ref(false)
const dialogType_from = 1
const dialogType_to = 2
const dialogType_token = 3
const dialog_type = ref(0)

let chainAry = [
  {
    chianId: '001',
    chainName: 'Etherum'
  },
  {
    chianId: '002',
    chainName: 'Sepolia'
  },
  {
    chianId: '003',
    chainName: 'Polygon'
  },
]
const showChainAry = ref(chainAry)

function showSelectDialogFn(opentype) {
  dialog_type.value = opentype
  dialogShow.value = true
}

function closeSelectDialogFn() {
  dialog_type.value = 0
  dialogShow.value = false
}

const fromChain = ref({
  chianId: '',
  chainName: ''
})

const toChain = ref({
  chianId: '',
  chainName: ''
})

function selectCrossChainFn(opentype, selectedChain) {
  if (opentype == dialogType_from && selectedChain.chianId != toChain.value.chianId) {
    fromChain.value = selectedChain
    crossObj.value.fromChainId = selectedChain.chianId
    closeSelectDialogFn()
    judgeCrossAvailFn()
  } else if(opentype == dialogType_to&& selectedChain.chianId != fromChain.value.chianId){
    toChain.value = selectedChain
    crossObj.value.toChainId = selectedChain.chianId
    closeSelectDialogFn()
    judgeCrossAvailFn()
  }
}

let tokenAry = [
  {
    tokenContract: '001',
    tokenName: 'USDC',
    balance: 100
  },
  {
    tokenContract: '002',
    tokenName: 'USDT',
    balance: 60,
  },
  {
    tokenContract: '003',
    tokenName: 'ETH',
    balance: 2
  }
]
const showTokenAry = ref(tokenAry)
const selectedToken = ref({
  tokenContract: '',
  tokenName: '',
  balance: 0
})

function selectCrossTokenFn(token) {
  selectedToken.value = token
  crossObj.value.tokenContract = token.tokenContract
  closeSelectDialogFn()
}

function doclickMaxAmountFn() {
  crossObj.value.tokenValue = selectedToken.value.balance
  judgeCrossAvailFn()
}

const crossObj = ref({
  fromChainId: '',
  toChainId: '',
  tokenContract: '',
  tokenValue: ''
})

function handleInputAmountFn(event) {
  crossObj.value.tokenValue = event.target.value
  judgeCrossAvailFn()
}

const crossAvail = ref(false)
function judgeCrossAvailFn() {
  console.log('crossObj==', crossObj.value)
  if (crossObj.value.fromChainId && crossObj.value.toChainId 
   && crossObj.value.tokenContract && crossObj.value.tokenValue) {
    crossAvail.value = true
  }else {
    crossAvail.value = false
  }
}

function doCrossChainFn() {
  console.log('crossObj===', crossObj)
}

function doExchangeCrossChainFn() {
  if (fromChain.value.chianId || toChain.value.chianId) {
    let midChain = toChain.value
    toChain.value = fromChain.value
    fromChain.value = midChain

    selectedToken.value = {
      tokenContract: '',
      tokenName: '',
      balance: 0
    }

    crossObj.value = {
      fromChainId: fromChain.value.chianId,
      toChainId: toChain.value.chianId,
      tokenContract: '',
      tokenValue: ''
    }
    judgeCrossAvailFn()
  }
}
</script>

<template>
  <div class="bridgeBox">
    <p style="font-size: 24px; font-weight: bold;">Bridge</p>
    
    <div class="chainItemBox" style="margin-top: 30px;">
      <div class="space_between_center">
        <p style="font-weight: bold;">From</p>

        <div class="selectView" @click="showSelectDialogFn(dialogType_from)">
          <p>{{fromChain.chainName}}</p>
          <img class="downImg" src="../assets/images/down.png"/>
        </div>
      </div>

      <div class="tokenSelectInputBox">
        <div class="flex_spacebetween_center" style="margin-top: 20px;">
          <p style="font-weight: bold;">Token</p>

          <div class="flex_row_center" v-if="selectedToken.balance>0">
            <img class="small_img" src="../assets/images/wallet.png"></img>
            <p style="margin-left: 4px;">{{selectedToken.balance}}</p>
            <p style="margin-left: 8px; color: orange;" @click="doclickMaxAmountFn">Max</p>
          </div>
        </div>

        <div class="space_between_center" style="margin-top: 16px;">
          <input class="amountInput" placeholder="0" v-model="crossObj.tokenValue" @input="handleInputAmountFn">
          </input>

          <div class="selectView" @click="showSelectDialogFn(dialogType_token)">
            <p>{{selectedToken.tokenName}}</p>
            <img class="downImg" src="../assets/images/down.png"/>
          </div>
        </div>
      </div>
    </div>

    <div class="changeBox" @click="doExchangeCrossChainFn">
      <img class="exchangeImg" src="../assets/images/arrow_down.png" />
    </div>

    <div class="chainItemBox">
      <div class="space_between_center">
        <p style="font-weight: bold;">To</p>

        <div class="selectView" @click="showSelectDialogFn(dialogType_to)">
          <p>{{toChain.chainName}}</p>
          <img class="downImg" src="../assets/images/down.png"/>
        </div>
      </div>
    </div>

    <button :class="['crossButton',crossAvail?'availBtn':'notAvailBtn']"  @click="doCrossChainFn">
      Cross
    </button>
  </div>

  <div class="selectDialogBox" v-if="dialogShow">
    <div class="selectDialog">
      <div class="dialogTitleBox">
        <p style="font-size: 20px; font-weight: bold;">
         {{dialog_type==1?'Select Sender Chain':dialog_type==2?'Select Receiver Chain':'Select Token'}}
        </p>
        <img class="deleteBtnImg" src="../assets/images/delete.png" @click="closeSelectDialogFn()"/>
      </div>

      <div class="inputSearchBox" v-if="dialog_type==3">
        <img class="searchImg" src="../assets/images/search.png" />
        <input class="searchInput" placeholder="Search tokens by name or contract address"></input>
      </div>

      <p style="margin-left: 20px; margin-top: 20px;">
        {{dialog_type==3?'Token list':'Chain list'}}
      </p>

      <div class="tokenlistBox" v-if="dialog_type!=3">
        <div class="listItem" v-for="item in showChainAry" @click="selectCrossChainFn(dialog_type, item)">
          <p>{{item.chainName}}</p>
        </div>
      </div>

      <div class="tokenlistBox" v-if="dialog_type==3">
        <div class="listItem" v-for="item in showTokenAry" @click="selectCrossTokenFn(item)">
          <p>{{item.tokenName}}</p>
          <p>{{item.balance}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bridgeBox{
  display: flex;
  flex-direction: column;
  width: 500px;
  background: #f2f2f2;
  border-radius: 12px;
  margin: 50px auto;
  padding: 20px;
}

.titleBox {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.chainItemBox {
  padding: 20px;
  width: 420px;
  background: white;
  border-radius: 12px;
  margin: 0 auto;
}

.space_between_center {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tokenSelectInputBox {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  width: 380px;
  border-top-style: solid;
  border-top-width: 1px;
  border-top-color: gray;
}

.amountInput {
  width: 200px;
  height: 35px;
  border-width: 0;
  text-align: left;
  font-size: 18px;
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

.crossButton {
  margin: 20px auto;
  width: 360px;
  height: 50px;
  border-radius: 25px;
  color: white;
  text-align: center;
  font-size: 20px;
  border-width: 0px;
}

.availBtn {
  background-color: #13227a;
}

.notAvailBtn {
  background: rgb(113, 134, 228);
}

.deleteBtn {
  width: 32px;
  height: 32px;
  border-radius: 32px;
  text-align: center;
  font-size: 20px;
  color: white;
  background: gray;
}

.selectView {
  padding: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100px;
  height: 40px;
  border-width: 1px;
  border-radius: 2px;
  border-style: solid;
  border-color: gray;
}

.downImg {
  width: 12px;
  height: 12px;
}

.selectDialogBox {
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

.listItem {
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