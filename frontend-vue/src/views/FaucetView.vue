<script setup>
  import { ref, onMounted, onUnmounted, computed, watch} from 'vue';
  import { wmcTokenContract } from '../customdata/web3data'
  import { wmcTokenContractAbi } from '../contractABI/myTokenAbi'
  import { ethers } from 'ethers'
  import  ShowTipView  from '../components/ShowTipView.vue'
  import { tiptype_success,tiptype_warning,tiptype_loading } from '../customdata/localdata'
  import { useStore } from 'vuex'

  const store = useStore()
  const hadConnected = computed(()=>store.state.hadconnect);

  watch(hadConnected,(newStatus)=>{
    if(newStatus){
      getConnectedAddressFaucet();
    }
  })

  const availFaucet = ref(false)
  const cooltimeRemain = ref('')
  const requestAccount = ref('')
  let myInterval = null;
  let cooltimestamp ;

  onMounted(async() => {
    if (hadConnected.value) {
      getConnectedAddressFaucet();
    }
  })

  async function getConnectedAddressFaucet() {
    try{
      console.log('aaaa')
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const account = await signer.getAddress()
      requestAccount.value = account
      const tokenContract = new ethers.Contract(wmcTokenContract,wmcTokenContractAbi,signer);
      const lastTimestampStr = (await tokenContract.getAccountLastFaucetTime(account)).toString();
      const presentTimestampStr = Math.floor(Date.now() / 1000);

      const lastTimestamp = parseInt(lastTimestampStr);
      const presentTimestamp = parseInt(presentTimestampStr);

      if (lastTimestamp == 0 || (presentTimestamp - lastTimestamp) > 60 * 60 * 24) {
        availFaucet.value = true
      } else {
        cooltimestamp = 60 * 60 * 24 - (presentTimestamp - lastTimestamp);
        availFaucet.value = false
        startCoolTimeIntervalFn()
      }
    }catch(error) {
      console.log(error)
    }
  }

  function startCoolTimeIntervalFn() {
    if(myInterval != null) {
      closeIntervalFn()
    }
    myInterval = setInterval(function(){
      cooltimestamp = cooltimestamp - 1;
      let seconds = Math.floor(cooltimestamp % 60);
      let minutes = Math.floor((cooltimestamp / 60) % 60);
      let hours = Math.floor((cooltimestamp / 60 / 60) % 24);
      hours = (hours < 10) ? "0" + hours : hours;
      minutes = (minutes < 10) ? "0" + minutes : minutes;
      seconds = (seconds < 10) ? "0" + seconds : seconds;
      let remainTime = hours + ':' + minutes + ':' + seconds;
      cooltimeRemain.value = remainTime;
    }, 1000)
  }

  function closeIntervalFn() {
    if (myInterval != null) {
      clearInterval(myInterval)
    }
    myInterval = null
  }

  onUnmounted(function(){
    closeIntervalFn();
  })

  async function claimFaucetFn(){
    try {
      if (!window.ethereum) {
        console.log("please install metamask!")
        showTipViewFn("请先安装metamask!", tiptype_warning)
        setTimeout(function(){
          tipShow.value = false
        },2000)
        return
      } 

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const account = await signer.getAddress()

      console.log('account====', account)
      const contract =  new ethers.Contract(wmcTokenContract, wmcTokenContractAbi, signer);
      const faucetTx = await contract.claimFaucet()
      console.log('mintResult===', faucetTx)
      if (faucetTx.hash) {
        showTipViewFn("正在领取WMC代币...", tiptype_loading)
        provider.waitForTransaction(faucetTx.hash).then((receipt) => {
        console.log("交易最终状态:", receipt);
        cooltimestamp = 60 * 60 *24;
        availFaucet.value = false
        startCoolTimeIntervalFn();
        if (receipt.status == 1) {
          console.log("aaa")
          showTipViewFn("领取代币成功", tiptype_success)
        } else {
          showTipViewFn("领取代币出错", tiptype_warning)
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
  <div class="faucetBox">
    <ShowTipView :tiptext="tiptext" :tiptype="tiptype" :isShow="tipShow"></ShowTipView>
    <p style="font-size: 24px; font-weight: bold;">Faucet for WMC test token</p>

    <p style="display:block;margin-top:10px;">WMC token contract: 0x1E80Bb1bc6F0d6042a207b934cd625789a5EDEfa</p>

    <p style="display:block; margin-top:10px;color:red;">you could claim 500 WMC every 24 hours</p>

    <div class="inputBox">
      <input class="addressInput" placeholder="request address" :value="requestAccount" disabled="true"></input>
      <div class="testTokenView">
        <img class="tokenIcon" src="../assets/images/icon_blue.png"></img>
        <p class="tokenTxt">WMC</p>
      </div>
    </div>

    <div class="requestBtn" v-if="hadConnected&&availFaucet==true" @click="claimFaucetFn()">
      Claim
    </div>

    <div class="disableBtn" v-if="hadConnected&&availFaucet==false">
      you can claim after {{cooltimeRemain}}
    </div>

     <div class="disableBtn" v-if="hadConnected==false">
      connect wallet first
    </div>
    
  </div>
</template>

<style scoped>
.faucetBox {
  display: flex;
  flex-direction: column;
  width: 600px;
  height: 400px;
  background: #f2f2f2;
  border-radius: 12px;
  margin: 50px auto;
  padding: 20px;
}

.inputBox {
  display: flex;
  align-items: center;
  margin-top: 40px;
  padding: 20px;
  width: 560px;
  height: 160px;
  background: white;
  border-radius: 12px;
}

.addressInput {
  padding-left: 10px;
  width: 400px;
  height: 50px;
}

.testTokenView {
  margin-left: 20px;
  padding: 8px;
  display: flex;
  align-items: center;
  width: 100px;
  height: 50px;
  background: #f2f2f2;
}

.tokenIcon {
  width: 30px;
  height: 30px;
  border-radius: 30px;
}

.tokenTxt {
  margin-left: 10px;
  font-size: 14px;
  color: gray;
  font-weight: bold;
}

.requestBtn {
  margin: 30px auto;
  width: 160px;
  height: 50px;
  line-height: 50px;
  color: white;
  text-align: center;
  border-radius: 30px;
  background: #13227a;
}

.disableBtn {
  margin: 30px auto;
  width: 240px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  border-radius: 30px;
  color: white;
  background: rgb(113, 134, 228);
}
</style>