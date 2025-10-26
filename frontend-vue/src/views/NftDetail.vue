<script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router';
  import { ethers } from 'ethers'
  import { doGetRequest } from '../util/networkUtil'
  import { nftContractAbi } from '../contractABI/myNftAbi'
  import  ShowTipView  from '../components/ShowTipView.vue'
  import { tiptype_success,tiptype_warning,tiptype_loading } from '../customdata/localdata'
  import { switchSepoliaChain } from '../composables/useEther';

  function goBackPathFn () {
    window.history.back()
  }

  const route = useRoute();
  const nftcontract = route.params.contract
  const nftMetadata = ref({})
  const totalAmount = ref('')
  const mintedAmount = ref('')
  const remainAmount = ref('')

  onMounted(async() => {
    try {
      let provider =  ethers.getDefaultProvider("https://eth-sepolia.g.alchemy.com/v2/vX2726Xs95kD20sxRSF7J");
      let mycontract =  new ethers.Contract(nftcontract, nftContractAbi, provider);
      let metadataUrl = await mycontract.getNftMetadata();
      let metadata = await doGetRequest(metadataUrl)
      nftMetadata.value = metadata
      let totalAmountStr = (await mycontract.getMaxMintAmount()).toString()
      let mintedAmountStr = (await mycontract.totalSupply()).toString()
      let remainAmountStr = "0"
      if (totalAmountStr == "0") {
        remainAmountStr = "0"
      } else {
        remainAmountStr = totalAmountStr - mintedAmountStr
      }
      totalAmount.value = totalAmountStr
      mintedAmount.value = mintedAmountStr
      remainAmount.value = remainAmountStr

    } catch(error) {
      console.log("error==", error)
    }
  })

  const playingNftIndex = ref(-1)

  const audioSrc = ref(); // 音频文件的路径
  const audioPlayer = ref(null);
  const isPlayMusic = ref(false)

  function playMusicFn() {
    audioPlayer.value.src = nftMetadata.value.animation_url
    audioPlayer.value.play();
    isPlayMusic.value = true
  }

  function pauseMusicFn() {
    audioPlayer.value.pause();
    isPlayMusic.value = false
  }

  function handleMusicEndFn() {
    if (isPlayMusic.value) {
      initNftShowViewFn(playingNftIndex.value)
      isPlayMusic.value = false
    }
  }

  function doPlayNftMusicFn() {
    showMusicPlayingViewFn()
    playMusicFn()
  }

  function doPauseNftMusicFn() {
    showNftMusicViewFn()
    pauseMusicFn()
  }

  function handleMouseEnterFn() {
    if (!isPlayMusic.value) {
      showNftMusicViewFn()
    }
  }

  function handleMounseLeaveFn() {
    if (!isPlayMusic.value) {
      initNftShowViewFn()
    }
  }

  function showNftMusicViewFn() {
    document.getElementById("musicPlayId").style.display = "block"
    document.getElementById("musicPauseId").style.display = "none"
    document.getElementById("nftImgId").classList.remove('rotate-animation')
    document.getElementById("nftImgId").classList.add('clip_circle_img')
  }

  function initNftShowViewFn() {
    document.getElementById("musicPlayId").style.display = "none"
    document.getElementById("musicPauseId").style.display = "none"
    document.getElementById("nftImgId").classList.remove('rotate-animation')
    document.getElementById("nftImgId").classList.remove('clip_circle_img')
  }

  function showMusicPlayingViewFn() { 
    document.getElementById("musicPlayId").style.display = "none"
    document.getElementById("musicPauseId").style.display = "block"
    document.getElementById("nftImgId").classList.add('rotate-animation')
    document.getElementById("nftImgId").classList.add('clip_circle_img')
  }

  async function doMintNftFn() {
    try {
      if (!window.ethereum) {
        showTipViewFn("请先连接钱包!", tiptype_warning)
        setTimeout(function(){
          tipShow.value = false
        },2000)
        return
      }
      
      await switchSepoliaChain();

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const account = await signer.getAddress()

      const contract =  new ethers.Contract(nftcontract, nftContractAbi, signer);
      const mintTx = await contract.safeMint(account)
      if (mintTx.hash) {
        showTipViewFn("NFT铸造中...", tiptype_loading)
        provider.waitForTransaction(mintTx.hash).then((receipt) => {
        if (receipt.status == 1) {
          showTipViewFn("NFT铸造成功", tiptype_success)
        } else {
          showTipViewFn("NFT铸造出错", tiptype_warning)
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
  <div class="detailBox">
    <p class="goBackView" @click="goBackPathFn">< Back</p>
    <div class="detailMsgBox">
      <audio ref="audioPlayer" id="myAudio" :src="audioSrc" @ended="handleMusicEndFn" hidden></audio>
      <div class="nftPicBox" id="nftboxId" @mouseenter="handleMouseEnterFn" @mouseleave="handleMounseLeaveFn">
        <img class="nftImg" v-lazy="nftMetadata.image" id="nftImgId"></img>
        <img class="musicOperatePic" src="../assets/images/music_play.png" id="musicPlayId" @click="doPlayNftMusicFn"/>
        <img class="musicOperatePic" src="../assets/images/music_pause.png" id="musicPauseId" @click="doPauseNftMusicFn"/>
      </div>
      <div class="nftMsgBox">
        <p class="mid_bold_text" style="margin-bottom: 20px;">NFT Message</p>

        <div class="flex_row_center" style="margin-top: 12px;" v-for="attr in nftMetadata.attributes">
          <p class="txtLeft">{{attr.trait_type}}:</p>
          <p class="txtRight">{{attr.value}}</p>
        </div>

        <div class="flex_row_center" style="margin-top: 12px;">
          <p class="txtLeft">总供应量:</p>
          <p class="txtRight">{{totalAmount=="0"?"无限":totalAmount}}</p>
        </div>

        <div class="flex_row_center" style="margin-top: 12px;">
          <p class="txtLeft">已铸数量:</p>
          <p class="txtRight">{{mintedAmount}}</p>
        </div>

        <div class="flex_row_center" style="margin-top: 12px;">
          <p class="txtLeft">剩余数量:</p>
          <p class="txtRight">{{remainAmount=="0"?"无限":remainAmount}}</p>
        </div>

        <button class="mintBtn" @click="doMintNftFn">
          Mint
        </button>
      </div>
    </div>

    <div class="regularBox">
      <p style="font-size: 20px; color: black; font-weight: bold;">regular</p>
      <p style="margin-top: 12px;">1. 该活动交易为测试展示所用，没有任何经济价值</p>
      <p style="margin-top: 6px;">2. 该NFT支持发送或多次铸造
      </p>
    </div>
  </div>
</template>

<style scoped>
.detailBox {
  display: flex;
  flex-direction: column;
  padding: 40px;
}

.goBackView {
  width: 100px;
  height: 40px;
  font-weight: bold;
  font-size: 16px;
}

.detailMsgBox {
  margin-top: 40px;
  display: flex;
  flex-direction: row;
}

.nftMsgBox {
  position: relative;
  padding: 10px;
  margin-left: 160px;
  width: 500px;
  height: 300px;
  border-width: 2px;
  border-style: solid;
  border-color: gray;
}

.mintBtn {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 100px;
  height: 40px;
  background: #13227a;
  color: white;
}

.regularBox {
  margin-top: 40px;
  margin-left: 100px;
  width: 640px;
  height: 600px;
}

.txtLeft {
  display: block;
  width: 80px;
}

.txtRight {
  display: block;
  width: 200px;
}

.nftPicBox {
  margin-left: 100px;
  position: relative;
  width: 300px;
  height: 300px;
  background: white;
}

.musicOperatePic {
  position: absolute;
  display: none;
  left: 125px;
  top: 125px;
  width: 50px;
  height: 50px;
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

.nftImg {
  position: absolute;
  width: 300px;
  height: 300px;
  transform: rotate(360);
  background-image: url('../assets/images/bg_nft.png');
  background-size: cover;
}
</style>