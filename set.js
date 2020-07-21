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
sessionStorage.setItem('outputFile@',0 );

var now = new Date();

//load csv file
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

      web3prov=reader.result.split(',')[0];
      privateKey=reader.result.split(',')[1];
      console.log( web3prov , privateKey );

      sessionStorage.setItem('web3prov',   web3prov );
      sessionStorage.setItem('privateKey@',privateKey );

      document.getElementById("settingResult").innerText="読み込みました  setting saved";

      //JSON形式に変換する    
      //console.log( JSON.parse(reader.result) );  
    })
})

//load csv file
var form2 = document.forms.myform2;
form2.myfile.addEventListener( 'change', function(e) {
 
  var result = e.target.files[0];

  //FileReaderのインスタンスを作成する
  var reader = new FileReader();

  //読み込んだファイルの中身を取得する
  reader.readAsText( result );

    //ファイルの中身を取得後に処理を行う
    reader.addEventListener( 'load', function() {
    
      //出力ファイルから変数を読み取る処理    
      
      document.getElementById("settingResult").innerText="出力ファイル読み込みはテスト中です";
    })
})



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


/*
//------------------------------------------------
//Author
//1.Code by NZRI. Katsuya Nishizawa.
//2020-07-12
//------------------------------------------------
*/
