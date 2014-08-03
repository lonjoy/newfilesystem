Ext.define('FS.store.menu.GroupTree',{
    extend: 'Ext.data.TreeStore',
    /*
    proxy: {
    type: 'ajax',
    url: '/index.php?c=menu&a=groupmenu',
    noCache: false,
    actionMethods:{
    read: 'GET'
    }
    }
    */
    root:{
        expanded: true,
        children:[{
            text:'工作组列表',
            xtypeclass:'workgroupview',
            leaf: true

        },{
            text:'添加工作组',
            xtypeclass:'addworkgroup',
            leaf: true
        }]
    }
})
