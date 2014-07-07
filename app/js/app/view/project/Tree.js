Ext.define('FS.view.project.Tree',{
    extend: 'Ext.tree.Panel',
    alias: 'widget.projectTreeList',
    region:'west',
    title: '项目列表',

    //draggable: true,
    initComponent: function(){
        Ext.apply(this, {
            width:200,
            split: true,
            collapsible: true
 
        });

        this.callParent(arguments);
    }
})