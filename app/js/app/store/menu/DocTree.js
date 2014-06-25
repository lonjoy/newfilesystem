Ext.define('FS.store.menu.DocTree',{
    extend: 'Ext.data.TreeStore',
    proxy: {
        type: 'ajax',
        url: '/index.php?c=menu&a=docmenu',
        noCache: false,
        actionMethods:{
            read: 'GET'
        }
    }
})
