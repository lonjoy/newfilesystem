Ext.define('FS.store.menu.DocTree',{
    extend: 'Ext.data.TreeStore',
    /*
    proxy: {
        type: 'ajax',
        url: '/index.php?c=menu&a=docmenu',
        noCache: false,
        actionMethods:{
            read: 'GET'
        }
    }
    */
    root:{
        expanded: true,
        children:[{
            text:'项目管理',
            xtypeclass:'projectview',
            leaf: true
            
        },{
            text:'文件查询',
            xtypeclass:'searchview',
            leaf: true
        },{
            text:'公共信息栏',
            xtypeclass:'commonview',
            leaf: true
        }
        /*
        ,{
            text:'创建公共信息栏',
            xtypeclass:'projectview',
            leaf: true
        }
        */
        ]
    }
})
