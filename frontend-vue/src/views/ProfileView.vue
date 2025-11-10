<script setup>
  import { ref, shallowRef, onMounted, computed, watch, defineAsyncComponent } from 'vue'
  import { ethers } from 'ethers'
  import { wmcTokenContract } from '../customdata/web3data'
  import { wmcTokenContractAbi } from '../contractABI/myTokenAbi'
  import  ShowTipView  from '../components/ShowTipView.vue'
  import { tiptype_success,tiptype_warning,tiptype_loading } from '../customdata/localdata'
  import { useStore } from 'vuex'

  const store = useStore()
  const hadConnected = computed(()=>store.state.hadconnect);

  watch(hadConnected,(newStatus)=>{
    if(newStatus){
      getAccountBalanceMsgFn();
      initLoadComponet();
    }
  })

  function goBackPathFn () {
    window.history.back()
  }

  const linkAccount = ref({
    account: '',
    ethValue: '',
    wmcValue: '',
  })

  onMounted(async() => {
    try {
      if (hadConnected.value) {
        getAccountBalanceMsgFn();
        initLoadComponet();
      }
    } catch(error) {
      console.log("error==", error)
    }
  })

  async function getAccountBalanceMsgFn() {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const account = await signer.getAddress()

      let ethBalance = await provider.getBalance(account);
      let ethValue = ethers.formatEther(ethBalance);

       let showEthValue = showTokenValueFn(ethValue)

      let mycontract =  new ethers.Contract(wmcTokenContract, wmcTokenContractAbi, provider);
      let wmcBalance = await mycontract.balanceOf(account);
      let wmcValue = ethers.formatEther(wmcBalance)

      let showWmcValue = showTokenValueFn(wmcValue)

      linkAccount.value = {
        account: account,
        ethValue: showEthValue,
        wmcValue: showWmcValue
      }
    } catch(error) {
      console.log("error==", error)
    }
  }

  async function refreshAccountTokenBalance(account) {
    let provider =  ethers.getDefaultProvider("https://eth-sepolia.g.alchemy.com/v2/vX2726Xs95kD20sxRSF7J");

    const blocksToWait = 1;
    provider.getBlockNumber().then(currentBlockNumber => {
      const targetBlockNumber = currentBlockNumber + blocksToWait;

      // 监听新区块事件
      provider.on("block", async (blockNumber) => {
        if (blockNumber >= targetBlockNumber) {
          let mycontract =  new ethers.Contract(wmcTokenContract, wmcTokenContractAbi, provider);

          let ethBalance = await provider.getBalance(account);
          let ethValue = ethers.formatEther(ethBalance);
          let showEthValue = showTokenValueFn(ethValue);

          let wmcBalance = await mycontract.balanceOf(account);
          let wmcValue = ethers.formatEther(wmcBalance);
          let showWmcValue = showTokenValueFn(wmcValue);

          linkAccount.value.ethValue = showEthValue;
          linkAccount.value.wmcValue = showWmcValue;
          // 取消监听以节省资源
          provider.off("block");
        }
      });
    });
  }

  function showTokenValueFn(value) {
    let valueNum = Number(value);
    if (valueNum > 1 ) {
      return valueNum.toFixed(2);
    } else if(valueNum < 0.0001){
      return valueNum.toFixed(5);
    } else {
      return valueNum.toFixed(4);
    }
  }
  
  const tabIndex = ref(1);
  const currentTabComponent = shallowRef(null);

  function doChangeTabFn(selectTab) {
    if (selectTab != tabIndex.value) {
      tabIndex.value = selectTab
      if (selectTab==1) {
        currentTabComponent.value = defineAsyncComponent(() => import('../components/MyNftView.vue'));
      } else {
        currentTabComponent.value = defineAsyncComponent(() => import('../components/MyFundView.vue'));
      }
    }
  }

  function initLoadComponet() {
    currentTabComponent.value = defineAsyncComponent(() => import('../components/MyNftView.vue'));
    // currentTabComponent.value = defineAsyncComponent(() => import('../components/MyFundView.vue'));
  }

  const sendToken = ref({
    tokenType: 0,
    receiverAddress: '',
    sendAmount: '' ,
  })

  const showSendDialog = ref(false);
  function showTokenSendDialogFn(tokenType) {
    sendToken.value.tokenType = tokenType;
    sendToken.value.receiverAddress = '';
    sendToken.value.sendAmount = '';
    showSendDialog.value = true;
  }

  function closeSendDialogFn() {
    showSendDialog.value = false;
  }

  async function doClickComfirmSendFn(){
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const account = await signer.getAddress()

      let receiverAddress = sendToken.value.receiverAddress;
      let sendAmount = sendToken.value.sendAmount;
      if (sendToken.value.tokenType == 1) {          //转账 ETH
        let sendTx = await signer.sendTransaction({
          to: receiverAddress,
          value: ethers.parseEther(sendAmount)
        })

        if (sendTx.hash) {
          showTipViewFn("loading...", tiptype_loading)
          provider.waitForTransaction(sendTx.hash).then((receipt) => {
          if (receipt.status == 1) {
            closeSendDialogFn();
            showTipViewFn("success", tiptype_success);
            refreshAccountTokenBalance(account);
          } else {
            showTipViewFn("error", tiptype_warning);
          }
          setTimeout(function(){
            tipShow.value = false
          },2000)
          }).catch((error) => {
            tipShow.value = false
            console.error("监听交易时出错:", error);
          })
        }
      } else {         //转账 WMC
        showTipViewFn("loading...", tiptype_loading)
        let contract = new ethers.Contract(wmcTokenContract, wmcTokenContractAbi, signer);
        let txStatus = await contract.transfer(receiverAddress,ethers.parseEther(sendAmount));
        if (txStatus) {
          closeSendDialogFn();
          showTipViewFn("success", tiptype_success);
          refreshAccountTokenBalance(account);
        }else {
          showTipViewFn("error", tiptype_warning);
        }
        setTimeout(function(){
          closeTipViewFn()
        },2000)
      }
    } catch(error) {
      console.log("error===", error)
      closeTipViewFn();
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

  function closeTipViewFn(){
    tipShow.value = false
  }

  function inputTokenAmount(event) {
    const inputAmount = event.target.value.replace(/[^0-9.]/g, '').replace(/^\./, '');
    sendToken.value.sendAmount = inputAmount;
  }
</script>

<template>
  <div class="profileBox">
    <ShowTipView :tiptext="tiptext" :tiptype="tiptype" :isShow="tipShow"></ShowTipView>
    <div class="acTokenBox flex_column">
      <p style="text-align: center;line-height: 60px;" class="big_bold_text border_bottom_solid">Profile</p>
      <p style="line-height: 50px; color: #000;" v-if="!hadConnected">Please connect wallet first</p>
      <div style="height: 60px;" class="flex_row_center" v-if="hadConnected">
        <p style="font-weight: bold; color: #000;">Account: </p>
        <p style="margin-left: 10px; color: #000;">{{linkAccount.account}}</p>
      </div>
     
      <div class="flex_row_center" v-if="hadConnected">
        <div class="actokenItem rightborder flex_spacebetween_center">
          <div class="flex_row_center">
            <p style="font-size: 16px; color: red;">ETH: </p> 
            <p style="margin-left: 10px; color: #000;">{{linkAccount.ethValue}}</p>
          </div>

          <button class="sendBtn" @click="showTokenSendDialogFn(1)">send</button>
        </div>

        <div class="actokenItem flex_spacebetween_center">
          <div class="flex_row_center" style="margin-left: 10px;">
            <p style="font-size: 16px; color: red;">WMC: </p> 
            <p style="margin-left: 10px; color: #000;">{{linkAccount.wmcValue}}</p>
          </div>

          <button class="sendBtn" @click="showTokenSendDialogFn(2)">send</button>
        </div>
      </div>
    </div>

    <div class="sendDialogBox" v-if="showSendDialog">
      <div class="sendDialog">
        <div class="dialogTitleBox">
          <p style="font-size: 20px; font-weight: bold;">
            Send {{sendToken.tokenType==1?'ETH':'WMC'}}
          </p>
          <img class="deleteBtnImg" src="../assets/images/delete.png" @click="closeSendDialogFn()"/>
        </div>

        <div class="flex_row_center" style="margin-left: 30px;">
           <p style="margin-right:10px;">receiver:</p>
          <input class="dialogInput" placeholder="0x..." v-model="sendToken.receiverAddress">
          </input>
        </div>

        <div class="flex_row_center" style="margin-top: 20px; margin-left: 30px;">
           <p style="margin-right:10px;">amount:</p>
          <input class="dialogInput" placeholder="0" v-model="sendToken.sendAmount" @input="inputTokenAmount">
          </input>
        </div>

        <div class="comfirmBtn" @click="doClickComfirmSendFn()">Confirm</div>
      </div>
    </div>

    <div class="tabBox flex_row_center" v-if="hadConnected">
      <p :class="['tabItem', tabIndex==1?'tabSelectItem':'tabNormalItem']" @click="doChangeTabFn(1)">my NFT</p>
      <p :class="['tabItem', tabIndex==2?'tabSelectItem':'tabNormalItem']" @click="doChangeTabFn(2)">my Fund</p>
    </div>

    <div class="tabContain" v-if="hadConnected">
      <component :is="currentTabComponent"></component>
    </div>
  </div>
</template>

<style scoped>
.profileBox {
  display: flex;
  flex-direction: column;
  padding: 40px;
}

.acTokenBox {
  width: 600px;
  padding: 0 20px;
  margin: 0px auto;
  border-style: solid;
  border-width: 2px;
  border-color: gray;
}

.actokenItem {
  margin-bottom: 10px;
  padding-right: 10px;
  width: 300px;
  height: 30px;
}

.rightborder {
  border-right-color: black;
  border-right-width: 1px;
  border-right-style: solid;
}

.sendBtn {
  width: 50px;
  height: 30px;
  background: #13227a;
  color: white;
}

.sendBtn:hover {
  cursor: pointer;
}

.sendDialogBox {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  color: #000;
  background-color: rgba(19, 13, 13, 0.6);
}

.sendDialog {
  position: relative;
  width: 500px;
  height: 300px;
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

.dialogInput {
  width: 360px;
  height: 40px;
}

.comfirmBtn {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 80px;
  height: 40px;
  line-height: 40px;
  background: #13227a;
  color: white;
  text-align: center;
}

.comfirmBtn:hover {
  cursor: pointer;
}

.tabBox {
  margin: 50px auto 0px;
  width: 200px;
  height: 50px;
  border-style: solid;
  border-width: 1px;
  border-color: gray;
}

.tabItem {
  display: block;
  width: 100px;
  height: 49px;
  line-height: 49px;
  text-align: center;
}

.tabItem:hover {
  cursor: pointer;
}

.tabNormalItem {
  background: white;
  color: black;
}

.tabSelectItem {
  background: #13227a;
  color: white;
}

.tabContain {
  width: 100%;
}
</style>