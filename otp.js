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
let prov = sessionStorage.getItem('prov');

//rinkeby contract
const geneContractAddress = "0x300bEDdBf16F121F7A8D8572cA83b4ec6aA483F1";
const authContractAddress = "0x1Ed13902e42592f8a3631793D39B74e48aA6D558";
// ブロックチェーンにデプロイしたスマートコントラクトのアドレス 固定。




//var provider;//ether js provider
//var signer ;//ether js signer

let account ;//coinbase
let myAccount;//eth address
let wallet;//ethers wallet

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


// A Web3Provider wraps a standard Web3 provider, which is
// what Metamask injects as window.ethereum into each page
const provider = new ethers.providers.Web3Provider(window.ethereum)

// The Metamask plugin also allows signing transactions to
// send ether and pay to change state within the blockchain.
// For this, we need the account signer...
const signer = provider.getSigner()


/*private key only.*/
//init　初期化
window.initApp = async () => {

        /*
          //wssプロバイダセット
          //provider =  ethers.WebSocketProvider(prov);
          //console.log(provider);

          //httpは非推奨、wssを利用 wss://xxxxxx/yyyyyy/zzzzzzzzzzzzz --- infra 検証済
          alchemy	  // Alchemy API Token	 WebSocket
          etherscan	// Etherscan API Token	 
          infura	  // INFURA Project ID or ProjectID and Project Secret	 WebSocket (like this wss://mainnet.infura.io/ws/v3/39a7b8b9d7924f8398xxxxxxxxxxxxab)
          quorum	  // The number of backends that must agree (default: 2 for mainnet, 1 for testnets)
        */

        //set " private key - provider "
        //simple ----> ethers.getDefaultProvider( [ network , [ options ] ] ) ⇒ Provider
        //new ethers.providers.Web3Provider( externalProvider [ , network ] )
        //new ethers.provider.WebSocketProvider( [ url [ , network ] ] )
        //ethers.provider.WebSocketProvider---> If url is unspecified, the default "ws://localhost:8546" will be used. If network is unspecified, it will be queried from the network.


    

        /*        
        //siner
        signer = new ethers.Wallet( privateKey, provider );
        console.log(signer);
        //wallet----> ExternallyOwnedAccount and Signer の継承クラス。
        wallet = ethers.Wallet( privateKey, provider );//provider connected wallet , unlocked private key.
        console.log(wallet);
        console.log(wallet.mnemonic); //display mnemonic
        */        
       
        /*
        // Create a wallet instance from a mnemonic...
        example from ethers-official-page...
          mnemonic = "announce room limb pattern dry unit scale effort smooth jazz weasel alcohol"
          walletMnemonic = Wallet.fromMnemonic(mnemonic)
          wallet = walletMnemonic.connect(provider)
        */


        // JSONを再びオブジェクトデータの形式に変換
        console.log('myAccount' , signer.getAddress() );
        //console.log('public-key' , wallet.publicKey );

        document.getElementById("key2adr").innerText = signer.getAddress();
        document.getElementById("g-cont").innerText = geneContractAddress;
        document.getElementById("a-cont").innerText = authContractAddress;
    
        //create instance.  new ethers.Contract( address , abi , signerOrProvider )
        geneInstance = new ethers.Contract( geneContractAddress , abigene , signer );
        authInstance = new ethers.Contract( authContractAddress , abiauth , signer );

        /*
        ***example 
          // Read-Only; By connecting to a Provider, allows:
          // - Any constant function
          // - Querying Filters
          // - Populating Unsigned Transactions for non-constant methods
          // - Estimating Gas for non-constant (as an anonymous sender)
          // - Static Calling non-constant methods (as anonymous sender)
          const erc20 = new ethers.Contract(address, abi, provider);

          // Read-Write; By connecting to a Signer, allows:
          // - Everything from Read-Only (except as Signer, not anonymous)
          // - Sending transactions for non-constant functions
          const erc20_rw = new ethers.Contract(address, abi, signer)
        */
};

//load
window.addEventListener('load', async function() {
/*
    //key prov が設定されているか？
    if (!privateKey){
        return window.alert("key is empty")
    }
    if (!prov){
        return window.alert("prov is empty")
    }
*/
    //初期化
    initApp();
});

//Auto login  TOTP 7number  
window.autoLoginBy7num = async () => {

	let nftid = document.getElementById("nftidtoknowotp4").value;
  
	if (!nftid){
	  return window.alert("nftid is empty")
	}
	let otp7num = await geneInstance.getTotpRn7Num(nftid);

	let authResult = false ;

	authResult =  await authInstance.authTotpRn7Num(signer.getAddress(), nftid, otp7num);
	console.log('auth Result is ', authResult);

	if (authResult == true) {
		//セッション記録trueフラグを保存。遷移先のページがあるとき、そこで使う。
		sessionStorage.setItem('authResult', 1 );
		sessionStorage.setItem('myAccount', signer.getAddress() );
		//ページ遷移
		window.location.href = './book/bon.html'; 
		return false;	
	}
}

/*

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
    let resOtp = await geneInstance.getConstOtp(nftIdGetOtp);
  
    document.getElementById("showGetYourOTP1").innerText = resOtp;
    document.getElementById("youraddress11").innerText = signer.getAddress();
  
    //contract name , contract address
    let conName =  await geneInstance.name();
    document.getElementById("contractname").innerText = conName;
    document.getElementById("contractAdr").innerText = geneContractAddress;

    //現在ネットワーク情報
    console.log("net-name",provider.network.name) ;
    console.log("net-id",provider.network.chainId) ;
    
    let netId  =  provider.network.chainId  ;
    document.getElementById("netid").innerText = netId;


    //現在ブロック情報
    let bn1  =  provider.block.number;    //otp取得時のブロック番号取得
    document.getElementById("netBn").innerText =  bn1;
    console.log("bn1",bn1);
    console.log("blockNumber",provider.block.number);
    console.log("block-hash",provider.block.hash) ;

    console.log("block-time-stamp",provider.block.timestamp);
  
    //playing card data
    let idToPlayingCard =  await geneInstance.idToPlayingCard(nftIdGetOtp);
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
      let text1 = signer.getAddress()+'-'+nftIdGetOtp+'-'+resOtp; //アドレス-トークンID-OTPの順にQRコードに書き出し。 '-'は区切り文字。
      
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
  
    authResult =  await authInstance.authConstOtp(signer.getAddress(), nftid2auth, otp2auth);
    console.log('auth Result is ', authResult);
  
    document.getElementById("showAuthResult1").innerText = authResult;
  
      //入り口のページに既にコンテンツデータがロードされてしまうので、ページ遷移機能を実装。
      if (authResult == true) {
          //セッション記録
          //sessionStorage.getItem('key') 取得
          //sessionStorage.setItem('key', 'value');
          //trueフラグを保存。遷移先のページがあるとき、そこで使う。
          sessionStorage.setItem('authResult', 1 );
          sessionStorage.setItem('myAccount', signer.getAddress() );
  
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
      let result2 = await geneInstance.getTotpRn7Num(nftidtoknowotp);
      
      //totp取得時のブロック番号取得
      let bn  =  provider.block.number;
      //アクセスしているネットワークの情報
      let netId  =  provider.network.chainId ;
      //UNIXベース年月日・時刻を取得
      let nowUnixTime = now.toLocaleString();
  

    //現在ネットワーク情報
    console.log("net-name",provider.network.name) ;
    console.log("net-id",provider.network.chainId) ;
    
    document.getElementById("netid").innerText = netId;


    //現在ブロック情報
    let bn1  =  provider.block.number;    //otp取得時のブロック番号取得
    document.getElementById("netBn").innerText =  bn1;
    console.log("bn1",bn1);

    console.log("blockNumber",provider.block.number);
    console.log("block-hash",provider.block.hash) ;
    console.log("block-time-stamp",provider.block.timestamp);

      document.getElementById("showGetYourOTP3").innerText = result2;
      document.getElementById("youraddress13").innerText = signer.getAddress();
    
      //contract name
      let result11 =  await geneInstance.name();
      document.getElementById("contractname3").innerText = result11 + '-' + geneContractAddress;
  
      //QR code totp   text2はアドレス-トークンID-OTPの順にQRコードに書き出し。 '-'は区切り文字。
      //ETHアドレス、tokenId、totpOtpCode、ブロックナンバー、現在のブロック時間、台帳ネットワークID、ユーザーIPアドレス
      let el = document.getElementById('qrcode3');
      let text2 = signer.getAddress() + '-' + nftidtoknowotp + '-' + result2 + '-'+ bn +'-' + netId + '-' + nowUnixTime ; 
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
      authResult =  await authInstance.authTotpRn7Num(signer.getAddress(), nftid2auth, otp2auth);
      console.log('auth Result is ', authResult);
      document.getElementById("showAuthResult3").innerText = authResult;
      if (authResult == true) {
          //セッション記録trueフラグを保存。遷移先のページがあるとき、そこで使う。
          sessionStorage.setItem('authResult', 1 );
          sessionStorage.setItem('myAccount', signer.getAddress() );
          //ページ遷移
          window.location.href = './book/bon.html'; 
          return false;	
      }
  }


  */



/*
//------------------------------------------------
//Author
//1.Code by NZRI. Katsuya Nishizawa.
//2020-07-23
//------------------------------------------------
*/

