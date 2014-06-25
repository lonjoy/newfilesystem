Ext.define('FS.view.layout.Footer',{
	extend:'Ext.panel.Panel',
	initComponent: function(){
		Ext.apply(this,{
			region:'south',
			cls:'footer',
			height: 30,
            frame: true,
            style:{
               textAlign: "center" 
            },
			html:'Copyright © 1998 - 2013 ikuday. All Rights Reserved'
		});
		this.callParent(arguments);
	}
});