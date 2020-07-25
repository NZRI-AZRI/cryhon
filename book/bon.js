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
    let totp7num = sessionStorage.getItem('totp7');

    console.log('nft data is ', myAccount , nftid , totp7num);

    //ブロックチェーンID、認証時のブロック番号(totpブロック番号)、コントラクト情報
    let bn = sessionStorage.getItem('blockNum' );
    let contractName = sessionStorage.getItem('contractName' );
    let netId = sessionStorage.getItem('netId' );

    //念のため"latest"な現在ブロック入手
    let authBlock = sessionStorage.getItem('authBlock' );
    console.log('auth block data is ', authBlock);

    //UNIXベース年月日・認証時刻 64bit環境を使い、2038年問題を回避すること。Javascriptでは解決済み、geth-parity側はどうか？
    let authUnixTime = sessionStorage.getItem('authUnixTime' );




    //コンテンツ
    //コンテンツ固有の秘密シード値
    let contentsKey = "CryhonISBN:0x300bEDdBf16F121F7A8D8572cA83b4ec6aA483F1";
    //既読のページの番号、セッション番号、時間数
    //このページのアドレス、PDFファイルの現在ページ、MP3-MP4ファイルなどの再生時刻最大値等を想定
    let pageNumber = sessionStorage.getItem('pdfPage');
    //閲覧した人の名前
    let userName = "kn";
    //ユーザーの読書コメント、しおり
    let userComment = "OK...";
    //閲覧者、保有者の余白note
    let note = "cryhon-crybon_クリホンCryhonとクリボンCrybonは同じ";
    //UNIXベース年月日・認証時刻 64bit環境を使い、2038年問題を回避すること。Javascriptでは解決済み、geth-parity側はどうか？
    let time = now.toLocaleString();


   
    var jsondata = {
        //auth totp data
        "user-eoa-address"   : myAccount,
        "nft-id"             : nftid, 
        "TOTP-7digit"        : totp7num,     

        //auth block chain - contract data
        "contractName"       : contractName, 
        "netId"              : netId,//network data    
        "authblock"          : authBlock,//network data  
        "blockNumber"        : bn, //time data
        "authUnixTime"       : authUnixTime,//auth time data

        //contents viewer data
        "contentsKey"        : contentsKey, //コンテンツID　ISBNなど本のIDも可能
        "pageNumber"         : pageNumber,        
        "userName"           : userName,
        "userComment"        : userComment,
        "note"               : note,
        "time"               : time //unixTime of makingBookmarkFile
    }

    //sign データに署名。　設定画面、認証画面でこの公開栞データを外部から読み込めば簡易な閲覧が可能にする。
    let signatureObject = await web3.eth.accounts.sign(jsondata, privateKey);
    
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

