Ext.define('FS.view.common.CommonView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.commonview',
    layout: 'border',
    
    initComponent: function(){
        this.items=[
        {xtype:'commontree'},
        {xtype:'commonlist'}
        ];
        this.callParent(arguments);
    }
})
