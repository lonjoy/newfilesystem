Ext.define('FS.store.menu.EmailTree',{
    extend: 'Ext.data.TreeStore',
    /*
    proxy: {
    type: 'ajax',
    url: '/index.php?c=menu&a=emailmenu',
    noCache: false,
    actionMethods:{
    read: 'GET'
    }
    }
    */
    root:{
        expanded: true,
        children:[{
            text:'查看邮件列表',
            xtypeclass:'email',
            leaf: true

        }]
    }
})
