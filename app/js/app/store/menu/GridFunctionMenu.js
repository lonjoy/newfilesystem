Ext.define('FS.store.menu.GridFunctionMenu',{
    extend: 'Ext.data.Store',
    proxy: {
        type: 'ajax',
        url: '/index.php?c=menu&a=docmenu',
        noCache: false,
        actionMethods:{
            read: 'GET'
        }
    }
})
