Ext.define('FS.store.WorkgroupList',{
    extend: 'Ext.data.Store',
    model: 'FS.model.WorkgroupList',
    autoLoad: false,
    pageSize: 50,
    proxy:{
        type: 'ajax',
        url: base_path + "index.php?c=usergroup&a=listgroupusergrid",//+workgroup_id, 
        reader: {
            type: 'json',
            root: 'rows',
            totalProperty: 'total'
        }
    }
})