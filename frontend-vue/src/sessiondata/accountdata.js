export function setTabarIndex(index){
    window.sessionStorage.setItem('tabarIndex',index)
}

export function getTabarIndex(){
    let tabarIndex = window.sessionStorage.getItem('tabarIndex')
    return tabarIndex? tabarIndex : 1
}

export function setWalletProvider(provider) {
    provider_stringfy = JSON.stringify(provider)
    window.sessionStorage.setItem('provider',provider_stringfy)
}

export function getWalletProvider() {
    let provider_stringfy= window.sessionStorage.getItem('provider')
    return JSON.parse(provider_stringfy)
}

export function setWalletSigner(signer) {
    signer_stringfy = JSON.stringify(signer)
    window.sessionStorage.setItem('signer',signer_stringfy)
}

export function getWalletSigner() {
    let singer_stringfy= window.sessionStorage.getItem('signer')
    return JSON.parse(singer_stringfy)
}