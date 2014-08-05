Ext.define('FS.view.project.ProjectView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.projectview',
    layout: 'border',
    
    initComponent: function(){
        this.items=[
        {xtype:'projectTreeList'},
        {xtype:'projectList'}
        ];
        this.callParent(arguments);
    }
})
