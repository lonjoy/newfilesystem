Ext.define('FS.view.project.ShareDoc',{
    extend: 'Ext.tree.Panel',
    alias: 'widget.sharedoc',
    rootVisible: true,
    singleExpand: false,
    autoScroll:true,
    autoHeight: true,
    width : '100%',
    border:0,
    store: 'WorkgroupTree',
    initComponent: function(){
        this.callParent(arguments);
    },
    onRender: function(){
        this.setRootNode({text: '人员名单',expanded: true});
        this.callParent(arguments);
    }
})