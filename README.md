# crybon
crypto-bon-ozotp
CRYBON or CRYHON is ethereum-web3 based one time passward login and contens viewer app.
In this text, otp is one time passward .

2020-07-23 (2020年7月23日改訂)

GitLab ver is https://gitlab.com/katsuya_nishizawa/cryhon-crybon.


BON or HON mean book(本) in japanese.

Licence is UNLICENSE. Only I can use this code now.
(ライセンスはUNLICENSEです。このコードを使用できるのは私だけです。)

In this text. "Licence is UNLICENSE" means "NOT Free software. People have unlicense. "
(このテキストで。 「ライセンスはライセンスではありません」とは、「フリーソフトウェアではないことを意味します。)

※node.jsのpackage.jsonの項目で、"License"の項目をどのフリーソフトウェアライセンスにも許可しない意味でUNLICENSEとしたものです。
意図したライセンスはマイクロソフト社のオペレーティングソフトと同じくプロプライエタリソフトウェアであり、非フリーソフトウェアです。
ただしソースコードは適宜、必要な部分は公開されます。
LGPL3ライセンスを含むモジュールを使うので、本の内容となるコンテンツ以外の部分についてはソースコードは公開されます。

The copyright of the code belongs to Katsuya Nishizawa.
(コードの著作権はKatsuya Nishizawaに帰属します。)

また使用している外部Javascriptモジュールの著作権はそれぞれの開発者に帰属しています。
(The copyright of the external Javascript module used is owned by each developer.)

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
