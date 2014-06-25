Ext.define('FS.store.menu.EmailTree',{
    extend: 'Ext.data.TreeStore',
    proxy: {
        type: 'ajax',
        url: '/index.php?c=menu&a=emailmenu',
        noCache: false,
        actionMethods:{
            read: 'GET'
        }
    }
})
