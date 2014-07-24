Ext.define('FS.view.project.ShareDoc',{
    extend: 'Ext.window.Window',
    alias: 'widget.sharedoc',
    layout:'fit',
    title: '请选择共享给的人员',
    width:400,
    height: 400,
    autoScroll: true,
    closeAction:'destroy',
    resizable: true,
    shadow: true,
    modal: true,
    closable: true,
    initComponent: function(){
        this.items=[{
            xtype: 'treepanel',
            rootVisible: true,
            singleExpand: false,
            width:'100%',
            autoScroll:true,
            autoHeight: true,
            border:0,
            store: 'WorkgroupTree'
        }];
        this.buttons=[{
            text: '确认'
        }];
        this.callParent(arguments);
    },
    onRender: function(){
        this.items.getAt(0).setRootNode({text: '人员名单',expanded: true});
        this.callParent(arguments);
    }
})