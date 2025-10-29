import { ethers } from 'ethers'
import { 
  setConnectedStatus, 
  getConnectedStatus, 
  setConnectingStatus, 
  getConnectingStatus, 
  setConnectAccount,
  setConnectChainId,
  getConnectChainId
} from '../sessiondata/accountdata.js'

export const checkConnection = async() => {
    if (!window.ethereum) return
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' })
      if (accounts.length > 0) {
        // await connect()
        setConnectedStatus(true)
        setConnectAccount(accounts[0])
      }
    } catch (err) {
      console.error('检查连接状态失败:', err)
    }
}

export const connect = async() => {
  if (getConnectingStatus()) {
    return
  }
  setConnectingStatus(true)
  try {
    // const success = await connectWallet()
    // if (success) {
    //   setConnectedStatus(true)
    // }
    await connectWallet()
  } catch (error) {
    console.error('连接错误:', error)
  } finally {
      setConnectingStatus(false)
  }
}

export const connectWallet = async() => {
  if (!window.ethereum) {
    alert('请安装 MetaMask 钱包!')
    throw new Error('请安装 MetaMask!')
  }

  try { 
    // 请求账户访问
    await window.ethereum.request({ method: 'eth_requestAccounts' })

    // 使用 ethers v6 的 BrowserProvider (修复了 #notReady 问题)
    const provider = new ethers.BrowserProvider(window.ethereum)

    // 获取签名者
    const signer = await provider.getSigner()
    const account = await signer.getAddress()
    setConnectAccount(account)
      
      // 获取网络信息
    const network = await provider.getNetwork()
    const chainId = Number(network.chainId)
    setConnectChainId(chainId)

    setConnectedStatus(true)
      
    return true
  } catch (error) {
    setConnectedStatus(false)
    console.error('连接失败:', error)
    throw error
  } finally {
    setConnectingStatus(false)
  }
}

export const switchSepoliaChain = async() => {
  if (window.ethereum) {
    window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0xaa36a7' }],
    }).catch((switchError) => {
      if (switchError.code === 4902) {
        window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0xaa36a7', // sepolia 的 chainId
              chainName: 'Sepolia',
              rpcUrls: ['https://eth-sepolia.g.alchemy.com/v2/vX2726Xs95kD20sxRSF7J'],
            },
          ],
        });
      }
    });
  }
}
