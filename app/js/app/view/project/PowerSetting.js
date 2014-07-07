Ext.define('FS.view.project.PowerSetting',{
    extend: 'Ext.window.Window',
    alias: 'widget.powersetting',
    title : '文件夹权限设置',
    layout:'fit',
    width:350,
    resizable: false,
    shadow: true,
    modal: true,
    closable: true,
    buttonAlign: 'center',
    initComponent: function(){
        this.rcd=this.initialConfig.rcd;
        this.items=[{
            xtype: 'form',
            id: 'powersettingform',
            autoHeight : true,
            frame: true,
            bodyStyle: 'padding: 5 5 5 5',
            defaultType: 'textfield',
            buttonAlign: 'center',
            defaults: {
                autoFitErrors: false,
                labelSeparator : '：',
                labelWidth: 100,
                width: 280,
                allowBlank: true,
                labelAlign: 'left',
                msgTarget: 'under'  
            },
            items: [{
                xtype:'hiddenfield',
                name: 'project_doc_id',
                value: this.rcd.get('fs_id')
            },{
                xtype:'hiddenfield',
                name: 'project_doc_name',
                value: this.rcd.get('fs_name')
            },{
                xtype:'textfield',
                fieldLabel: '文件夹',
                width:280,
                readOnly:true,
                value:this.rcd.get('text')
            }, {
                xtype:'combo',
                name: 'workgroup_id',
                id: 'powersetting_workgroup_id',
                emptyText : '请选择工作组',
                listConfig:{
                    emptyText: '请选择工作组',
                    loadingText : '加载中……',
                    maxHeight: 100,
                    width:250
                },
                triggerAction: 'all',
                queryMode: 'local',
                editable: false,
                store: new Ext.data.Store({
                    stortId: 'workgroupstore',
                    proxy : {
                        type : 'ajax',
                        url : base_path+'index.php?c=usergroup&a=listworkgroup',
                        actionMethods : 'POST',
                        reader : 'json'
                    },
                    fields : ['u_id', 'u_name'],
                    autoLoad:true
                }),
                valueField: 'u_id',
                displayField: 'u_name',
                value: this.rcd.get('fs_group').toString(),
                fieldLabel: '请选择工作组',
                listeners:{
                    'select':function(combo, records, options){
                        Ext.getCmp('powersetting_user_id').clearValue();
                        Ext.getCmp('powersetting_user_id').store.load({
                            params:{
                                groupid: combo.getValue()
                            }
                        });
                    },
                    'afterRender' : function(combo) {
                        var rcd=this.ownerCt.ownerCt.rcd;
                        //Ext.getCmp('powersetting_user_id').clearValue();
                        Ext.getCmp('powersetting_user_id').store.getProxy().extraParams={groupid: rcd.get('fs_group')};
                    }
                }
            }, {
                xtype:'combo',
                name: 'powersetting_user_id',
                id: 'powersetting_user_id',
                emptyText : '请选择组员', 
                listConfig:{
                    loadMask:false
                    //loadingText : '正在加载组员信息',
                },
                triggerAction: 'all',
                queryMode: 'local',
                editable: false,
                fieldLabel: '请选择组员',
                store: new Ext.data.Store({   
                    storeId:'personStore',   
                    proxy: {   
                        type: 'ajax',   
                        url : base_path+'index.php?c=usergroup&a=listgroupuser',
                        reader: 'json' 
                    },   
                    fields: ['u_id', 'u_name'],  
                    autoLoad:true
                }),
                value: this.rcd.get('fs_user').toString(),
                valueField: 'u_id',
                displayField: 'u_name'
            }]
        }];
        this.buttons=[{
            text: '修改',
            handler: function(){
                var rcd=this.ownerCt.ownerCt.rcd;
                var win=this.ownerCt.ownerCt;
                powersettingPanel=Ext.getCmp('powersettingform');
                if(powersettingPanel.form.isValid()){
                    powersettingPanel.getForm().submit({
                        url: base_path+'index.php?c=document&a=adddocpower',
                        method: 'post',
                        timeout: 30,
                        params: powersettingPanel.getForm().getValues(),
                        success: function(form, action){
                            //修改本地grid的store
                            rcd.set('fs_group', Ext.getCmp('powersetting_workgroup_id').getValue());
                            rcd.set('fs_user', Ext.getCmp('powersetting_user_id').getValue());
                            rcd.set('u_id', Ext.getCmp('powersetting_user_id').getValue());
                            rcd.set('u_name', Ext.getCmp('powersetting_user_id').getRawValue());
                            rcd.commit();
                            Ext.Msg.alert('温馨提示', action.result.msg);
                            win.close();
                        },
                        failure: function(form, action){
                            Ext.Msg.alert('温馨提示', action.result.msg);
                        }
                    });
                }
            }
        }];
        this.callParent(arguments);
    }
})