Ext.define('FS.store.menu.GroupTree',{
    extend: 'Ext.data.TreeStore',
    proxy: {
        type: 'ajax',
        url: '/index.php?c=menu&a=groupmenu',
        noCache: false,
        actionMethods:{
            read: 'GET'
        }
    }
})
