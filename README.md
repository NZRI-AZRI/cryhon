# crybon
crypto-bon-ozotp
CRYBON or CRYHON is ethereum-web3 based one time passward login and contens viewer app.
In this text, otp is one time passward .

2020-07-23 (2020年7月23日改訂)

GitLab ver is https://gitlab.com/katsuya_nishizawa/cryhon-crybon.


BON or HON mean book(本) in japanese.

Only I can use this code now.
(このコードを使用できるのは私だけです。)

The copyright of the code belongs to Katsuya Nishizawa.
(コードの著作権はKatsuya Nishizawaに帰属します。)

The copyright of the external Javascript module used is owned by each developer.
(また使用している外部Javascriptモジュールの著作権はそれぞれの開発者に帰属しています。)

このプロジェクトは開発中であり、このコードには未完成の項目や意図しないセキュリティホールが存在しえます。
現在のソースコードを無断で引用し電子書籍を作ろうとすることは、あなたやあなたの所属する会社の品位を落としかねません。

コードの権利者である私は一切の補償をしません。

Make flow is ... [node.js  --> Electron --> electron-builder-->Make 1 app file including Javascript-Html-Css-pdf-mp3-mp4-etc.. ---> 1 File such type are " exe-dmg-app ".]

/*---------*/
Javascript and HTML file include this..
@web3.js
@otp token  contract address [0x--------]
@private key(this ethereum key have otp token . token based erc-721. ) [bytes32 type like... 0x--------]
@web3 websocketURI [URI type like... wss:--------]
@set.js/set.html  [first. set private key and web3 websocketURI. ]
@otp.js/otp.html  [second. accses ethereum network via websocketURI.]
@bon.js/bon.html  [(hon.js/hon.html) third. If one-time password authentication result is true , you are this crybon owner . you can read contents.
 content file are "html-txt , pdf , mp3 sound , mp4 movie , image file(comic image , manga-bon image) "]
/*---------*/

<footer>Author NZRI (https://github.com/NZRI-AZRI) "license": "non-free computer software , Proprietary" , "name": "Katusya Nishizawa" , "email": "nzri2azri@gmail.com"</footer>

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
    "license": "non-free computer software , Proprietary"
}

