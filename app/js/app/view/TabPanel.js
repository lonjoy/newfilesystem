Ext.define('FS.view.TabPanel',{
    extend: 'Ext.tab.Panel',
    alias: 'widget.homepage',
	requires:[
		"FS.view.tree.ProjectTree"	
	],
    initComponent : function(){
        Ext.apply(this,{
            id: 'MainTabPanel',
            region: 'center', 
            defaults: {
                autoScroll:true,
                bodyPadding: 5
            },
            activeTab: 0,
            border: false,
            items: [{
                id: 'HomePage',
                title: '首页',
                iconCls:'icon-user',
                layout: 'border',
				items:[{
                    title: '项目列表',
                    region:'west',
                    width: 250,
                    split:true,
                    collapsible: false,   // make collapsible
                    layout: 'fit',
                    items:[{
						xtype: 'projectTree'
					}]
                },{
                    region: 'center',     // center region is required, no width/height specified
                    id: 'displayCenterPanel',
                    autoScroll: true
                }]
            }]
        });
        this.callParent(arguments);
    }
});
