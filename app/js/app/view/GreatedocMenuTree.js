Ext.define('FS.view.GreatedocMenuTree',{
    extend: 'Ext.tree.Panel',
	alias: 'widget.greatedocMenu',
    initComponent : function(){
        Ext.apply(this,{
            //id:"greatedocMenu",
            rootVisible: false,
			multiSelect: false,
			border: false,
            root:{
				text:'root',
				expanded: true,
				children:[{
					text: '生成目录',
					leaf: true,
					href: 'index.php?c=search'
				}]

			}
        });
        this.callParent(arguments);
    }
});