Ext.define('FS.store.menu.LogTree',{
    extend: 'Ext.data.TreeStore',
    /*
    proxy: {
    type: 'ajax',
    url: '/index.php?c=menu&a=logmenu',
    noCache: false,
    actionMethods:{
    read: 'GET'
    }
    }
    */
    root:{
        expanded: true,
        children:[{
            text:'系统操作日志',
            xtypeclass:'systemlog',
            leaf: true

        },{
            text:'文件操作日志',
            xtypeclass:'documentlog',
            leaf: true

        }]
    }
})
