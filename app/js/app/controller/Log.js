Ext.define('FS.controller.Log', {
    extend: 'Ext.app.Controller',

    stores:['SystemLog', 'DocumentLog'],
    views:[       
    'log.SystemLog',
    'log.DocumentLog'
    ],
    init: function(){
        this.control({
 
        })
    }

})
