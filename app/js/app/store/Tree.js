Ext.define('FS.store.Tree',{
    extend: 'Ext.data.TreeStore',
    model: 'FS.model.Tree',
    autoLoad: false,
    proxy:{
        type: 'ajax',
        url: base_path + "index.php?c=document&a=listdocument",
        reader: {
            type: 'json',
            root: ''
        }
    }
});