Ext.define('FS.store.FileUpload',{
    extend: 'Ext.data.Store',
    model: 'FS.model.FileUpload',
    autoLoad: false,
    storeId:"fileItems"
});