<script setup>
import { ref } from 'vue'
const dialogShow = ref(false)
const dialogType_from = 1
const dialogType_to = 2
const dialogType_token = 3
const dialog_type = ref(0)

let chainAry = ['Etherum','Sepolia','Polygon']
const showChainAry = ref(chainAry)
let tokenAry = ['USDC','USDT','ETH']
const showTokenAry = ref(tokenAry)

function showSelectDialogFn(opentype) {
  dialog_type.value = opentype
  dialogShow.value = true
}

function closeSelectDialogFn() {
  dialogShow.value = false
}
</script>

<template>
  <div class="bridgeBox">
    <p style="font-size: 24px; font-weight: bold;">Bridge</p>
    
    <div class="chainItemBox" style="margin-top: 30px;">
      <div class="space_between_center">
        <p style="font-weight: bold;">From</p>

        <div class="selectView" @click="showSelectDialogFn(dialogType_from)">
          <p>BTC</p>
          <img class="downImg" src="../assets/images/down.png"/>
        </div>
      </div>

      <div class="tokenSelectInputBox">
        <p style="font-weight: bold; margin-top: 20px;">Token</p>

        <div class="space_between_center">
          <input class="amountInput" placeholder="0">
          </input>

          <div class="selectView" @click="showSelectDialogFn(dialogType_token)">
            <p>BTC</p>
            <img class="downImg" src="../assets/images/down.png"/>
          </div>
        </div>
      </div>
    </div>

    <div class="changeBox">

    </div>

    <div class="chainItemBox">
      <div class="space_between_center">
        <p style="font-weight: bold;">To</p>

        <div class="selectView" @click="showSelectDialogFn(dialogType_to)">
          <p>BTC</p>
          <img class="downImg" src="../assets/images/down.png"/>
        </div>
      </div>
    </div>

    <button class="crossButton">
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
        <div class="listItem" v-for="item in showChainAry">
          <p>{{item}}</p>
        </div>
      </div>

      <div class="tokenlistBox" v-if="dialog_type==3">
        <div class="listItem" v-for="item in showTokenAry">
          <p>{{item}}</p>
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

.crossButton {
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