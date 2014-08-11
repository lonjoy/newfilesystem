Ext.define('FS.view.layout.Main',{
    extend: 'Ext.tab.Panel',
    initComponent: function(){
        Ext.apply(this,{
            itemId: 'tabCenter',
            region: 'center',
            activeTab: 0,
            items:[{
                title:'项目管理',
                xtype:'projectview'
            }],
            listeners:{
                'remove': function(obj, component, eOpts){
                    if(component.initialConfig.items.xtype=='email'){
                        Ext.getCmp('checkemailform').close(); 
                    }
                }
            }
        });
        this.callParent(arguments);
    }
});