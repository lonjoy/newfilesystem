Ext.define('FS.store.WorkgroupTree',{
    extend: 'Ext.data.TreeStore',
    model: 'FS.model.WorkgroupTree',
    autoLoad: false,
    proxy:{
        type: 'ajax',
        url: base_path + "index.php?c=usergroup&a=listworkgroup&type=checkbox",
        reader: {
            type: 'json',
            root: ''
        }
    }
})