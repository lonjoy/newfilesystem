Ext.define('FS.store.Email',{
    extend: 'Ext.data.Store',
    model: 'FS.model.Email',
    autoLoad: false,
    pageSize: 100,
    proxy:{
        type: 'ajax',
        api: {
            read: 'index.php?c=email&a=mailList'
        },
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success'
        }
    }
})