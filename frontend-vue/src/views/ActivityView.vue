<script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router';
  import { customFundAry } from '../customdata/localdata'
  import { doGetRequest } from '../util/networkUtil'
  import { customNftAry } from '../customdata/web3data'
  
  const fundAry = ref(customFundAry)
  const nftAry = ref(customNftAry)

  const router = useRouter();

  function forwardToDetail(item) {
    console.log(item)
    router.push({
      name: 'fundDetail',
      params: {id: item.id}
    });
  };

  function forwardNftDetail() {
    router.push('/nft/detail');
  }

  onMounted(async() => {
  let requestData = await doGetRequest('https://continental-jade-wildcat.myfilebase.com/ipfs/QmeciZtq9ckvD885bRkZDp2ZrzM3UU4K21CtmQe9XveE63')

  console.log('ffff====', requestData)
  })

  const playingNftIndex = ref(-1)

  const audioSrc = ref(); // 音频文件的路径
  const audioPlayer = ref(null);

  function playMusicFn(audioUrl) {
    // audioSrc.value = audioUrl
    // document.querySelector('#myAudio').setAttribute("src", audioUrl)
    audioPlayer.value.src = audioUrl
    audioPlayer.value.play();
    console.log('playMusicFn====',audioUrl)
  }

  function pauseMusicFn() {
    audioPlayer.value.pause();
  }

  function doPlayNftMusicFn(index, audioUrl) {
    console.log('audioUrl===', audioUrl)
    if (index != playingNftIndex.value && playingNftIndex.value != -1) {
      initNftShowViewFn(playingNftIndex.value)
    } 
    showMusicPlayingViewFn(index)
    playingNftIndex.value = index
    playMusicFn(audioUrl)
  }

  function doPauseNftMusicFn(index) {
    console.log('doPauseNftMusicFn==', index)
    showNftMusicViewFn(index)
    playingNftIndex.value = -1
    pauseMusicFn()
  }

  function handleMouseEnterFn(index) {
    console.log('handleMouseEnterFn==', index)
    if (index != playingNftIndex.value) {
      showNftMusicViewFn(index)
    }
  }

  function handleMounseLeaveFn(index) {
    console.log('handleMounseLeaveFn==', index)
    if (index != playingNftIndex.value) {
      initNftShowViewFn(index)
    }
  }

  function showNftMusicViewFn(index) {
    document.getElementById(`musicPlay${index}`).style.display = "block"
    document.getElementById(`musicPause${index}`).style.display = "none"
    document.getElementById(`nft${index}`).style.background = "gray"
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
    document.getElementById(`nft${index}`).style.background = "gray"
    document.getElementById(`nftImg${index}`).classList.add('rotate-animation')
  }
</script>

<template>
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
    <audio ref="audioPlayer" id="myAudio" :src="audioSrc" hidden></audio>
    <div class="nftBox">
      <div class="nftItem" v-for="(item,index) in nftAry">
        <div class="nftPicBox" :id="`nft${index}`" @mouseenter="handleMouseEnterFn(index)" @mouseleave="handleMounseLeaveFn(index)">
          <img class="nftPic" :src="item.image" :id="`nftImg${index}`" @click="forwardNftDetail" />
          <img class="musicOperatePic" src="../assets/images/music_play.png" :id="`musicPlay${index}`" @click="doPlayNftMusicFn(index,item.animation_url)"/>
          <img class="musicOperatePic" src="../assets/images/music_pause.png" :id="`musicPause${index}`" @click="doPauseNftMusicFn(index)"/>
        </div>
        <div class="priceMintBox">
          <p>{{item.name}}</p>
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
  padding: 20px;
  margin-top: 20px;
  margin-right: 120px;
  display: flex;
  flex-direction: column;
  width: 300px;
  align-items: center;
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
  width: 300px;
  height: 300px;
  border-radius: 300px;
  background: gray;
  transform: rotate(360);
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