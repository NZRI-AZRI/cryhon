/*
{
  "name": "Crypto-bon(Crybon)",
  "version": "1.0.1",
  "description": "Local app of [web3-etherjs-otp-contents-viewer]",
  "main": "main.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": ["ether","otp","contents","viewer"],
  "author": {
    "name": "Katusya Nishizawa",
    "email": "nzri2azri@gmail.com",
    "url": "https://github.com/NZRI-AZRI"
  },
  "license": "non-free computer software , Proprietary"
}wss://rinkeby.infura.io/ws/v3/39a7b8b9d7924f8398627a6fccb53bab
*/

/*
//------------------------------------------------
//Author
//1.Code by NZRI. Katsuya Nishizawa.
//2020-07-24
//------------------------------------------------
*/


//宣言
let privateKey;
var prov;


//セッションストレージ初期化
sessionStorage.setItem('prov',       0 );
sessionStorage.setItem('privateKey@',0 );
sessionStorage.setItem('bookMark@', 0 );


var now = new Date();

//load csv inputfile (private key file and websocketURI)
var form = document.forms.myform;
form.myfile.addEventListener( 'change', function(e) {
 
    var result = e.target.files[0];
 
    //FileReaderのインスタンスを作成する
    var reader = new FileReader();
  
    //読み込んだファイルの中身を取得する
    reader.readAsText( result );
  
    //ファイルの中身を取得後に処理を行う
    reader.addEventListener( 'load', function() {
    
      //CSVの各データ毎に読み込む
      console.log( reader.result.split(',') );

      prov=reader.result.split(',')[0];
      privateKey=reader.result.split(',')[1];
      console.log( web3prov , privateKey );

      sessionStorage.setItem('prov',   prov );
      sessionStorage.setItem('privateKey@',privateKey );

      document.getElementById("settingResult").innerText="読み込みました  setting saved";

      //JSON形式に変換する    
      //console.log( JSON.parse(reader.result) );  
    })
})

//load output file (public bookmark file json)
var form2 = document.forms.myform2;
form2.myfile2.addEventListener( 'change', function(e) {
 
    var result = e.target.files[0];
 
    //FileReaderのインスタンスを作成する
    var reader = new FileReader();
  
    //読み込んだファイルの中身を取得する
    reader.readAsText( result );
  
    //ファイルの中身を取得後に処理を行う
    reader.addEventListener( 'load', function() {

      document.getElementById("settingResult").innerText="Bookmark File saved";

      //公開栞読み込み。秘密鍵を持つ人が署名した公開栞（signatureObject）をJSONファイルで読み込む　Object:The signature object
      console.log( JSON.parse(reader.result) );//JSON形式に変換する      

    })
})



/*without metamask . private key only.*/
//set key and web3 provider
window.setKey = async () => {

    prov = document.getElementById("prov1").value;
    if (!prov){
            return window.alert("prov1 is empty")
    }
    console.log('prov URI saved');
    
    privateKey = document.getElementById("privateKey1").value;
    if (!privateKey){
            return window.alert("key is empty")
    }
    console.log('privateKey saved');

    //sessionStrage save (privateKey , web3 provider URI)
    sessionStorage.setItem('prov',    prov  );
    sessionStorage.setItem('privateKey@', privateKey);

    document.getElementById("settingResult").innerText="読み込みました  setting saved";
};

//goto otp page
window.gotoOtp = async () => {
    //ページ遷移
    window.location.href = './otp.html'; 
}



window.addEventListener('load', async function() {
//
});


