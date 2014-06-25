Ext.define('FS.view.DocMenuTree',{
    extend: 'Ext.tree.Panel',
	alias: 'widget.docMenu',
    initComponent : function(){
        Ext.apply(this,{
            id:"docmenu",
            rootVisible: false,
			multiSelect: false,
			border: false,
            root:{
				text:'root',
				expanded: true,
				children:[{
					text: '项目管理',
					leaf: true,
					href: 'index.php?c=search'
				},{
					text: '文件查询',
					leaf: true,
					href: 'index.php?c=search'
				},{
					text: '公共信息栏',
					leaf: true,
					href: 'index.php?c=search'
				}]

			}
        });
        this.callParent(arguments);
    }
});