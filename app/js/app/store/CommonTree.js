Ext.define('FS.store.CommonTree',{
    extend: 'Ext.data.TreeStore',
    model: 'FS.model.Tree',
    autoLoad: false,
    proxy:{
        type: 'ajax',
        url: base_path + "index.php?c=document&a=listsharedocument",
        reader: {
            type: 'json',
        }
    }
})