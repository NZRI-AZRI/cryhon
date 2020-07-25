/* 変数宣言初期化 */
//sessionStrageから代入

//privateKey - wssUri
let privateKey= sessionStorage.getItem('privateKey@');
let web3prov = sessionStorage.getItem('prov');
console.log('k' , privateKey );
console.log('prov' , web3prov);