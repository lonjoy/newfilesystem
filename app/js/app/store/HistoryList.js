Ext.define('FS.store.HistoryList',{
    extend: 'Ext.data.Store',
    model: 'FS.model.HistoryList',
    autoLoad: false,
    pageSize: 50,
    proxy:{
        type: 'ajax',
        api: {
            read: base_path + "index.php?c=document&a=showhistory", 
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
});