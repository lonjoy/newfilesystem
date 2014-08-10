Ext.define('FS.store.CommonList',{
    extend: 'Ext.data.Store',
    model: 'FS.model.List',
    autoLoad: false,
    pageSize: 50,
    proxy:{
        type: 'ajax',
        api: {
            read: base_path + "index.php?c=document&a=listsharedocumentgrid"
        },
        reader: {
            type: 'json',
            root: 'rows',
            successProperty: 'success'
        },
        writer: {
            type: 'json',
            root: 'data',
            encode: true
        }
    }
})