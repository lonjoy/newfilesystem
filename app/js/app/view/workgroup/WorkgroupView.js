Ext.define('FS.view.workgroup.WorkgroupView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.workgroupview',
    layout: 'border',
    
    initComponent: function(){

        this.items=[
        {xtype:'workgroupTreeList'},
        {xtype:'workgroupList'}
        ];
        this.callParent(arguments);
    }
})
