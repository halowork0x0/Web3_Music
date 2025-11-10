<script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  import { ethers } from 'ethers'
  import { doGetRequest } from '../util/networkUtil'
  import { nftContractAbi } from '../contractABI/myNftAbi';

  const myMusicNftAry = ref([])
  const isloading = ref(true)

  onMounted(async() => {
    try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const address = await signer.getAddress()
        let musicNftAry = []
        let nftlistAry = await doGetRequest("https://continental-jade-wildcat.myfilebase.com/ipfs/QmaWjc8Eytjg1p7p7bspBqvFeu5mmwP8Vw2KNUNy7sGpuN");
        for (let index=0; index < nftlistAry.length; index++) {
          let contract = new ethers.Contract(nftlistAry[index].contract,nftContractAbi,provider);
          let tokenBalance = await contract.balanceOf(address);
          if (tokenBalance>0) {
            for(let a=0; a<tokenBalance; a++) {
              let tokenID = (await contract.tokenOfOwnerByIndex(address, a)).toString(); // 获取特定索引的代币ID
              let musicNftAryItemObj = Object.assign({}, nftlistAry[index]);
              musicNftAryItemObj.tokenId = tokenID;
              musicNftAry.push(musicNftAryItemObj);
            }
          }
        }
        myMusicNftAry.value = musicNftAry;
        isloading.value = false;
    } catch(error) {
        console.log("onMounted error==", error)
    }
  })

  onUnmounted(async() => {
    console.log('onUnmounted====')
  }) 

  function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

</script>

<template>
<div>
  <div class="activityBox flex_row_wrap">
    <div class="nftBox">
      <div class="nftItem" v-for="item in myMusicNftAry" v-if="isloading==false">
        <div class="nftPicBox">
          <img class="nftPic" v-lazy="item.image_url" />
        </div>
        <div class="nftBottom flex_spacebetween_center">
          <p>{{item.name}}</p>
          <p>#{{item.tokenId}}</p>
        </div>
      </div>
    </div>
    <p v-if="isloading==false&&myMusicNftAry.length==0" style="margin: 0 auto;">暂无发现你的NFT</p>
  </div>
</div>

</template>

<style scoped>
.activityBox {
  padding: 40px 0;
  width: 100%;
  height: 100%;
}

.nftBox {
  width: 100%;
  display: grid;
  grid-template-columns: 33.33% 33.33% 33.33%;
}

.nftItem {
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  width: 302px;
  align-items: center;
  border-style: solid;
  border-width: 2px;
  border-radius: 4px;
  border-color: #f2f2f2;
}

.nftPicBox {
  position: relative;
  width: 300px;
  height: 300px;
  background: white;
}

.musicOperatePic {
  position: absolute;
  display: none;
  left: 129px;
  top: 129px;
  width: 42px;
  height: 42px;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
 
.rotate-animation {
  animation: rotate 3s linear infinite;
}

.clip_circle_img {
  border-radius: 50%;
  border-width: 2px;
  border-color: white;
  border-style: solid;
}

.nftPic {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 260px;
  height: 260px;
  background-image: url('../assets/images/bg_nft.jpg');
  background-size: cover;
}

.nftBottom {
  padding: 10px;
  width: 300px;
  height: 54px;
  border-top-style: solid;
  border-top-width: 1px;
  border-top-color: #f2f2f2;
}

</style>