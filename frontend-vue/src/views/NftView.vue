<script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router';
  import { tiptype_success,tiptype_warning,tiptype_loading } from '../customdata/localdata'
  import { doGetRequest } from '../util/networkUtil'
  import { nftContractAbi } from '../contractABI/myNftAbi'
  import { ethers } from 'ethers'
  import  ShowTipView  from '../components/ShowTipView.vue'
  import { switchSepoliaChain } from '../composables/useEther';
  
  const nftAry = ref([])

  const router = useRouter();
  function forwardNftDetail(nftcontract) {
    router.push({
      name: 'nftDetail',
      params: {contract: nftcontract}
    });
  }

  onMounted(async() => {
    try {
      let nftlistreq = await doGetRequest("https://continental-jade-wildcat.myfilebase.com/ipfs/QmaWjc8Eytjg1p7p7bspBqvFeu5mmwP8Vw2KNUNy7sGpuN");
      nftAry.value = nftlistreq;
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
    document.getElementById(`nftImg${index}`).classList.add('clip_circle_img')
  }

  function initNftShowViewFn(index) {
    document.getElementById(`musicPlay${index}`).style.display = "none"
    document.getElementById(`musicPause${index}`).style.display = "none"
    document.getElementById(`nft${index}`).style.background = "white"
    document.getElementById(`nftImg${index}`).classList.remove('rotate-animation')
    document.getElementById(`nftImg${index}`).classList.remove('clip_circle_img')
  }

  function showMusicPlayingViewFn(index) {
    document.getElementById(`musicPlay${index}`).style.display = "none"
    document.getElementById(`musicPause${index}`).style.display = "block"
    document.getElementById(`nft${index}`).style.background = "#515151"
    document.getElementById(`nftImg${index}`).classList.add('rotate-animation')
    document.getElementById(`nftImg${index}`).classList.add('clip_circle_img')
  }

  async function doMintNftFn(nftcontract) {
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
  <div class="activityBox flex_row_wrap">
    <ShowTipView :tiptext="tiptext" :tiptype="tiptype" :isShow="tipShow"></ShowTipView>
    <audio ref="audioPlayer" id="myAudio" :src="audioSrc" @ended="handleMusicEndFn" hidden></audio>
    <div class="nftItem" v-for="(item,index) in nftAry" @mouseenter="handleMouseEnterFn(index)" @mouseleave="handleMounseLeaveFn(index)">
      <div class="nftPicBox" :id="`nft${index}`" >
        <img class="nftPic" v-lazy="item.image_url" :id="`nftImg${index}`" @click="forwardNftDetail(item.contract)" />
        <img class="musicOperatePic" src="../assets/images/music_play.png" :id="`musicPlay${index}`" @click="doPlayNftMusicFn(index,item.music_url)"/>
        <img class="musicOperatePic" src="../assets/images/music_pause.png" :id="`musicPause${index}`" @click="doPauseNftMusicFn(index)"/>
      </div>
      <div class="nftNormalButtom">
        <p>{{item.name}}</p>
        <button class="mintBtn">
          mint
        </button>
      </div>

      <div class="nftFocusButtom" @click="doMintNftFn(item.contract)">
        mint
      </div>
    </div>
  </div>
</template>

<style scoped>
.activityBox {
  padding: 40px 0;
  width: 100%;
  height: 100%;
}

.nftItem {
  margin-left: 120px;
  margin-bottom: 40px;
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
  background-image: url('../assets/images/bg_nft.png');
  background-size: cover;
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
  background-color: #13227a;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  border-top-width: 1px;
  border-top-color: white;
  border-top-style: solid;
  transition: background-color 0.2s ease;
}

.nftFocusButtom:active {
  background-color: #1633d8;
}

</style>