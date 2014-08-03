Ext.define('FS.view.workgroup.EditGroupUser',{
    extend: 'Ext.window.Window',
    alias: 'widget.editgroupuser',
    layout:'fit',
    frame: true,
    buttonAlign: 'center',
    width:380,
    shadow: true,
    modal: true,
    initComponent: function(){
        var me=this;
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
                xtype:'combo',
                name: 'workgroup_id',
                id:'combo-workgroup-id',
                emptyText : '请选择工作组',
                listConfig:{
                    emptyText: '请选择工作组',
                    loadingText : '正在加载工作组信息',
                    maxHeight: 100
                },
                triggerAction: 'all',
                queryMode: 'remote',
                editable: false,
                store: new Ext.data.Store({
                    stortId: 'workgroupstore1',
                    proxy : {
                        type : 'ajax',
                        url : base_path+'index.php?c=usergroup&a=listworkgroup',
                        actionMethods : 'post',
                        reader : 'json'
                    },
                    fields : ['u_id', 'u_name'],
                    autoLoad:true
                }),

                valueField: 'u_id',
                displayField: 'u_name',
                fieldLabel: '所属工作组',
                listeners:{
                    'afterRender' : function(combo) {
                        Ext.getCmp('combo-workgroup-id').setValue(rcd.get('u_parent').toString());
                    }
                }
            },{
                xtype:'hiddenfield',
                name: 'user_id',
                value: rcd.get('u_id')
            },{
                xtype:'textfield',
                name: 'username',
                allowBlank: false,
                blankText: '不允许为空',
                fieldLabel: '姓 名',
                value: rcd.get('u_name')
            }, {
                xtype:'textfield',
                vtype: 'email',
                name: 'email',
                allowBlank: false,
                blankText: '不允许为空',
                fieldLabel: '邮 箱',
                value: rcd.get('u_email')
            },{
                xtype:'combo',
                name: 'targetgroup_id',
                id:'combo-workgroup-manage-id',
                emptyText : '请选择工作组',
                disabled: true,
                listConfig:{
                    emptyText: '请选择工作组',
                    loadingText : '正在加载工作组信息',
                    maxHeight: 100
                },
                triggerAction: 'all',
                queryMode: 'remote',
                editable: false,
                store: new Ext.data.Store({
                    proxy : {
                        type : 'ajax',
                        url : base_path+'index.php?c=usergroup&a=listworkgroup',
                        actionMethods : 'post',
                        reader : 'json'
                    },
                    fields : ['u_id', 'u_name', 'u_targetgroup', 'u_grade'],
                    autoLoad:true
                }),
                valueField: 'u_id',
                displayField: 'u_name',
                fieldLabel: '管理工作组',
                listeners:{
                    'afterRender' : function(combo) {
                        if(!Ext.isEmpty(rcd.get('u_targetgroup'))){
                            Ext.getCmp('combo-workgroup-manage-id').setValue(rcd.get('u_targetgroup').toString());
                        }else{
                            Ext.getCmp('combo-workgroup-manage-id').setValue(rcd.get('u_parent').toString());
                        }
                        var ugrade = rcd.get('u_grade');
                        var ugradearr = ugrade.split(',');
                        if(Ext.Array.contains(ugradearr, '1') || Ext.Array.contains(ugradearr, '2')){
                            Ext.getCmp('combo-workgroup-manage-id').setDisabled(false);
                        }
                    }
                }
            }, {
                xtype:'checkboxgroup',
                fieldLabel: '权 限',
                columns: 2,
                vertical: true,
                items: me.userpowersettingshow(rcd),
                listeners:{
                    'change' : function(field, newvalue, oldvalue, eOpts){
                        var arr = newvalue['grade[]'];
                        flag = 0;
                        for(i in arr){
                            if(arr[i]=='1' ||arr[i]=='2'){
                                flag = 1;
                                Ext.getCmp('combo-workgroup-manage-id').setDisabled(false);
                            }
                        }
                        if(flag==0){
                            Ext.getCmp('combo-workgroup-manage-id').setDisabled(true);
                        }
                    }
                }
            }],
            buttons:[{
                text: '添加'
            }]
        }];
        this.callParent(arguments);
    },
    onRender:function(){
        this.setTitle('编辑【'+this.initialConfig.rcd.get('u_name')+'】');
        this.callParent(arguments);
    },
    powerfun: function(val,rcd){
        u_grade_arr=rcd.get('u_grade').split(',');
        for(var i=0;i<u_grade_arr.length;i++){
            if(u_grade_arr[i]==val){
                return true;
            }
        } 
        return false;
    },
    userpowersettingshow:function(rcd){
        var ret=[];
        if(login_user.u_grade>90){
            ret = [
            { boxLabel: '普通组员', name: 'grade[]', inputValue: '0', checked:this.powerfun('0',rcd)},
            { boxLabel: '组文件管理员', name: 'grade[]', inputValue: '1', checked:this.powerfun('1',rcd)},
            { boxLabel: '工作组领导', name: 'grade[]', inputValue: '2',checked:this.powerfun('2',rcd) },
            { boxLabel: '部门负责人', name: 'grade[]', inputValue: '3',checked:this.powerfun('3',rcd) },
            { boxLabel: '项目部负责人', name: 'grade[]', inputValue: '4',checked:this.powerfun('4',rcd) },
            { boxLabel: '系统管理员', name: 'grade[]', inputValue: '99',checked:this.powerfun('99',rcd) },
            { boxLabel: '系统监察员', name: 'grade[]', inputValue: '98',checked:this.powerfun('98',rcd) }];
        } else {
            ret=[{ boxLabel: '普通组员', name: 'grade[]', inputValue: '0', checked:this.powerfun('0',rcd)},{ boxLabel: '工作组领导', name: 'grade[]', inputValue: '2',checked:this.powerfun('2',rcd) }];
        }
        return ret;
    }
})