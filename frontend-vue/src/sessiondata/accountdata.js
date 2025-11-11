export function setTabarIndex(index){
    window.sessionStorage.setItem('tabarIndex',index)
}

export function getTabarIndex(){
    let tabarIndex = window.sessionStorage.getItem('tabarIndex')
    return tabarIndex? tabarIndex : 1
}

export function setConnectedStatus(status) {
    window.sessionStorage.setItem('isConnected', status)
}

export function getConnectedStatus() {
    const isConnected = window.sessionStorage.getItem('isConnected')
    return (isConnected==null||isConnected==''||isConnected=='false')? false : true
}

export function setConnectAccount(account) {
    window.sessionStorage.setItem('account', account)
}

export function getConnectAccount() {
    return window.sessionStorage.getItem('account')
}