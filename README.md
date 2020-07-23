# crybon
crypto-bon-ozotp
CRYBON or CRYHON is ethereum-web3 based one time passward login and contens viewer app.
In this text, otp is one time passward .

GitLab ver is https://gitlab.com/katsuya_nishizawa/cryhon-crybon.


BON or HON mean book(本) in japanese.

Licence is UNLICENSE. Code Only Me  (not MIT) 
code will be open-source-software. 
I can use this app , sytem. (at 2020/07/13)

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
