import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ethers } from 'ethers'

export function useWeb3() {
  const account = ref('')
  const chainId = ref(0)
  const isConnected = ref(false)
  const isConnecting = ref(false)
  let provider = null
  let signer = null
  

  const checkConnection = async() => {
    console.log('checkConnection==')
    if (!window.ethereum) return
    
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' })
      console.log('accounts==', accounts)
      if (accounts.length > 0) {
        await connect()
      }
    } catch (err) {
      console.error('检查连接状态失败:', err)
    }
  }

  const connect = async() => {
    if (isConnecting.value) return

    isConnecting.value = true
    try {
      console.log("000000==")
      const success = await connectWallet()
      if (success) {
        isConnected.value = true
      }
    } catch (error) {
      console.error('连接错误:', error)
    } finally {
      isConnecting.value = false
    }
  }

  const connectWallet = async() => {
    if (!window.ethereum) {
      alert('请安装 MetaMask 钱包!')
      throw new Error('请安装 MetaMask!')
    }
    try {
      
      // 请求账户访问
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      console.log("1111")

      // 使用 ethers v6 的 BrowserProvider (修复了 #notReady 问题)
      provider = new ethers.BrowserProvider(window.ethereum)
      console.log("2222====provider",provider)
      
      // 获取签名者
      signer = await provider.getSigner()
      account.value = await signer.getAddress()
      console.log("3333===singer",signer)
      
      // 获取网络信息
      const network = await provider.getNetwork()
      chainId.value = Number(network.chainId)
      
      return true
    } catch (error) {
      console.error('连接失败:', error)
      throw error
    }
  }

  const disconnect = () => {
    console.log('disconnect====')
    account.value = ''
    chainId.value = 0
    isConnected.value = false
  }

  onMounted(() => {
    checkConnection()
  })

  return {
    account,
    chainId,
    isConnected,
    isConnecting,

    checkConnection,
    connect,
    connectWallet,
    disconnect
  }
}