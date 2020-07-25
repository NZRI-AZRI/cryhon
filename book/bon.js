/* 変数宣言初期化 */
//sessionStrageから代入

//privateKey - wssUri
let privateKey= sessionStorage.getItem('privateKey@');
let web3prov = sessionStorage.getItem('prov');
//nft data  call totp function
let myAccount = sessionStorage.getItem('myAccount' );
let nftid = sessionStorage.getItem('myNftId');


//rinkeby contract
const geneContractAddress = "0x300bEDdBf16F121F7A8D8572cA83b4ec6aA483F1";
const authContractAddress = "0x1Ed13902e42592f8a3631793D39B74e48aA6D558";


let web3;
let account ;//coinbase
let wallet;

var nonceCount; //nonnce (global var)
var gasPri;
var gasLim;

let geneInstance; // instance
let authInstance; // instance

var qrcode1;//QR code instance
var qrcodeCount1 = 0;

var now = new Date();

//web3 function==init　web3 初期化
window.initApp = async () => {
    //wssプロバイダセット
    web3 = new Web3(new Web3.providers.WebsocketProvider(web3prov));
    // privateKeyをインポート・セット
    account = web3.eth.accounts.privateKeyToAccount(privateKey);
    console.log(account)
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
});


//公開栞 生成部分=======================(秘密鍵とは異なり、公開されてもトークンにはアクセスされない鍵を栞とする。)

//get cert TOTP 7number  
window.getCertifiedTotp7Num = async () => {

	let otp7num = await geneInstance.methods.getTotpRn7Num(nftid).call({from: myAccount});

	let authResult = false ;

	authResult =  await authInstance.methods.authTotpRn7Num(myAccount, nftid, otp7num).call({from: myAccount});
	console.log('auth Result is ', authResult);

	if (authResult == true) {
		return otp7num;	
    }
    if (authResult == false) {
		return 0;	
	}
}



//set book mark file
window.setBookMarkFile = async () => {

    //ユーザーのアドレス nftid totp
    let myAccount = sessionStorage.getItem('myAccount');
    let nftid = sessionStorage.getItem('myNftId');
    //let totp7num = await getCertifiedTotp7Num();
    let totp7num = await geneInstance.methods.getTotpRn7Num(nftid).call({from: myAccount});

    //ブロックチェーンID、認証時のブロック番号(totpブロック番号)、コントラクト情報
    let bn  =  await web3.eth.getBlockNumber() ;//ブロック番号はUNIXタイムとは異なる時間の表現方法。
    let contractName =  await geneInstance.methods.name().call();
    let netId  =  await web3.eth.net.getId() ;
    //念のため"latest"な現在ブロック入手
    let nowBlock  =  await web3.eth.getBlock("latest");
    //UNIXベース年月日・認証時刻 64bit環境を使い、2038年問題を回避すること。Javascriptでは解決済み、geth-parity側はどうか？
    let nowUnixTime = now.toLocaleString();


    //コンテンツ
    //コンテンツ固有の秘密シード値
    let contentsKey = "Cryhon0x300bEDdBf16F121F7A8D8572cA83b4ec6aA483F1クリホンCryhonとクリボンCrybonは同じ1Ed13902e42592f8a3631793D39B74e48aA6D558クリホン";
    //既読のページの番号、セッション番号、時間数
    //このページのアドレス、PDFファイルの現在ページ、MP3-MP4ファイルなどの再生時刻最大値等を想定
    let pageNumber = sessionStorage.getItem('pdfPage');
    //閲覧した人の名前
    let userName = "kn";
    //ユーザーの読書コメント、しおり
    let userComment = "OK";
    //閲覧者、保有者の余白note
    let note = "cryhon-crybon";



   
    var jsondata = {
        //totp auth data
        "user-eoa-address"   : myAccount,
        "nft-id"             : nftid, 
        "TOTP-7digit"        : totp7num,     

        //block chain - contract data
        "contractName"       : contractName, 
        "netId"              : netId,//network data    
        "nowblock"           : nowBlock,//network data  
        "blockNumber"        : bn, //time data
        "nowUnixTime"        : nowUnixTime,//time data

        //contents viewer data
        "contentsKey"        : contentsKey, 
        "pageNumber"         : pageNumber,        
        "userName"           : userName,
        "userComment"        : userComment,
        "note"               : note
    }

    //sign データに署名。　設定画面、認証画面でこの公開栞データを外部から読み込めば簡易な閲覧が可能にする。
    let signatureObject = web3.eth.accounts.sign(jsondata, privateKey);
    
    //output json file
    // 保存するJSONファイルの名前
    const fileName = "bookmark0x300bEDdBf16F121F7A8D8572cA83b4ec6aA483F1.json";
    
    // データをJSON形式の文字列に変換する。
    const data = JSON.stringify(signatureObject);
    
    // HTMLのリンク要素を生成する。
    const link = document.createElement("a");
    
    // リンク先にJSON形式の文字列データを置いておく。
    link.href = "data:text/plain," + encodeURIComponent(data);
    
    // 保存するJSONファイルの名前をリンクに設定する。
    a.download = fileName;
    
    // ファイルを保存する。
    a.click();
}

//Auto login  TOTP 7number  
window.recoverBookMarkFile = async (signatureObject) => {
    //recoverが成功したらコンテンツページに遷移する。
    if( web3.eth.accounts.recover(signatureObject)==sessionStorage.getItem('myAccount') ){
        //セッション記録
        //sessionStorage.getItem('key') 取得
        //sessionStorage.setItem('key', 'value');
        //trueフラグを保存。遷移先のページがあるとき、そこで使う。
        sessionStorage.setItem('authResult', 1 );
        sessionStorage.setItem('myAccount', myAccount );
        sessionStorage.setItem('myNftId', nftid );
        sessionStorage.setItem('bookMark@', 10 );
        //ページ遷移
        window.location.href = './book/bon.html'; 
  }
}



//コンテンツページ用のスクリプト
document.getElementById("btndownload").addEventListener("click", function () {

    var text = document.getElementById("text").value;
    var blobBuilder;
    // （1）BlobBuilderの作成
    if ("MozBlobBuilder" in window) {
      blobBuilder = new MozBlobBuilder();
    } else if ("WebKitBlobBuilder" in window) {
      blobBuilder = new WebKitBlobBuilder();
    }

    // （2）BlobBuilderにテキストを追加する
    blobBuilder.append(text);
    var a = document.createElement("a");
    var label = document.createTextNode("ダウンロード");
    var disp = document.getElementById("disp");

    // （3）createObjectURLで（2）のテキストへのリンクを作成
    if (window.URL) {
      disp.innerHTML = '<a href="' + window.URL.createObjectURL(blobBuilder.getBlob()) + '" target="_blank">file</a>';
    } else if (window.webkitURL) {
      disp.innerHTML = '<a href="' + window.webkitURL.createObjectURL(blobBuilder.getBlob()) + '" target="_blank">ファイルダウンロード</a>';
    }

  }, false);

/*https://slash-mochi.net/?p=3073
// originalDataに，種々のデータが格納されているとする。次は一例。
 var originalData = {
    id: 123,
    name: "mochi",
    favoriteFoods: [
      "くさもち",
      "くるみもち",
      "道明寺"
    ],
  };
   
  // 保存するJSONファイルの名前
  const fileName = "mochi.json";
   
  // データをJSON形式の文字列に変換する。
  const data = JSON.stringify(originalData);
   
  // HTMLのリンク要素を生成する。
  const link = document.createElement("a");
   
  // リンク先にJSON形式の文字列データを置いておく。
  link.href = "data:text/plain," + encodeURIComponent(data);
   
  // 保存するJSONファイルの名前をリンクに設定する。
  a.download = fileName;
   
  // ファイルを保存する。
  a.click();


============================
http://marupeke296.com/IKDADV_JS_IO.html
① ファイルに文字を出力

　手始めはファイルを作って、開いて、そこに文字を書き込むという一連の作業をしてみます。これが出来れば色々な中間データの生成に役立ちます。
　JavaScript内でWSHを使ってファイルを扱うには「Scripting.FileSystemObject」というオブジェクトを作ります：

var fs = WScript.CreateObject("Scripting.FileSystemObject");
この人がファイル操作を担当してくれます。

　FileSystemObjectから新規のテキストファイルを作ってみます：

var file = fs.CreateTextFile("text.txt");
FileSystemObject.CreateTextFileメソッドの第1引数にファイル名を与えると新しいテキストファイルがさくっとできます。ちなみに、戻り値の型はTextStreamクラスです。このファイルに文字を書き込むには、

file.Write("マルペケつくろ～");
とWriteメソッドを呼び出します。非常に簡単です。開いたファイルは必ず閉じます：

file.Close();
基本はこれだけ。異常に簡単です。



//non json file
window.getCertifiedTotp7Num = async () => {

    //ユーザーのアドレス nftid totp
    let myAccount = sessionStorage.getItem('myAccount');
    let nftid = sessionStorage.getItem('myNftId');
    //let totp7num = await getCertifiedTotp7Num();
    let totp7num = await geneInstance.methods.getTotpRn7Num(nftid).call({from: myAccount});

    let nftData = myAccount + "&" + nftid + "&" + totp7num ;

    //ブロックチェーンID、認証時のブロック番号(totpブロック番号)、コントラクト情報
    let bn  =  await web3.eth.getBlockNumber() ;
    const geneContractAddress = "0x300bEDdBf16F121F7A8D8572cA83b4ec6aA483F1";
    const authContractAddress = "0x1Ed13902e42592f8a3631793D39B74e48aA6D558";
    let contractName =  await geneInstance.methods.name().call();
    let netId  =  await web3.eth.net.getId() ;
    //UNIXベース年月日・認証時刻
    let nowUnixTime = now.toLocaleString();

    let bnData = bn + "&" + geneContractAddress + "&" + authContractAddress + "&" + contractName + "&" + netId + "&" + nowUnixTime ;


    //コンテンツ
    //コンテンツ固有の秘密シード値
    let contentsKey = "Cryhon0x300bEDdBf16F121F7A8D8572cA83b4ec6aA483F1クリホンCryhonとクリボンCrybonは同じ1Ed13902e42592f8a3631793D39B74e48aA6D558クリホン";
    //既読のページの番号、セッション番号、時間数
    //このページのアドレス、PDFファイルの現在ページ、MP3-MP4ファイルなどの再生時刻最大値等を想定
    let pageNumber = sessionStorage.getItem('pdfPage');
    //閲覧した人の名前
    let userName = "kn";
    //ユーザーの読書コメント、しおり
    let userComment = "OK";
    //閲覧者、保有者の余白note
    let note = "cryhon-crybon";

    let contentsReaderData = contentsKey + "&" + pageNumber + "&" + userName + "&" + userComment + "&" + note;

    let data = nftData + "&" + bnData + "&" + contentsReaderData;
}
  */