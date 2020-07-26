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
  "license": "non-free computer software"
}
*/


/* 変数宣言初期化 */
//sessionStrageから代入
let privateKey= sessionStorage.getItem('privateKey@');
let web3prov = sessionStorage.getItem('prov');

//コンテンツ
//コンテンツ固有の秘密シード値の例
const secretKey = "Cryhonbon:0x0723";

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

let ethersWallet;//ethers.js wallet 
// ウォレットを作成
ethersWallet = new ethers.Wallet(privateKey);
// ウォレットのアドレスを取得。web3で初期化しなくても秘密鍵からアドレス生成
myAccount = ethersWallet.address;
console.log("ethers-address:", myAccount);


let nftid;
let geneInstance; // instance
let authInstance; // instance

var qrcode1;//QR code instance
var qrcodeCount1 = 0;
var qrcode2;//totp QR code instance
var qrcodeCount2 = 0;
var qrcode3;
var qrcodeCount3 = 0;

sessionStorage.setItem('authResult', 0 );//auth result セッションストレージ初期化
sessionStorage.setItem('myAccount',  0 );
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
        //wssプロバイダセット
        web3 = new Web3(new Web3.providers.WebsocketProvider(web3prov));
        // privateKeyをインポート・セット
        account = web3.eth.accounts.privateKeyToAccount(privateKey);
        // JSONを再びオブジェクトデータの形式に変換
        myAccount = account.address;
        console.log('myAccount' , myAccount );
        document.getElementById("key2adr").innerText = myAccount;
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
		sessionStorage.setItem('authResult', 525600 );
    sessionStorage.setItem('myAccount'   , myAccount );

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
          sessionStorage.setItem('authResult', 525600 );
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
          sessionStorage.setItem('authResult', 525600 );
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
//2020-07-25
//------------------------------------------------
*/

//公示栞 生成部分===(秘密鍵とは異なり、公示されてもトークンにはアクセスされない鍵を栞とする。)
//book-mark file
async function downloadBookMarkFile() {

    let nftid = document.getElementById("nftidtoknowotp4").value;
    //ユーザーのアドレス nftid totp
    console.log('nft data is ', myAccount , nftid );

    //ABIに記載のtotp関数をコール。引数はtokenId 
    let totp7 = await geneInstance.methods.getTotpRn7Num(nftid).call({from: myAccount});

    let authResult = false ;
    authResult =  await authInstance.methods.authTotpRn7Num(myAccount, nftid, totp7).call({from: myAccount});
    console.log('auth Result is ', authResult);

    //認証結果が真のとき、署名してJSONファイルをダウンロード
    if (authResult == true) {
        //念のため"latest"な現在ブロック表示
        let authBlock = web3.eth.getBlock("latest");
        console.log('auth block data is ', authBlock);

        //ブロックチェーンID、認証時のブロック番号(totpブロック番号)、コントラクト情報
        let bn  =  await web3.eth.getBlockNumber() ;
        let netId  =  await web3.eth.net.getId() ;
        let contractName =  await geneInstance.methods.name().call();

        //コンテンツ
        //コンテンツ固有の秘密シード値の例
        let contentsKey = "CryhonISBN:0x300bEDdBf16F121F7A8D8572cA83b4ec6aA483F1";
        //冒頭で定義 secretKey = "Cryhonbon:0x0723";

        //既読のページの番号、セッション番号、時間数
        //このページのアドレス、PDFファイルの現在ページ、MP3-MP4ファイルなどの再生時刻最大値等を想定
        let pageNumber = 0;//このページは認証ページの為、ページ番号はゼロ。

        //閲覧した人の名前,
        let userName = "kn";
        //ユーザーの読書コメント、しおり
        let userComment = "OK...";
        //閲覧者、保有者の余白note
        let note = "cryhon-crybon_クリホンCryhonとクリボンCrybonは同じ";

        let timeSlicer = "TIME$";
        let time = now.toLocaleString();
        //UNIXベース年月日・認証時刻 64bit環境を使い、2038年問題を回避すること。Javascriptでは解決済み、geth-parity側はどうか？
        let times = timeSlicer + time + timeSlicer;

        //UNIXベース年月日・認証時刻にシークレットを加えた例　jsshaを使う。myAccountを含むこと。
        let timeSecret = myAccount + secretKey + time + geneContractAddress;
        //let timeSecret = secretKey + time + myAccount + nftid + totp7 + contractName + geneContractAddress;
        console.log(timeSecret);

        const shaObj = new jsSHA("SHA-512", "TEXT", { encoding: "UTF8" });
        shaObj.update(timeSecret);
        let hashSlicer = "HASH$";
        const timeSecretHash = hashSlicer + shaObj.getHash("HEX") + hashSlicer;
        console.log(timeSecretHash);

        var jsondata = {
            //contents viewer data
            "times"              : times, //unixTime of makingBookmarkFile
            "timeSecretHash"     : timeSecretHash, // ブックマークがアプリで発行されたものか検証するデータ
            "contentsKey"        : contentsKey, //コンテンツID　ISBNなど本のIDも可能
            "pageNumber"         : pageNumber,        
            "userName"           : userName,
            "userComment"        : userComment,
            "note"               : note,
            //auth totp data
            "user-eoa-address"   : myAccount,
            "nft-id"             : nftid, 
            "TOTP-7digit"        : totp7,     
            //auth block chain - contract data
            "contractName"       : contractName, 
            "netId"              : netId,//network data    
            "blockNumber"        : bn //time data
        }

        //sign データに署名。　設定画面、認証画面でこの公示栞データを外部から読み込めば簡易な閲覧が可能にする。
        //本来は右記のコードを使いたいが、諸事情により外部モジュールを使う。
        console.log('json data is ', jsondata);

        //let messageStr = JSON.parse(jsondata);
        let messageStr = JSON.stringify(jsondata);


        //web3で署名するとき
        /*
        //web3はネットワークがないと動かない恐れがある。なのでローカル用のライブラリでファイルを作りたい。
        let signatureObject = await web3.eth.accounts.sign(messageStr, privateKey);
        console.log('sign data(bookmark data) is ', signatureObject);
        */

        //HMAC - jsSHAで署名するとき
        const shaMesObj = new jsSHA("SHA-512", "TEXT", {
          hmacKey: { value: privateKey , format: "TEXT" },
        });
        shaMesObj.update(messageStr);
        const hmac = shaMesObj.getHash("HEX");
        
        //元の文書にHMACを添え、電子署名付き文章とする。RFC2104方式
        let signatureObject = messageStr +"$HMAC$"+ hmac ; 
        //"$HMAC$"区切
    
        //blob download
        var blob = new Blob(
          [JSON.stringify(signatureObject)],
          { type: 'application/json' }
        );
        console.log('blob is ', blob);

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.download = 'cryhonBookmark.json';
        a.href = url;
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }
}



window.getBookMarkFile = async () => {
  let nftid = document.getElementById("nftidtoknowotp4").value;
  if (!nftid){
    return window.alert("nftid is empty");
  }
  downloadBookMarkFile();
}


//公示栞読み込み部分uploadBookMarkFile 
//load csv inputfile (private key file and websocketURI)
var form = document.forms.myform;
form.myfile.addEventListener( 'change', function(e) {
 
    var result = e.target.files[0];
 
    //FileReaderのインスタンスを作成する
    var reader = new FileReader();
  
    //読み込んだファイルの中身を取得する
    reader.readAsText( result );
  
    //ファイルの中身を取得後に処理を行う
    reader.addEventListener( 'load', async function() {

      //jsSHAにより署名付きブックマークファイルを復号化する

        //変換する    
        console.log( JSON.parse(reader.result) );  
        let uploadFile = reader.result;
        let hmacSplit = uploadFile.split("$HMAC$");//"$HMAC$"で文字列分離
        
        let upMessage = hmacSplit[0];
        let upHmac = hmacSplit[1];

        //HMAC - jsSHA
        const shaMesObj = new jsSHA("SHA-512", "TEXT", {
          hmacKey: { value: privateKey , format: "TEXT" },
        });
        shaMesObj.update( upMessage );
        const mesHmac = shaMesObj.getHash("HEX");


        //文章全体のHmacが秘密鍵で復元出来るか確認
        if(upHmac = mesHmac){
            //time　を参照しtime hashを構築
            console.log( upMessage );

            //json.timesが使えないので文字をスライスしてtimes検索
            let timeSplit = upMessage.split("TIME$");//"TIME$"で文字列分離
            console.log( timeSplit );

            console.log( timeSplit[1] );
            let time = timeSplit[1];//時刻を取り出し

            //timeSecretを再構築する。myAccountを含むこと。
            let timeSecret = myAccount + secretKey + time + geneContractAddress;
            console.log(timeSecret);

            const shaObj = new jsSHA("SHA-512", "TEXT", { encoding: "UTF8" });
            shaObj.update(timeSecret);
            const timeSecretHash = shaObj.getHash("HEX") ;//HASH$は除く。

            //time hash　を参照
            //json.timesが使えないので文字をスライスしてtimes検索
            let hashSplit = upMessage.split("HASH$");//"HASH$"で文字列分離
            console.log( hashSplit );

            console.log( hashSplit[1] );
            let hash = hashSplit[1];//timeSecretHashを取り出し

            console.log(hash);
            console.log(timeSecretHash);

            //読み込まれたブックマーク内部の"timeSecretHash" と照合
            //照合結果が真ならば、ブックマークファイルはこのアプリで発行されたものと推測されるのでコンテンツ閲覧処理へ遷移
            if(hash == timeSecretHash){

              //セッション記録trueフラグを保存。遷移先のページがあるとき、そこで使う。
              sessionStorage.setItem('authResult', 10 );//10は分単位で10分しか読めない。正規ログインでは525600分で設定。
              sessionStorage.setItem('myAccount', myAccount );
              console.log( "auth is true." );  

              //ページ遷移
              window.location.href = './book/bon.html'; 
              return true;	
            }else{
              console.log( "auth is false." ); 
              return false;
            }
        }
    })
})




/**
 * 復号化した後の戻り値がアカウントと同じならば秘密鍵とブックマークファイルは一致しているのでnftの持ち主であったことが分かる。
 * 持ち主の栞を持っているので10分のログイン権限を付与する。
 * ただしブックマーク時間からかけ離れている場合には減らす。(10分/n年)の閲覧時間に制限する。
 * 仮想コンピュータやオフラインマシンでは時間を好きに設定できるはずだが、それでも10分が限界となる。
 * 10分以上読みたければ再度アプリを起動しないといけない。
 * 
 * この機能は本を所有するという点で重要。常に分散台帳ネットワークが稼働していないと本が読めないのは所有権を侵害しかねない。
 * 万一、例えば地震でネットワークが停電などで部分的に停止したとき、ノートパソコンから見たい本を見ようとしたとき、
 * 秘密鍵は持っていて、本のデータはアプリに入っているのに本が見れないということになる。
 * 
 * それを解決するため、正常時に分散台帳ネットワークにログインしたとき、ブックマークファイルを作成し、
 * [秘密鍵、ブックマークファイル、アプリ] の３つをセットでPCに保存してもらうことでオフラインでも閲覧できるようにする。
 * 
 * 緊急時に書物をある部分だけ読みたいときに使える試し読み機能である。
 * この10分制限機能は動画ファイル、音楽ファイル、漫画本などをじっくり見たり聞いたり読んだりできないようにストレスを与える。
 * 
 * アプリがゲームソフトの場合、ユーザーは10分ごとにリセットを受ける。
 * 
 * なおコンテンツの著作権者や版権元がこの関数の有無を決める。
 * ただし、古書の様に人類の共通の財産としてデータを残す観点からはこの機能が推奨される。
 * クリエイターが作ったものが忘れ去られるのがいいのか、残ることがいいのかはクリエイターの判断による。
 * この機能の付いたNFTとこの機能がついていないNFTに分けて売り出すのも方法の一つ。
 */