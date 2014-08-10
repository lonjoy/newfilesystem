Ext.define('FS.view.common.PowerSetting',{
    extend: 'Ext.window.Window',
    alias: 'widget.commonpowersetting',
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
            id: 'commonpowersettingform',
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
                id: 'common_workgroup_id',
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
                    stortId: 'workgroupstore1',
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
                        Ext.getCmp('common_user_id').clearValue();
                        Ext.getCmp('common_user_id').store.load({
                            params:{
                                groupid: combo.getValue()
                            }
                        });
                    },
                    'afterRender' : function(combo) {
                        var rcd=this.ownerCt.ownerCt.rcd;
                        //Ext.getCmp('powersetting_user_id').clearValue();
                        Ext.getCmp('common_user_id').store.getProxy().extraParams={groupid: rcd.get('fs_group')};
                    }
                }
            }, {
                xtype:'combo',
                name: 'user_id',
                id: 'common_user_id',
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
                    storeId:'personStore1',   
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
            text: '修改'
        }];
        this.callParent(arguments);
    }
})