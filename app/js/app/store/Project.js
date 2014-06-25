Ext.define('FS.store.Project',{
    extend: 'Ext.data.Store',
    model: 'FS.model.Project',
    autoLoad: false,
    pageSize: 10,
    proxy:{
        type: 'ajax',
        api: {
            read: 'index.php?c=document&a=listdocumentgrid',
            update: 'index.php?c=document&a=listdocument',
            create: 'index.php?c=document&a=listdocument',
            destroy: 'index.php?c=document&a=listdocument'
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
});