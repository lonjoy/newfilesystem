Ext.define('FS.view.project.ProjectView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.projectview',
    layout: 'border',
    initComponent: function(){

        this.items=[
        Ext.create('FS.controller.ProjectTree').getView('project.Tree').create(),
        Ext.create('FS.controller.Project').getView('project.List').create()
        ];
        this.callParent(arguments);
    }
})
