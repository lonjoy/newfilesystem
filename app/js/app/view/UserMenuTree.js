Ext.define('FS.view.UserMenuTree',{
    extend: 'Ext.tree.Panel',
	alias: 'widget.userMenu',
    initComponent : function(){
        Ext.apply(this,{
            id:"usermenu",
            rootVisible: false,
			multiSelect: false,
			border: false,
            root:{
				text:'root',
				expanded: true,
				children:[{
					text: '工作组列表',
					leaf: true,
					href: 'index.php?c=search'
				},{
					text: '添加工作组',
					leaf: true,
					href: 'index.php?c=search'
				}]

			}
        });
        this.callParent(arguments);
    }
});