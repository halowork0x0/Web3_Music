<script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { ethers } from 'ethers';
  import { doGetRequest } from '../util/networkUtil';
  import { fundContractAbi } from '../contractABI/myFundAbi';
  import  ShowTipView  from '../components/ShowTipView.vue';
  import { tiptype_success, tiptype_warning, tiptype_loading } from '../customdata/localdata';

  const route = useRoute();
  const fundContract = route.params.contract;
  const musicMetadata = ref({});
  const fundDetail = ref({
    createDate: '',
    endDate: '',
    targetFund: '',
    presentFundETH: '',
    presentFundUSD: '',
    minFund: ''
  })

  const showOperateBtn = ref({
    fundBtn: false,
    refundBtn: false,
    getfundBtn: false,
  })

  const activityStatus = ref(0)
   
  onMounted(async() => {
    try {
      let provider =  ethers.getDefaultProvider("https://eth-sepolia.g.alchemy.com/v2/vX2726Xs95kD20sxRSF7J")
      let mycontract =  new ethers.Contract(fundContract, fundContractAbi, provider);
      let metadataUrl = await mycontract.getMusicMetadata();
      let metadata = await doGetRequest(metadataUrl)
      musicMetadata.value = metadata;
      let minFund = (await mycontract.minFund()).toString()/10 ** 18;
      let targetFund = (await mycontract.targetFund()).toString()/10 ** 18;
      let presentFundETH = ((await provider.getBalance(fundContract)).toString()/10 ** 18);
      let presentFundUSD = ((await mycontract.showFundBalanceTotalUsd()).toString()/10 ** 18).toFixed(2);
      let createDate = transferTimestampToDatetime((await mycontract.deployTimeStamp()).toString() * 1000);
      let deployTimestamp = await mycontract.deployTimeStamp();
      let windowTimestamp = await mycontract.windowTimeStamp();
      let endDate = transferTimestampToDatetime((deployTimestamp + windowTimestamp).toString() * 1000);

      judgeOperateBtn(deployTimestamp + windowTimestamp, targetFund, presentFundUSD);

      fundDetail.value = {
        createDate: createDate,
        endDate: endDate,
        targetFund: targetFund,
        presentFundETH: presentFundETH,
        presentFundUSD: presentFundUSD,
        minFund: minFund
      }
    } catch(error) {
      console.log("onMounted error==", error)
    }
  })

  onUnmounted(function(){
    closeIntervalFn();
  })

  function judgeOperateBtn(endDateTimestamp,targetFund,presentFundUSD) {
    let presentTimes = new Date().getTime();
    let endDateTimes = (endDateTimestamp.toString()) * 1000;

    if (presentTimes < endDateTimes) {
      showOperateBtn.value = {
        fundBtn: true,
        refundBtn: false,
        getfundBtn: false
      }
      startActivityTimeIntervalFn((endDateTimes-presentTimes)/1000);
      activityStatus.value = 1;
    } else {
      if (targetFund > presentFundUSD) {
        showOperateBtn.value = {
          fundBtn: false,
          refundBtn: false,
          getfundBtn: true
        }
      } else {
        showOperateBtn.value = {
          fundBtn: false,
          refundBtn: true,
          getfundBtn: false
        }
      }
      activityStatus.value = 2;
    }
  }

  const activityCount = ref({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  let myInterval = null;
  function startActivityTimeIntervalFn(activityTimestamp) {
    if(myInterval != null) {
      closeIntervalFn()
    }
    myInterval = setInterval(function(){
      activityTimestamp = activityTimestamp - 1;
      let seconds = Math.floor(activityTimestamp % 60);
      let minutes = Math.floor((activityTimestamp / 60) % 60);
      let hours = Math.floor((activityTimestamp / 60 / 60) % 24);
      let days = Math.floor(activityTimestamp / (60 * 60 * 24))

      days = (days < 10) ? "0" + days : days
      hours = (hours < 10) ? "0" + hours : hours;
      minutes = (minutes < 10) ? "0" + minutes : minutes;
      seconds = (seconds < 10) ? "0" + seconds : seconds;
      activityCount.value = {
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds
      }
    }, 1000)
  }

  function closeIntervalFn() {
    if (myInterval != null) {
      clearInterval(myInterval)
    }
    myInterval = null
  }

  async function doGetFundFn() {
     try {
      if (!window.ethereum) {
        showTipViewFn("请先连接钱包!", tiptype_warning)
        setTimeout(function(){
          tipShow.value = false
        },2000)
        return
      } 

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const account = await signer.getAddress()

      console.log('account====', account)
      if (account != "0xe2951bd1eD4269b167F602C745c31BEC198DcF49") {
        showTipViewFn("you're no owner!", tiptype_warning);
        setTimeout(function(){
          closeTipViewFn();
        },2000)
      } else {
        const contract =  new ethers.Contract(fundContract, fundContractAbi, signer);
        const getfundTx = await contract.getFund()
        if (getfundTx.hash) {
          showTipViewFn("loading...", tiptype_loading)
          provider.waitForTransaction(getfundTx.hash).then((receipt) => {
          console.log("交易最终状态:", receipt);
          if (receipt.status == 1) {
            console.log("aaa")
            showTipViewFn("getfund success", tiptype_success)
          } else {
            showTipViewFn("getfund error", tiptype_warning)
            console.log("bbb")
          }
          setTimeout(function(){
            closeTipViewFn()
          },2000)
          }).catch((error) => {
            closeTipViewFn()
            console.error("监听交易时出错:", error);
          })
        }
      }
    } catch(error) {
      console.log("error333===", error)
    }
  }

  async function doRefundFn() {
     try {
      if (!window.ethereum) {
        showTipViewFn("请先连接钱包!", tiptype_warning)
        setTimeout(function(){
          tipShow.value = false
        },2000)
        return
      } 

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const account = await signer.getAddress()

      const contract =  new ethers.Contract(fundContract, fundContractAbi, signer);
      const refundTx = await contract.refund()
      if (refundTx.hash) {
        showTipViewFn("loading...", tiptype_loading)
        provider.waitForTransaction(refundTx.hash).then((receipt) => {
        console.log("交易最终状态:", receipt);
        if (receipt.status == 1) {
          showTipViewFn("refund success", tiptype_success)
        } else {
          showTipViewFn("refund error", tiptype_warning)
        }
        setTimeout(function(){
          closeTipViewFn()
        },2000)
        }).catch((error) => {
          closeTipViewFn()
          console.error("监听交易时出错:", error);
        })
      }
    } catch(error) {
      console.log("error333===", error)
    }    
  }

  async function refreshContractFund() {
    let provider =  ethers.getDefaultProvider("https://eth-sepolia.g.alchemy.com/v2/vX2726Xs95kD20sxRSF7J")
    let mycontract =  new ethers.Contract(fundContract, fundContractAbi, provider);
    let presentFundETH = ((await provider.getBalance(fundContract)).toString()/10 ** 18);
    let presentFundUSD = ((await mycontract.showFundBalanceTotalUsd()).toString()/10 ** 18).toFixed(2);
    fundDetail.value.presentFundETH = presentFundETH;
    fundDetail.value.presentFundUSD = presentFundUSD;
  }

  function transferTimestampToDatetime(timestamp) {
    let date = new Date(timestamp);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    return `${year}年/${month}月/${day}日 ${hour}时`;
  }
  
  function goBackPathFn () {
    window.history.back()
  }

  const dialogShow = ref(false)

  async function showFundDialogFn() {
    try {
      if (!window.ethereum) {
        showTipViewFn("请先连接钱包!", tiptype_warning)
        setTimeout(function(){
          tipShow.value = false
        },2000)
        return
      }else {
        dialogShow.value = true
      }
    }catch(error) {
      console.log("error==", error)
    }
  }

  function closeFundDialogFn() {
    dialogShow.value = false
  }

  const fundAmount = ref('');
  const fundValue = ref(0);
  let sumTimeout = null;

  function handleSwapAmountInputFn(event) {
    let ethValue = event.target.value;
    clearTimeout(sumTimeout);
    sumTimeout = setTimeout(() => {
      sumInputValueAmountFn(ethValue);
    }, 1000);
  }

  async function sumInputValueAmountFn(ethValue) {
    let repdata = await doGetRequest("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
    let sumUsdValue = 0
    if (repdata) {
      let eth_usd = repdata.ethereum.usd;
      sumUsdValue = (eth_usd * ethValue).toFixed(2);
    }
    fundValue.value = sumUsdValue;
    return sumUsdValue;
  }

  async function doClickComfirmFundFn() {
    let showTimeout = null;
    if (await sumInputValueAmountFn(fundAmount.value) < fundDetail.value.minFund) {
      console.log('less');
      showTipViewFn("please fund more amount!", tiptype_warning);
      showTimeout = setTimeout(() => {
        showTimeout = null;
        closeTipViewFn();
      }, 2000);
    }else {
      console.log('more');
      doFundOperate();
    }
  }

  async function doFundOperate() {
    try {
      if (!window.ethereum) {
        showTipViewFn("请先连接钱包!", tiptype_warning)
        setTimeout(function(){
          console.log('hhhhh====')
          tipShow.value = false
        },2000)
        return
      } 

      showTipViewFn("loading...", tiptype_loading);

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const account = await signer.getAddress()

      console.log('account====', account)
      const contract =  new ethers.Contract(fundContract, fundContractAbi, signer);
      const amountToSend = ethers.parseEther(fundAmount.value);
      contract.fund({ value: amountToSend })
      .then((tx) => tx.wait()) // 等待交易完成并获取交易收据
      .then((receipt) => {
        console.log("Receipt====", receipt);
        console.log(`Transaction Receipt: ${JSON.stringify(receipt)}`);
        if (receipt.status == 1) {
          showTipViewFn("fund success", tiptype_success);
          closeFundDialogFn();
          refreshContractFund();
        } else {
          showTipViewFn("fund error", tiptype_warning);
        }
        setTimeout(function(){
          closeTipViewFn();
        },2000)
      })
      .catch((error) => {
        closeTipViewFn();
      });
    } catch(error) {
      console.log("error333===", error)
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

  function closeTipViewFn() {
    tipShow.value = false;
  }
</script>

<template>
<div>
  <ShowTipView :tiptext="tiptext" :tiptype="tiptype" :isShow="tipShow"></ShowTipView>
  <div class="detailBox">
    <p class="goBackView" @click="goBackPathFn">< Back</p>
    <div class="detailMsgBox">
      <img class="detailImg" v-lazy="musicMetadata.image_url"></img>
      <div class="detailTxtBox">
        <div class="flex_spacebetween_center">
          <p style="font-size: 20px; color: black; font-weight: bold;">Introduce</p>
          <p v-if="activityStatus==1" class="activityStatusView">活动倒计时:  {{activityCount.days}}天-{{activityCount.hours}}时:{{activityCount.minutes}}分:{{activityCount.seconds}}秒</p>
          <p v-if="activityStatus==2" class="activityStatusView">活动已结束</p>
        </div>
        <div class="flex_row_center" style="margin-top: 12px;">
          <p class="txtLeft">歌曲: </p>
          <p class="txtRight">{{musicMetadata.song}}</p>
        </div>
        <div class="flex_row_center" style="margin-top: 6px;">
          <p class="txtLeft">歌手: </p>
          <p class="txtRight">{{musicMetadata.singer}}</p>
        </div>
        <div class="flex_row_center" style="margin-top: 6px;">
          <p class="txtLeft">创建日期: </p>
          <p class="txtRight">{{fundDetail.createDate}}</p>
        </div>
        <div class="flex_row_center" style="margin-top: 6px;">
          <p class="txtLeft">结束日期: </p>
          <p class="txtRight">{{fundDetail.endDate}}</p>
        </div>
        <div class="flex_row_center" style="margin-top: 6px;">
          <p class="txtLeft">目标筹集: </p>
          <p class="txtRight">{{fundDetail.targetFund}} USD</p>
        </div>
        <div class="flex_row_center" style="margin-top: 6px;">
          <p class="txtLeft">目前筹集: </p>
          <p class="txtRight">{{fundDetail.presentFundETH}} ETH (≈{{fundDetail.presentFundUSD}} USD)</p>
        </div>
        <div class="flex_row_center" style="margin-top: 6px;">
          <p class="txtLeft">最低捐筹: </p>
          <p class="txtRight">{{fundDetail.minFund}} USD</p>
        </div>
        <button class="operateBtn" style="background: #13227a;" v-if="showOperateBtn.fundBtn" @click="showFundDialogFn">
          Fund
        </button>
        <button class="operateBtn" style="background: red;" v-if="showOperateBtn.getfundBtn"  @click="doGetFundFn()">
          getFund
        </button>
        <button class="operateBtn" style="background: orange;" v-if="showOperateBtn.refundBtn" @click="doRefundFn()">
          refund
        </button>
      </div>
    </div>

    <div class="regularBox">
      <p style="font-size: 20px; color: black; font-weight: bold;">regular</p>
      <p style="margin-top: 12px;">1. 该活动交易为测试展示所用，没有任何经济价值</p>
      <p style="margin-top: 6px;">2. 该活动是为歌手发行新歌宣传筹集的资金，在活动倒计时内可以捐献相应金额的代币</p>
      <p style="margin-top: 6px;">3. 当在活动期间筹集超过所需的金额，用户筹集的总费用可让歌曲筹集发行者领走去制作歌曲，而质押了代币的用户
        可以mint一张筹集NFT, 等待后期该筹集歌曲发行成功后可burn掉筹集NFT获取音乐NFT, 筹集NFT支持发送或交易
      </p>
      <p style="margin-top: 6px;">4. 当在活动结束后, 筹集的总金额不达到预期目标时, 用户可以领取回之前捐献的代币</p>
    </div>
  </div>

  <div class="fundDialogBox" v-if="dialogShow">
    <div class="fundDialog">
      <div class="dialogTitleBox">
        <p style="font-size: 20px; font-weight: bold;">
          Fund
        </p>
        <img class="deleteBtnImg" src="../assets/images/delete.png" @click="closeFundDialogFn()"/>
      </div>

      <div class="selectInputBox">
        <div class="flex_row_center">
          <p style="margin-right:10px;">Token:</p>
          <select class="selectToken">
            <option>ETH</option>
          </select>
        </div>
        
        <div class="flex_row_center">
           <p style="margin-right:10px;">Amount:</p>
          <input class="amountInput" placeholder="0" @input="handleSwapAmountInputFn" v-model="fundAmount">
          </input>
        </div>
      </div>

      <div style="margin-left: 30px; margin-top:20px;" class="flex_row_center">
        <p>Fund Value:</p>
        <p style="color: red; margin-left: 6px;">{{fundValue}} USD</p>
      </div>

      <div class="comfirmBtn" @click="doClickComfirmFundFn()">Confirm</div>
    </div>
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
  flex-wrap: wrap;
}

.txtLeft {
  display: block;
  width: 80px;
}

.txtRight {
  display: block;
  width: 200px;
}

.detailImg {
  width: 500px;
  height: 300px;
  margin-right: 50px;
  background-image: url('../assets/images/bg_fund.png');
  background-size: cover;
}

.detailTxtBox {
  position: relative;
  padding: 10px;
  width: 500px;
  height: 300px;
  border-width: 2px;
  border-style: solid;
  border-color: gray;
}

.activityStatusView {
  display: block;
  padding: 4px 10px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
}

.operateBtn {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 100px;
  height: 40px;
  color: white;
}

.regularBox {
  margin-top: 40px;
  width: 640px;
}

.fundDialogBox {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  background-color: rgba(19, 13, 13, 0.6);
}

.fundDialog {
  position: relative;
  width: 500px;
  height: 240px;
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

.selectInputBox{
  display: flex;
  width: 500px;
  height: 30px;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
}

.selectToken {
  width: 100px;
  height: 30px;
  border-style: solid;
  border-color: gray;
  border-width: 1px;
}

.amountInput {
  width: 100px;
  height: 30px;
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
</style>