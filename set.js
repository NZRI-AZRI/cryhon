/*
{
  "name": "Crypto-bon(Crybon)",
  "version": "1.0.0",
  "description": "Local app of [web3-otp-contents-viewer]",
  "main": "main.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": ["web3","otp","contents","viewer"],
  "author": {
    "name": "Katusya Nishizawa",
    "email": "nzri2azri@gmail.com",
    "url": "https://github.com/NZRI-AZRI"
  },
  "license": "UNLICENSED"
}wss://rinkeby.infura.io/ws/v3/39a7b8b9d7924f8398627a6fccb53bab
*/

//宣言
let privateKey;
var web3prov;

//セッションストレージ初期化
sessionStorage.setItem('web3prov',   0 );
sessionStorage.setItem('privateKey@',0 );


var now = new Date();


/*without metamask . private key only.*/
//set key and web3 provider
window.setKey = async () => {

    web3prov = document.getElementById("web3prov1").value;
    if (!web3prov){
            return window.alert("web3prov1 is empty")
    }
    console.log('web3 prov URI saved');
    
    privateKey = document.getElementById("privateKey1").value;
    if (!privateKey){
            return window.alert("key is empty")
    }
    console.log('privateKey saved');

    //sessionStrage save (privateKey , web3 provider URI)
    sessionStorage.setItem('web3prov',    web3prov  );
    sessionStorage.setItem('privateKey@', privateKey);
};

//goto otp page
window.gotoOtp = async () => {
    //ページ遷移
    window.location.href = './otp.html'; 
}

/*
//next page otphtml,otpjs. 
window.addEventListener('load', async function() {
    let web3prov = sessionStorage.getItem('web3prov');
    web3 = new Web3(new Web3.providers.HttpProvider(web3prov));
});
*/

/*
//------------------------------------------------
//Author
//1.Code by NZRI. Katsuya Nishizawa.
//2020-07-12
//------------------------------------------------
*/
