Ext.define('FS.view.workgroup.AddGroupUser',{
    extend: 'Ext.window.Window',
    alias: 'widget.addgroupuser',
    layout:'fit',
    frame: true,
    title: '添加组员',
    buttonAlign: 'center',
    width:380,
    shadow: true,
    modal: true,
    initComponent: function(){
        var rcd=this.initialConfig.rcd;
        this.items=[{
            xtype: 'form',
            frame: true,
            bodyStyle: 'padding: 5 5 5 5',
            buttonAlign: 'center',
            defaults: {
                autoFitErrors: false,
                labelSeparator : '：',
                labelWidth: 80,
                width: 300,
                labelAlign: 'left',
                msgTarget: 'under'  
            },

            items: [{
                xtype:'hiddenfield',
                name: 'workgroup_id',
                allowBlank: false,
                blankText: '不允许为空',
                value: rcd.get('u_id')
            },{
                xtype:'textfield',
                name: 'workgroup_name',
                fieldLabel: '工作组',
                allowBlank: false,
                blankText: '不允许为空',
                readOnly: true,
                value: rcd.get('u_name')
            },{
                xtype:'textfield',
                name: 'username',
                allowBlank: false,
                blankText: '不允许为空',
                id: 'username',
                fieldLabel: '姓 名'
            }, {
                xtype:'textfield',
                vtype: 'email',
                id: 'email',
                allowBlank: false,
                blankText: '不允许为空',
                name: 'email',
                fieldLabel: '邮 箱'
            }, {
                xtype:'checkboxgroup',
                id: 'grade',
                fieldLabel: '权 限',
                columns: 2,
                vertical: true,
                items: gfun.addpowersettingshow()
            }],
            buttons:[{
                text: '添加'
            }]
        }];
        this.callParent(arguments);
    }
})