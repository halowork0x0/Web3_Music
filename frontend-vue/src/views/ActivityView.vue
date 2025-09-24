<script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router';
  import { customFundAry,tiptype_success,tiptype_warning,tiptype_loading } from '../customdata/localdata'
  import { doGetRequest } from '../util/networkUtil'
  import { nftContractAry } from '../customdata/web3data'
  import { nftContractAbi } from '../contractABI/myNftAbi'
  import { ethers } from 'ethers'
  import  ShowTipView  from '../components/ShowTipView.vue'
  
  const fundAry = ref(customFundAry)
  const nftAry = ref([])

  const router = useRouter();

  function forwardToDetail(item) {
    console.log(item)
    router.push({
      name: 'fundDetail',
      params: {id: item.id}
    });
  };

  function forwardNftDetail(index) {
    router.push({
      name: 'nftDetail',
      params: {contract: nftContractAry(index)}
    });
  }

  onMounted(async() => {
    try {
      const provider =  ethers.getDefaultProvider("https://eth-sepolia.g.alchemy.com/v2/vX2726Xs95kD20sxRSF7J")
      let nftmetadataAry = []
      for (let index = 0; index < nftContractAry.length; index++) {
        let mycontract =  new ethers.Contract(nftContractAry[index], nftContractAbi, provider);
        let metadataUrl = await mycontract.getNftMetadata();
        let metadata = await doGetRequest(metadataUrl)
        nftmetadataAry.push(metadata)
      }
        console.log('nftmetadataAry===', nftmetadataAry)
        nftAry.value = nftmetadataAry
    } catch(error) {
      console.log("onMounted error==", error)
    }
  })

  const playingNftIndex = ref(-1)

  const audioSrc = ref(); // 音频文件的路径
  const audioPlayer = ref(null);

  function playMusicFn(audioUrl) {
    audioPlayer.value.src = audioUrl
    audioPlayer.value.play();
  }

  function pauseMusicFn() {
    audioPlayer.value.pause();
  }

  function handleMusicEndFn() {
    console.log('handleMusicEndFn====')
    if (playingNftIndex != -1) {
      initNftShowViewFn(playingNftIndex.value)
    }
  }

  function doPlayNftMusicFn(index, audioUrl) {
    if (index != playingNftIndex.value && playingNftIndex.value != -1) {
      initNftShowViewFn(playingNftIndex.value)
    } 
    showMusicPlayingViewFn(index)
    playingNftIndex.value = index
    playMusicFn(audioUrl)
  }

  function doPauseNftMusicFn(index) {
    showNftMusicViewFn(index)
    playingNftIndex.value = -1
    pauseMusicFn()
  }

  function handleMouseEnterFn(index) {
    if (index != playingNftIndex.value) {
      showNftMusicViewFn(index)
    }
  }

  function handleMounseLeaveFn(index) {
    if (index != playingNftIndex.value) {
      initNftShowViewFn(index)
    }
  }

  function showNftMusicViewFn(index) {
    document.getElementById(`musicPlay${index}`).style.display = "block"
    document.getElementById(`musicPause${index}`).style.display = "none"
    document.getElementById(`nft${index}`).style.background = "#515151"
    document.getElementById(`nftImg${index}`).classList.remove('rotate-animation')
  }

  function initNftShowViewFn(index) {
    document.getElementById(`musicPlay${index}`).style.display = "none"
    document.getElementById(`musicPause${index}`).style.display = "none"
    document.getElementById(`nft${index}`).style.background = "white"
    document.getElementById(`nftImg${index}`).classList.remove('rotate-animation')
  }

  function showMusicPlayingViewFn(index) {
    document.getElementById(`musicPlay${index}`).style.display = "none"
    document.getElementById(`musicPause${index}`).style.display = "block"
    document.getElementById(`nft${index}`).style.background = "#515151"
    document.getElementById(`nftImg${index}`).classList.add('rotate-animation')
  }

  async function doMintNftFn(index) {
    try {
      console.log('bbbbb=====')
      if (!window.ethereum) {
        console.log("please install metamask!")
        showTipViewFn("请先安装metamask!", tiptype_warning)
        setTimeout(function(){
          console.log('hhhhh====')
          tipShow.value = false
        },2000)
        return
      } 

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const account = await signer.getAddress()

      console.log('account====', account)
      const contract =  new ethers.Contract(nftContractAry[index], nftContractAbi, signer);
      const mintTx = await contract.safeMint(account)
      console.log('mintResult===', mintTx)
      if (mintTx.hash) {
        showTipViewFn("NFT铸造中...", tiptype_loading)
        provider.waitForTransaction(mintTx.hash).then((receipt) => {
        console.log("交易最终状态:", receipt);
        if (receipt.status == 1) {
          console.log("aaa")
          showTipViewFn("NFT铸造成功", tiptype_success)
        } else {
          showTipViewFn("NFT铸造出错", tiptype_warning)
          console.log("bbb")
        }
        setTimeout(function(){
          tipShow.value = false
        },2000)
        }).catch((error) => {
          tipShow.value = false
          console.error("监听交易时出错:", error);
        })
      }
    } catch(error) {
      console.log("error===", error)
    }
  }

  const tipShow = ref(false)
  const tiptext = ref('')
  const tiptype = ref('')

  function showTipViewFn(text, type) {
    tiptext.value = text
    tiptype.value = type
    tipShow.value = true
  }
</script>

<template>
  <ShowTipView :tiptext="tiptext" :tiptype="tiptype" :isShow="tipShow"></ShowTipView>
  <div class="activityBox">
    <p class="musicTitleTxt">Music Fund</p>
    <div class="fundBox">
      <div class="fundItem" v-for="item in fundAry">
        <div class="flex_spacebetween_center">
          <p>Song: {{item.song}}</p>
          <p>Singer: {{item.singer}}</p>
        </div>
        <img class="fundItemImg"></img>
        <div class="fundItemBottom">
          <!-- <p>completed: {{(item.nowFund/item.targetFund * 100).toFixed(2)}}%</p> -->
          <p class="detailTxt" @click="forwardToDetail(item)">Detail ></p>
        </div>
      </div>
    </div>

    <p class="musicTitleTxt" style="margin-top: 60px;">Music NFT</p>
    <audio ref="audioPlayer" id="myAudio" :src="audioSrc" @ended="handleMusicEndFn" hidden></audio>
    <div class="nftBox">
      <div class="nftItem" v-for="(item,index) in nftAry" @mouseenter="handleMouseEnterFn(index)" @mouseleave="handleMounseLeaveFn(index)">
        <div class="nftPicBox" :id="`nft${index}`" >
          <img class="nftPic" :src="item.image" :id="`nftImg${index}`" @click="forwardNftDetail(index)" />
          <img class="musicOperatePic" src="../assets/images/music_play.png" :id="`musicPlay${index}`" @click="doPlayNftMusicFn(index,item.animation_url)"/>
          <img class="musicOperatePic" src="../assets/images/music_pause.png" :id="`musicPause${index}`" @click="doPauseNftMusicFn(index)"/>
        </div>
        <div class="nftNormalButtom">
          <p>{{item.name}}</p>
          <button class="mintBtn">
            mint
          </button>
        </div>

        <div class="nftFocusButtom" @click="doMintNftFn(index)">
          mint
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
  height: 310px;
  border-radius: 20px;
  padding: 20px;
  border-width: 4px;
  border-color: gray;
  border-style: solid;
}

.fundItemImg {
  margin-top: 20px;
  width: 540px;
  height: 180px;
}

/* .fundItemBottom {
  width: 540px;
  height: 50px;
  position: absolute;
  bottom: 0px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
} */

.fundItemBottom {
  width: 540px;
  height: 40px;
  position: absolute;
  bottom: 10px;
  display: flex;
  flex-direction: row;
  justify-content: end;
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
  margin-top: 20px;
  margin-right: 120px;
  display: flex;
  flex-direction: column;
  width: 302px;
  align-items: center;
  border-style: solid;
  border-width: 2px;
  border-radius: 4px;
  border-color: #f2f2f2;
}

.nftItem:hover .nftNormalButtom {
  display: none;
}

.nftItem:hover .nftFocusButtom {
  display: block;
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

.nftPic {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 260px;
  height: 260px;
  border-radius: 300px;
  border-width: 2px;
  border-color: white;
  border-style: solid;
  /* background: gray; */
  transform: rotate(360);
}

.nftNormalButtom {
  padding: 10px;
  width: 300px;
  height: 54px;
  border-top-style: solid;
  border-top-width: 1px;
  border-top-color: #f2f2f2;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.mintBtn {
  width: 68px;
  height: 34px;
  background: #13227a;
  font-size: 16px;
  color: white;
  border-width: 0px;
}

.nftFocusButtom {
  display: none;
  width: 300px;
  height: 54px;
  line-height: 54px;
  text-align: center;
  color: white;
  font-size: 18px;
  background: #13227a;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  border-top-width: 1px;
  border-top-color: white;
  border-top-style: solid;
}

</style>