Ext.define('FS.store.Search',{
    extend: 'Ext.data.Store',
    model: 'FS.model.List',
    autoLoad: false,
    pageSize: 50,
    proxy:{
        type: 'ajax',
        actionMethods: 'post',
        api: {
            read: 'index.php?c=document&a=search'
        },
        reader: {
            type: 'json',
            root: 'rows',
            successProperty: 'success2' //identifed error id
            //messageProperty: 'msg'
        }
    }
})