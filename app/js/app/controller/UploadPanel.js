Ext.define('FS.controller.UploadPanel',{
    id: "UploadPanel",
    extend: 'Ext.app.Controller',
    stores: [
    'FileUpload',
    'ParentRecord'
    ],
    views:[
    'swfupload.UploadPanel'        
    ],
    init: function(){
        
    }
});