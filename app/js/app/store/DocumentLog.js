Ext.define('FS.store.DocumentLog',{
    extend: 'Ext.data.Store',
    model: 'FS.model.DocumentLog',
    autoLoad: false,
    pageSize: 50,
    proxy:{
        type: 'ajax',
        api: {
            read: base_path+"index.php?c=log&a=doclogdata",
        },
        reader: {
            type: 'json',
            root: 'rows',
            successProperty: 'success'
        }
    }
})