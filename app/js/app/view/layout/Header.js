Ext.define('FS.view.layout.Header', {
    extend: 'Ext.Toolbar',
    initComponent: function() {
        Ext.applyIf(this, {
            id: 'header-panel',
            region: 'north',
            height: 30,
            items:[{
                iconCls : 'icon-user',  
                text : login_user.u_name
            },'-',{
                text : '当前角色：['+login_user.u_gradename+']'
            },'-',{
                text : Ext.Date.format(new Date(),'Y年m月d日')
            },'-',{
                text : '修改密码',  
                iconCls : 'icon-user-edit', 
                handler: function(){
                    var alterpwdformPanel = Ext.create('Ext.form.Panel', {
                        frame: true,
                        bodyStyle: 'padding: 5 5 5 5',
                        defaultType: 'textfield',
                        buttonAlign: 'center',
                        defaults: {
                            labelSeparator : '：',
                            labelWidth: 80,
                            width: 220,
                            allowBlank: false,
                            blankText: '不允许为空',
                            labelAlign: 'left',
                            msgTarget: 'under'  
                        },
                        items: [{
                            xtype:'textfield',
                            name: 'oldpwd',
                            inputType: 'password',
                            fieldLabel: '原密码'
                        },{
                            xtype:'textfield',
                            name: 'newpwd',
                            inputType: 'password',
                            fieldLabel: '新密码'
                        },{
                            xtype:'textfield',
                            name: 'newpwdconfirm',
                            inputType: 'password',
                            fieldLabel: '确认密码'
                        }],
                        buttons:[{
                            text: '修改',
                            handler: function(){
                                if(alterpwdformPanel.form.isValid()){
                                    alterpwdformPanel.getForm().submit({
                                        url: base_path+'index.php?c=usergroup&a=alterpwd',
                                        method: 'post',
                                        timeout: 30,
                                        params: alterpwdformPanel.getForm().getValues,
                                        success: function(form, action){
                                            win.hide();
                                            Ext.Msg.alert('温馨提示', action.result.msg);
                                            location.href='/index.php?c=login';
                                        },
                                        failure: function(form, action){
                                            Ext.Msg.alert('温馨提示', action.result.msg); 
                                        }
                                    });
                                }
                            }
                        },{
                            text: '重置',
                            handler: function(){
                                alterpwdformPanel.form.reset();
                            }
                        }]
                    });
                    var win = Ext.create('Ext.window.Window',{
                        layout:'fit',
                        width:300,
                        resizable: false,
                        shadow: true,
                        modal: true,
                        closable : true,
                        items: alterpwdformPanel
                    });
                    alterpwdformPanel.form.reset();
                    win.setTitle('修改密码');
                    win.show();
                } 
            },'-',{
                xtype:'button',
                text : '退出',  
                iconCls : 'icon-logout',
                listeners: {
                    click: function(){
                        window.location.href=base_path+'index.php?c=login&a=loginout'; 
                    }
                }
            }]
        });

        this.callParent(arguments);
    }
});
