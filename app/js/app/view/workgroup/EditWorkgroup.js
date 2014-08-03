Ext.define('FS.view.workgroup.EditWorkgroup',{
    extend: 'Ext.window.Window',
    alias: 'widget.editworkgroup',
    layout:'fit',
    frame: true,
    buttonAlign: 'center',
    shadow: true,
    modal: true,
    initComponent: function(){
        var me=this;
        var rcd=this.initialConfig.rcd;
        this.items=[{
            xtype: 'form',
            frame: true,
            buttonAlign: 'center',
            items:[{
                xtype:'hiddenfield',
                name: 'workgroup_id',
                value: rcd.get('u_id')
            },{
                xtype:'hiddenfield',
                name: 'u_oldname',
                id: 'u_oldname',
                value: rcd.get('u_name')
            },{
                xtype:'textfield',
                name: 'workgroup_name',
                fieldLabel: '工作组名称',
                value:rcd.get('u_name')
            }],
            buttons:[{
                text: '确定'
            }]
        }];
        this.callParent(arguments);
    },
    onRender:function(){
        this.setTitle('编辑【'+this.initialConfig.rcd.get('u_name')+'】');
        this.callParent(arguments);
    }
})