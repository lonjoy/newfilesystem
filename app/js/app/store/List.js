Ext.define('FS.store.List',{
    extend: 'Ext.data.Store',
    model: 'FS.model.List',
    autoLoad: false,
    pageSize: 50,
    proxy:{
        type: 'ajax',
        api: {
            read: 'index.php?c=document&a=listdocumentgrid'
        },
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success'
        },
        writer: {
            type: 'json',
            root: 'data',
            encode: true
        }
    }
})