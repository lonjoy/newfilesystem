Ext.define('FS.store.SystemLog',{
    extend: 'Ext.data.Store',
    model: 'FS.model.SystemLog',
    autoLoad: false,
    pageSize: 50,
    proxy:{
        type: 'ajax',
        api: {
            read: base_path+"index.php?c=log&a=syslogdata"
        },
        reader: {
            type: 'json',
            root: 'rows',
            successProperty: 'success'
            //totalProperty: 'total'
        }
    }
})