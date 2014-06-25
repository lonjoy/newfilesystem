Ext.define('FS.view.LogMenuTree',{
    extend: 'Ext.tree.Panel',
	alias: 'widget.logMenu',
    initComponent : function(){
        Ext.apply(this,{
            //id:"logmenu",
            rootVisible: false,
			multiSelect: false,
			border: false,
            root:{
				text:'root',
				expanded: true,
				children:[{
					text: '系统操作日志',
					leaf: true,
					href: 'index.php?c=search'
				},{
					text: '文件操作日志',
					leaf: true,
					href: 'index.php?c=search'
				}]

			}
        });
        this.callParent(arguments);
    }
});