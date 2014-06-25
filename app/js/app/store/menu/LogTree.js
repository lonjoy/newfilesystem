Ext.define('FS.store.menu.LogTree',{
    extend: 'Ext.data.TreeStore',
    proxy: {
        type: 'ajax',
        url: '/index.php?c=menu&a=logmenu',
        noCache: false,
        actionMethods:{
            read: 'GET'
        }
    }
})
