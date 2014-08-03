Ext.define('FS.view.workgroup.AddWorkgroup',{
    extend: 'Ext.window.Window',
    alias: 'widget.addworkgroup',
    layout:'fit',
    frame: true,
    title: '添加工作组',
    buttonAlign: 'center',
    shadow: true,
    modal: true,
    initComponent: function(){
        this.items=[{
            xtype: 'form',
            frame: true,
            defaults: {
                labelSeparator : '：',
                labelWidth: 80,
                //width: 220,
                allowBlank: false,
                blankText: '不允许为空',
                //labelAlign: 'left',
                //msgTarget: 'under'  
            },
            buttonAlign: 'center',
            items:[{
                xtype:'textfield',
                name: 'workgroupname',
                fieldLabel: '工作组名称'
            }],
            buttons:[{
                text: '添加'
            }]
        }];
        this.callParent(arguments);
    }
})