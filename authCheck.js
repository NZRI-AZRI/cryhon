// ページ読み込み時に実行したい処理
window.onload = function authCheck(){

    if(sessionStorage.getItem('authResult')  > 0 ){
        console.log('AuthResult "true"');
        console.log(sessionStorage.getItem('authResult') );
        console.log(sessionStorage.getItem('myAccount') );

    }else{
        location.href="./ban/index.htm";
    }
    
}

/*
    //セッション記録
    //sessionStorage.getItem('key') 取得
    //sessionStorage.setItem('key', 'value');
// データの保存
sessionStorage.setItem('session_save', 1);
window.sessionStorage.setItem('session_save', 1);
sessionStorage.session_save = 1;
// データの取得
get_storage = sessionStorage.getItem('session_save');
get_storage = window.sessionStorage.getItem('session_save');
get_storage = sessionStorage.session_save;
// データの削除
sessionStorage.removeItem('session_save');
window.sessionStorage.removeItem('session_save');
// データを削除
sessionStorage.clear();
window.sessionStorage.clear();
*/