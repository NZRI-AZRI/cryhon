const builder = require('electron-builder');

builder.build({
    config: {
        'appId': 'local.web3.otp.viewer.app1',
        'win':{
             'target': 'portable'
         }
    }
});