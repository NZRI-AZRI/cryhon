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
}
*/


/* 変数宣言初期化 */
//sessionStrageから代入
let privateKey= sessionStorage.getItem('privateKey@');
let web3prov = sessionStorage.getItem('web3prov');

//rinkeby contract
const geneContractAddress = "0x300bEDdBf16F121F7A8D8572cA83b4ec6aA483F1";
const authContractAddress = "0x1Ed13902e42592f8a3631793D39B74e48aA6D558";
// ブロックチェーンにデプロイしたスマートコントラクトのアドレス 固定。
//setページで記入させてもいいし、固定してバイナリ化して実行ファイル化してもいい。
//setで変えられるときは汎用性は上がるが誤ったコントラクトアドレスを記入する恐れも出る。
//仮に小説本を出すとすると、コントラクトアドレスは変わりないので以下の様に固定していいハズ。
//もしコンテンツの定性をするなら実行ファイルのverを変えるかアプリとコントラクトアドレスごと変えてしまえばいい。

let web3;
let account ;//coinbase
let myAccount;//eth address
let wallet;

var nonceCount; //nonnce (global var)
var gasPri;
var gasLim;

let geneInstance; // instance
let authInstance; // instance

var qrcode1;//QR code instance
var qrcodeCount1 = 0;
var qrcode2;//totp QR code instance
var qrcodeCount2 = 0;
var qrcode3;
var qrcodeCount3 = 0;

sessionStorage.setItem('authResult', 0 );//auth result セッションストレージ初期化
sessionStorage.setItem('myAccount', 0 );

var now = new Date();


//general function===================
function copyPopUp(){
	window.alert("コピーしました");
}

//otpコードのクリップボードコピー関数 
window.clipBoardWrite = async (docIdText) => {
	let id = docIdText;
	let otp = document.getElementById(id).innerText;
	//console.log(otp);
	await navigator.clipboard.writeText(otp);
	copyPopUp();
}


//web3 function===================

/*private key only.*/
//init　web3 初期化
window.initApp = async () => {

        // privateKeyをインポート
        account = web3.eth.accounts.privateKeyToAccount(privateKey);
        console.log(account)
        // JSONを再びオブジェクトデータの形式に変換
        myAccountAdr = account.address;
        myAccount = account.address;

        console.log('myAccount' , myAccountAdr );
        document.getElementById("key2adr").innerText = myAccountAdr;
        document.getElementById("g-cont").innerText = geneContractAddress;
        document.getElementById("a-cont").innerText = authContractAddress;
    
        //instance
        geneInstance = new web3.eth.Contract(abigene, geneContractAddress);
        authInstance = new web3.eth.Contract(abiauth, authContractAddress);
};

//load
window.addEventListener('load', async function() {
    //key prov が設定されているか？
    if (!privateKey){
        return window.alert("key is empty")
    }
    if (!web3prov){
        return window.alert("web3prov is empty")
    }
    
    //初期化
    initApp();

    //wssプロバイダセット
    web3 = new Web3(new Web3.providers.WebsocketProvider(web3prov));

    /*
    //httpはweb3 公式では非推奨、wssを利用
      //wssプロバイダセット
      web3 = new Web3(new Web3.providers.WebsocketProvider(web3prov)); 
      web3 = new Web3(new Web3.providers.HttpProvider(web3prov));
    
      //chainstack 未検証
      https://docs.chainstack.com/operations/ethereum/tools#web3-js
      const web3 = new Web3(new Web3.providers.WebsocketProvider('wss://USERNAME:PASSWORD@WSS_ENDPOINT'));

      //INFLA 検証済
      https://infura.io/
      web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/39a7b8b9d7924f8398627a6fccb53bab'));
      web3 = new Web3(new Web3.providers.HttpProvider('wss://rinkeby.infura.io/ws/v3/39a7b8b9d7924f8398627a6fccb53bab'));
    */
});

//Auto login  TOTP 7number  
window.autoLoginBy7num = async () => {

	let nftid = document.getElementById("nftidtoknowotp4").value;
  
	if (!nftid){
	  return window.alert("nftid is empty")
	}
	let otp7num = await geneInstance.methods.getTotpRn7Num(nftid).call({from: myAccount});

	let authResult = false ;

	authResult =  await authInstance.methods.authTotpRn7Num(myAccount, nftid, otp7num).call({from: myAccount});
	console.log('auth Result is ', authResult);

	if (authResult == true) {
		//セッション記録trueフラグを保存。遷移先のページがあるとき、そこで使う。
		sessionStorage.setItem('authResult', 1 );
		sessionStorage.setItem('myAccount', myAccount );
		//ページ遷移
		window.location.href = './book/bon.html'; 
		return false;	
	}
}

/** 
 * otp getter setter 
*/
//getYourOTP   Only Owner can cahnge all OTP. 
window.getOtp = async () => {

    //Nft Id 取得
    let nftIdGetOtp = document.getElementById("nftidtoknowotp1").value;
    if (!nftIdGetOtp){
      return window.alert("nftid is empty")
    }
    document.getElementById("nftid1").innerText = nftIdGetOtp;
  
    //オーナー指示型OTP取得
    //ABIに記載の関数をコール。引数はtokenId   getConstOtp(uint256 tokenid) call returns bytes32
    let resOtp = await geneInstance.methods.getConstOtp(nftIdGetOtp).call({from: myAccount});
  
    document.getElementById("showGetYourOTP1").innerText = resOtp;
    document.getElementById("youraddress11").innerText = myAccount;
  
    //contract name , contract address
    let conName =  await geneInstance.methods.name().call();
    document.getElementById("contractname").innerText = conName;
    document.getElementById("contractAdr").innerText = geneContractAddress;
    //アクセスしているネットワークの情報
    let netId  =  await web3.eth.net.getId() ;
    document.getElementById("netid").innerText = netId;
  
    //otp取得時のブロック番号取得
    let bn1  =  await web3.eth.getBlockNumber() ;
    document.getElementById("netBn").innerText =  bn1;
    console.log(bn1);
  
    //playing card data
    let idToPlayingCard =  await geneInstance.methods.idToPlayingCard(nftIdGetOtp).call({from: myAccount});
    console.log(idToPlayingCard);
  
    console.log("cardSuits",idToPlayingCard.cardSuits);
    console.log("cardNumber",idToPlayingCard.cardNumber);
    console.log("cardData",idToPlayingCard.cardData);
    
    document.getElementById("idToCard4Suit1").innerText = idToPlayingCard.cardSuits;
    document.getElementById("idToCardNumber1").innerText = idToPlayingCard.cardNumber;
    document.getElementById("idToCardData1").innerText = idToPlayingCard.cardData;
  
      //QR code に埋め込みできるアクセス者ロケーション情報
      //QR code otp
      let el = document.getElementById('qrcode1');
      
      //let text1 = 'BNOTP:'+myAccount+'-'+nftIdGetOtp+'-'+resOtp; //アドレス-トークンID-OTPの順にQRコードに書き出し。 '-'は区切り文字。
      let text1 = myAccount+'-'+nftIdGetOtp+'-'+resOtp; //アドレス-トークンID-OTPの順にQRコードに書き出し。 '-'は区切り文字。
      
      console.log(text1);
      
      if (qrcodeCount1 < 1){
          qrcode1 = new QRCode(el, text1);	
      }else if (qrcodeCount1 >= 1){
          qrcode1.makeCode(text1); // make another code.
      }
      qrcodeCount1 = qrcodeCount1 + 1 ;
      document.getElementById("qrcode1time").innerText = 'QRコードを表示しました。' ;	
      console.log(qrcodeCount1);
    
  };
  
  
  //Auth your OTP  
  window.authOtp = async () => {
  
    let nftid2auth = document.getElementById("nftid2auth1").value;
    if (!nftid2auth){
      return window.alert("nftid is empty")
    }
    let otp2auth = document.getElementById("otp2auth1").value;
    if (!otp2auth){
      return window.alert("otp is empty")
    }
    
    let authResult = false ;
  
    authResult =  await authInstance.methods.authConstOtp(myAccount, nftid2auth, otp2auth).call({from: myAccount});
    console.log('auth Result is ', authResult);
  
    document.getElementById("showAuthResult1").innerText = authResult;
  
      //入り口のページに既にコンテンツデータがロードされてしまうので、ページ遷移機能を実装。
      if (authResult == true) {
          //セッション記録
          //sessionStorage.getItem('key') 取得
          //sessionStorage.setItem('key', 'value');
          //trueフラグを保存。遷移先のページがあるとき、そこで使う。
          sessionStorage.setItem('authResult', 1 );
          sessionStorage.setItem('myAccount', myAccount );
  
          //ページ遷移
          window.location.href = './book/bon.html'; 
          //window.open('./contents.html', '_blank');
          return false;	
      }
  
  };
  
  
  //Get your TOTP 7number
  window.getTotp7num = async () => {
      let nftidtoknowotp = document.getElementById("nftidtoknowotp3").value;
    
      if (!nftidtoknowotp){
        return window.alert("nftid is empty")
      }
      document.getElementById("nftid3").innerText = nftidtoknowotp;
    
      //ABIに記載のtotp関数をコール。引数はtokenId   getYourOTP(uint256 tokenid) call returns bytes32
      //getYourTotp7Num(id)　もしくは　getYourTotp7NumRn(id)　が利用可能
      let result2 = await geneInstance.methods.getTotpRn7Num(nftidtoknowotp).call({from: myAccount});
      //totp取得時のブロック番号取得
      let bn  =  await web3.eth.getBlockNumber() ;
      //アクセスしているネットワークの情報
      let netId  =  await web3.eth.net.getId() ;
      //UNIXベース年月日・時刻を取得
      let nowUnixTime = now.toLocaleString();
  
      document.getElementById("showGetYourOTP3").innerText = result2;
      document.getElementById("youraddress13").innerText = myAccount;
    
      //contract name
      let result11 =  await geneInstance.methods.name().call();
      document.getElementById("contractname3").innerText = result11 + '-' + geneContractAddress;
  
      //QR code totp   text2はアドレス-トークンID-OTPの順にQRコードに書き出し。 '-'は区切り文字。
      //ETHアドレス、tokenId、totpOtpCode、ブロックナンバー、現在のブロック時間、台帳ネットワークID、ユーザーIPアドレス
      let el = document.getElementById('qrcode3');
      let text2 = myAccount + '-' + nftidtoknowotp + '-' + result2 + '-'+ bn +'-' + netId + '-' + nowUnixTime ; 
      console.log(text2);
      document.getElementById("qrcode3time").innerText = 'QRコードを表示しました。' + bn ;
      if (qrcodeCount3 < 1){
          qrcode3 = new QRCode(el, text2);	
      }else if (qrcodeCount3 >= 1){
          qrcode3.makeCode(text2); // make another code.
      }
      qrcodeCount3 = qrcodeCount3 + 1 ;
  }
  
  
  //Auth your TOTP 7number  
  window.authTotp7num = async () => {
      let nftid2auth = document.getElementById("nftid2auth3").value;
      if (!nftid2auth){
        return window.alert("nftid is empty")
      }
      let otp2auth = document.getElementById("otp2auth3").value;
      if (!otp2auth){
        return window.alert("otp is empty")
      }
      let authResult = false ;
      authResult =  await authInstance.methods.authTotpRn7Num(myAccount, nftid2auth, otp2auth).call({from: myAccount});
      console.log('auth Result is ', authResult);
      document.getElementById("showAuthResult3").innerText = authResult;
      if (authResult == true) {
          //セッション記録trueフラグを保存。遷移先のページがあるとき、そこで使う。
          sessionStorage.setItem('authResult', 1 );
          sessionStorage.setItem('myAccount', myAccount );
          //ページ遷移
          window.location.href = './book/bon.html'; 
          return false;	
      }
  }




/*
//------------------------------------------------
//Author
//1.Code by NZRI. Katsuya Nishizawa.
//2020-07-12
//------------------------------------------------
*/

