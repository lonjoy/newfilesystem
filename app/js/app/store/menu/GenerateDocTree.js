Ext.define('FS.store.menu.GenerateDocTree',{
    extend: 'Ext.data.TreeStore',
    proxy: {
        type: 'ajax',
        url: '/index.php?c=menu&a=generateDocmenu',
        noCache: false,
        actionMethods:{
            read: 'GET'
        }
    }
})
