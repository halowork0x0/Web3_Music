<script setup>
let dialogShow = false
</script>

<template>
  <div class="bridgeBox">
    <div class="titleBox">
      <p style="font-size: 24px; font-weight: bold;">Bridge</p>
      <div class="showSelectToken">
        USDT
      </div>
    </div>
    
    <div class="bridgeInputBox" style="margin-top: 30px;">
      <div class="inputTitleBox">
        <p style="font-weight: bold;">From</p>
        <div style="display: flex; flex-direction: row;">
          <p>100 USD</p>
          <p style="margin-left: 8px; color: orange;">Max</p>
        </div>
      </div>

      <div class="selectInputBox">
        <select class="chainSelect">
          <option>Sepolia</option>
          <option>Polygon test</option>
        </select>

        <input class="amountInput" placeholder="0">
      
        </input>
      </div>
    </div>

    <div class="changeBox">

    </div>

    <div class="bridgeInputBox">
      <div class="inputTitleBox">
        <p style="font-weight: bold;">To</p>
      </div>

      <div class="selectInputBox">
        <select class="chainSelect">
          <option>Sepolia</option>
          <option>Polygon test</option>
        </select>

        <input class="amountInput" placeholder="0">
      
        </input>
      </div>
    </div>

    <button class="crossButton">
      Cross
    </button>
  </div>

  <div class="tokenSelectDialogBox" v-if="dialogShow">
    <div class="selectDialog">
      <div class="dialogTitleBox">
        <p style="font-size: 20px; font-weight: bold;">Select a token</p>
        <div class="deleteBtn">X</div>
      </div>

      <div class="inputSearchBox">
        <img class="searchImg"></img>
        <input class="searchInput" placeholder="Search tokens by name or contract address"></input>
      </div>

      <p style="margin-left: 20px;">Token list</p>

      <div style="display: flex; flex-direction: column;">
        <div class="tokenlistItem">
          <p>USDT</p>
          <p>0</p>
        </div>

        <div class="tokenlistItem">
          <p>USDC</p>
          <p>0</p>
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
  height: 600px;
  background:rgb(207, 197, 197);
  border-radius: 12px;
  margin: 50px auto;
  padding: 20px;
}

.titleBox {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.showSelectToken {
  margin-left: 20px;
  width: 100px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background: gray;
}

.bridgeInputBox {
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

.chainSelect {
  width: 80px;
  height: 35px;
  text-align: center;
}

.amountInput {
  width: 200px;
  height: 35px;
  border-width: 0;
  text-align: right;
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
  background-color: orange;
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

.deleteBtn {
  width: 32px;
  height: 32px;
  border-radius: 32px;
  text-align: center;
  font-size: 20px;
  color: white;
  background: gray;
}

.inputSearchBox {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 10px auto;
  width: 460px;
  height: 50px;
  border-radius: 20px;
  background-color: rgb(203, 187, 187);
}

.searchImg {
  margin-left: 10px;
  width: 40px;
  height: 40px;
  border-radius: 40px;
  background: white;
}

.searchInput {
  margin-left: 10px;
  width: 380px;
  height: 40px;
  border-width: 0px;
  font-size: 16px;
  color: black;
  background-color: rgb(203, 187, 187);
}

.tokenlistItem {
  margin-top: 10px;
  margin-left: 20px;
  width: 460px;
  height: 50px;
  border-color: black;
  border-width: 10px;
  background: gray;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
}
</style>