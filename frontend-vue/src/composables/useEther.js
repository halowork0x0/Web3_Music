import { ethers } from 'ethers'
import { 
  setConnectedStatus, 
  getConnectedStatus, 
  setConnectAccount,
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
  try {
    await connectWallet()
  } catch (error) {
    console.error('连接错误:', error)
  } 
}

export const connectWallet = async() => {
  if (window.ethereum) {
    // 检查当前网络是否为Sepolia或主网，如果不是，则尝试切换网络
    await window.ethereum.request({ method: 'net_version' })
    .then(async(networkId) => {
      const isSepolia = networkId === "11155111"; // Sepolia的Chain ID是11155111
      if (!isSepolia) {
      await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xaa36a7' }] 
        }).then(async()=>{
          await setBrowserAccountConnectedMsg();
        })
        .catch((switchError) => {
          // 处理用户拒绝切换或未安装MetaMask的情况
          if (switchError.code === 4902) { // 用户拒绝了网络切换请求（不被允许）
            console.error('Please add Sepolia Testnet to MetaMask.'); // 提示用户添加网络
          } else { // 其他错误处理逻辑
            console.error('Error switching network:', switchError);
          }
        });
      } else { // 如果已经在正确的网络，直接连接钱包
      await window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(async() => {
          await setBrowserAccountConnectedMsg()
        })
        .catch(error => {
          setConnectedStatus(false)
          console.error("Wallet connection error:", error);
        });
      }
  });
  } else { // 没有检测到MetaMask或其他钱包扩展的情况处理逻辑
    alert('请安装 MetaMask 钱包!')
    throw new Error('请安装 MetaMask!')
  }
}

export const setBrowserAccountConnectedMsg = async()=>{
  const provider = new ethers.BrowserProvider(window.ethereum)
  const signer = await provider.getSigner()
  const account = await signer.getAddress()
  setConnectAccount(account)
  setConnectedStatus(true)
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
