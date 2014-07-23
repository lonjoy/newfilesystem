Ext.define('FS.view.project.ShareDoc',{
    extend: 'Ext.window.Window',
    alias: 'widget.sharedoc',
    layout:'fit',
    title: '请选择共享给的人员',
    width:400,
    height: 400,
    autoScroll: true,
    closeAction:'destory',
    resizable: true,
    shadow: true,
    modal: true,
    closable: true,
    initComponent: function(){
        this.rcd=this.initialConfig.rcd;
        this.items=[{
            xtype: 'treepanel',
            rootVisible: false,
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
    }
})