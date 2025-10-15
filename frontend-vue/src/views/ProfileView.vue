<script setup>
  import { ref, onMounted, defineAsyncComponent } from 'vue'
  import { ethers } from 'ethers'
  import { wmcTokenContract } from '../customdata/web3data'
  import { wmcTokenContractAbi } from '../contractABI/myTokenAbi'

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
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const account = await signer.getAddress()

      let ethBalance = await provider.getBalance(account);
      let ethValue = ethers.formatEther(ethBalance);

      let mycontract =  new ethers.Contract(wmcTokenContract, wmcTokenContractAbi, provider);
      let wmcBalance = await mycontract.balanceOf(account);
      let wmcValue = ethers.formatEther(wmcBalance)

      linkAccount.value = {
        account: account,
        ethValue: ethValue,
        wmcValue: wmcValue
      }

      initLoadComponet();

    } catch(error) {
      console.log("onMounted error==", error)
    }
  })
  
  const tabIndex = ref(1);
  const currentTabComponent = ref(null);

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

</script>

<template>
  <div class="profileBox">
    <p class="goBackView" @click="goBackPathFn">< Back</p>
    <div class="acTokenBox flex_column">
      <p style="text-align: center;" class="big_bold_text border_bottom_solid">Profile</p>
      <p class="acTxt">Account: {{linkAccount.account}}</p>
      <div class="flex_row_center">
        <div class="actokenItem flex_row_center">
          <p style="font-size: 16px; color: red;">ETH: </p> <p>{{linkAccount.ethValue}}</p>
        </div>

        <div class="actokenItem flex_row_center">
          <p style="font-size: 16px; color: red;">WMC: </p> <p>{{linkAccount.wmcValue}}</p>
        </div>
      </div>
    </div>

    <div class="tabBox flex_row_center">
      <p :class="['tabItem', tabIndex==1?'tabSelectItem':'tabNormalItem']" @click="doChangeTabFn(1)">my NFT</p>
      <p :class="['tabItem', tabIndex==2?'tabSelectItem':'tabNormalItem']" @click="doChangeTabFn(2)">my Fund</p>
    </div>

    <div class="tabContain">
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

.goBackView {
  width: 100px;
  height: 40px;
  font-weight: bold;
  font-size: 16px;
}

.acTokenBox {
  width: 600px;
  padding: 0 20px;
  margin: 0px auto;
  border-style: solid;
  border-width: 2px;
  border-color: gray;
}

.acTxt {
  display: block;
  height: 40px;
  line-height: 40px;
}

.actokenItem {
  width: 300px;
  height: 40px;
}

.tabBox {
  margin: 50px auto 10px;
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
  margin-top: 20px;
}
</style>