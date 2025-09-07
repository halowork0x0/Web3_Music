<script setup>
  import { useRouter } from 'vue-router';
  const router = useRouter();
  function forwardToDetail() {
    router.push('/musicfund/detail');
  };

  function forwardNftDetail() {
    console.log('bbbb')
    router.push('/nft/detail');
  }
</script>

<template>
  <div class="activityBox">
    <p class="musicTitleTxt">Music Fund</p>
    <div class="fundBox">
      <div class="fundItem">
        <img class="fundItemImg"></img>
        <div class="fundItemBottom">
          <p>completed: 80%</p>
          <p class="detailTxt" @click="forwardToDetail">Detail ></p>
        </div>
      </div>

      <div class="fundItem">
        <img class="fundItemImg"></img>
        <div class="fundItemBottom">
          <p>completed: 80%</p>
          <p class="detailTxt" @click="forwardToDetail">Detail ></p>
        </div>
      </div>

      <div class="fundItem">
        <img class="fundItemImg"></img>
        <div class="fundItemBottom">
          <p>completed: 80%</p>
          <p class="detailTxt" @click="forwardToDetail">Detail ></p>
        </div>
      </div>

      <div class="fundItem">
        <img class="fundItemImg"></img>
        <div class="fundItemBottom">
          <p>completed: 80%</p>
          <p class="detailTxt" @click="forwardToDetail">Detail ></p>
        </div>
      </div>
    </div>

    <p class="musicTitleTxt" style="margin-top: 60px;">Music NFT</p>
    <div class="nftBox">
      <div class="nftItem">
        <div class="nftPic">
        </div>
        <div class="priceMintBox">
          <p>Price: 20 USD</p>
          <button class="mintBtn">
            mint
          </button>
        </div>
      </div>

      <div class="nftItem">
        <div class="nftPic" @click="forwardNftDetail">
        </div>
        <div class="priceMintBox">
          <p>Price: 20 USD</p>
          <button class="mintBtn">
            mint
          </button>
        </div>
      </div>

      <div class="nftItem">
        <div class="nftPic" @click="forwardNftDetail">
        </div>
        <div class="priceMintBox">
          <p>Price: 20 USD</p>
          <button class="mintBtn">
            mint
          </button>
        </div>
      </div>

      <div class="nftItem">
        <div class="nftPic" @click="forwardNftDetail">
        </div>
        <div class="priceMintBox">
          <p>Price: 20 USD</p>
          <button class="mintBtn">
            mint
          </button>
        </div>
      </div>

      <div class="nftItem">
        <div class="nftPic" @click="forwardNftDetail">
        </div>
        <div class="priceMintBox">
          <p>Price: 20 USD</p>
          <button class="mintBtn">
            mint
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.activityBox {
  width: 100%;
  height: 100%;
  padding: 40px;
  display: flex;
  flex-direction: column;
}

.musicTitleTxt {
  display: block;
  font-size: 24px;
  color: black;
  font-weight: bold;
}

.fundBox {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.fundItem {
  position: relative;
  margin-top: 20px;
  margin-right: 40px;
  width: 580px;
  height: 260px;
  border-radius: 20px;
  padding: 20px;
  border-width: 4px;
  border-color: gray;
  border-style: solid;
}

.fundItemImg {
  width: 540px;
  height: 180px;
}

.fundItemBottom {
  width: 540px;
  height: 50px;
  position: absolute;
  bottom: 0px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.detailTxt {
  color: #13227a;
  font-weight: bold;
}

.nftBox {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.nftItem {
  padding: 20px;
  margin-top: 20px;
  margin-right: 120px;
  display: flex;
  flex-direction: column;
  width: 300px;
  align-items: center;
}

.nftPic {
  width: 300px;
  height: 300px;
  border-radius: 300px;
  background: gray;
}

.priceMintBox {
  margin-top: 10px;
  padding: 10px;
  width: 300px;
  height: 50px;
  border-style: solid;
  border-width: 2px;
  border-radius: 6px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.mintBtn {
  width: 68px;
  height: 30px;
  background: #13227a;
  font-size: 16px;
  color: white;
  border-width: 0px;
}
</style>