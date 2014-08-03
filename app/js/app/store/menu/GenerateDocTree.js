Ext.define('FS.store.menu.GenerateDocTree',{
    extend: 'Ext.data.TreeStore',
    /*
    proxy: {
        type: 'ajax',
        url: '/index.php?c=menu&a=generateDocmenu',
        noCache: false,
        actionMethods:{
            read: 'GET'
        }
    }
    */
    root:{
        expanded: true,
        children:[{
            text:'生成目录',
            xtypeclass:'generatedoc',
            leaf: true

        }]
    }
})
