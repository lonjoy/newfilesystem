Ext.define('FS.view.email.CheckForm',{
    extend: 'Ext.window.Window',
    alias: 'widget.checkemailform',
    layout:'fit',
    id: 'checkemailform',
    title: '请输入邮箱密码！',
    frame: true,
    bodyStyle: 'padding: 5 5 5 5',
    buttonAlign: 'center',
    shadow: true,
    modal: true,
    initComponent: function(){
        var me=this;
        this.items=[{
            xtype: 'form',
            frame: true,
            buttonAlign: 'center',
            items:[{
                xtype:'textfield',
                width:200,
                id: 'userpasswordvalue',
                name: 'userpasswordvalue',
                inputType: 'password',
            },{
                xtype:'combo',
                width:200,
                id: 'maillistnum',
                name: 'maillistnum',
                value : '10',
                triggerAction: 'all', 
                editable: false,
                valueField: 'num',
                displayField: 'numvalue',
                fieldLabel: '邮件TOP',
                labelWidth: 60,
                store: new Ext.data.Store({
                    data:[{"num":10, "numvalue":10},{"num":20, "numvalue":20},{"num":30, "numvalue":30},{"num":40, "numvalue":40},{"num":50, "numvalue":50},{"num":100, "numvalue":100}],
                    fields : ['num', 'numvalue'],
                    renderer:'json'
                })
            }]
        }];
        this.buttons=[{
            text: '确 定',
            //scale: 'medium',
            id: 'userpasswordvaluebtn'
        }];
        this.callParent(arguments);
    },
    onRender: function(){
        this.callParent(arguments);
    }
})