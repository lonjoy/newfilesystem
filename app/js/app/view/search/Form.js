Ext.define('FS.view.search.Form',{
    extend: 'Ext.form.Panel',
    alias: 'widget.searchform',
    region:'west',
    frame: true,
    bodyStyle: 'padding: 5 5 5 5',
    defaultType: 'textfield',
    buttonAlign: 'center',
    width: 280,
    items: [{
        xtype:'fieldset',
        columnWidth: 0.3,
        title: '常用',
        collapsible: false,
        items:[
        {
            xtype:'fieldset',
            columnWidth: 0.3,
            defaults: {anchor: '100%'},
            layout: 'anchor',
            items:[{
                xtype: 'radiogroup',
                items:[
                { boxLabel: '全部',name: 'fs_mode', inputValue: '-1',checked:true},
                { boxLabel: '文件',name: 'fs_mode', inputValue: '0'},  
                { boxLabel: '文件夹',name: 'fs_mode', inputValue: '1'},  
                ]
            }
            ]
        },{
            xtype:'fieldset',
            columnWidth: 0.5,
            title: '按编号查找：',
            defaults: {anchor: '100%'},
            layout: 'anchor',
            items :[{
                fieldLabel: '文件/文件夹编号',
                xtype: 'textfield',
                name: 'fs_name'
            }]
        }, {
            xtype:'fieldset',
            columnWidth: 0.5,
            title: '按名称查找：',
            defaultType: 'textfield',
            defaults: {anchor: '100%'},
            layout: 'anchor',
            items :[{
                fieldLabel: '文件/文件夹名称',
                name: 'fs_intro'
            }]
        }, {
            xtype:'fieldset',
            columnWidth: 0.5,
            title: '按用户查找：',
            //collapsible: true,
            defaults: {anchor: '100%'},
            layout: 'anchor',
            items :[{
                xtype:'combo',
                name: 'workgroup_id',
                id: 'workgroup_id',
                emptyText : '请选择工作组',
                listConfig:{
                    emptyText: '请选择工作组',
                    loadingText : '正在加载……',
                    maxHeight: 100
                },
                triggerAction: 'all',
                queryMode: 'remote',
                editable: false,
                store: new Ext.data.Store({
                    stortId: 'workgroupstore',
                    proxy : {
                        type : 'ajax',
                        url : base_path+'index.php?c=usergroup&a=listworkgroup&needalltag=1',
                        actionMethods : 'post',
                        reader : 'json'
                    },
                    fields : ['u_id', 'u_name'],
                    autoLoad:false
                }),
                valueField: 'u_id',
                displayField: 'u_name',
                fieldLabel: '请选择工作组',
                listeners:{
                    'select':function(combo, records, options){
                        Ext.getCmp('user_id').clearValue();
                        Ext.getCmp('user_id').store.load({
                            params:{
                                groupid: combo.getValue()
                            }
                        });
                    }
                }
            }, {
                xtype:'combo',
                name: 'user_id',
                id: 'user_id',
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
                    autoLoad:false
                }),
                valueField: 'u_id',
                displayField: 'u_name'
            }]
        },{
            xtype:'fieldset',
            columnWidth: 0.5,
            title: '类型：',
            //collapsible: true,
            defaults: {anchor: '100%'},
            layout: 'anchor',
            items :[{
                xtype: 'checkboxgroup',
                columns: 4,
                id: 'fs_type'
            }]
        }, {
            xtype:'fieldset',
            columnWidth: 0.5,
            title: '按日期查找：',
            //collapsible: true,
            defaults: {anchor: '100%'},
            layout: 'anchor',
            items :[{
                xtype: 'datefield',
                fieldLabel: 'From',
                labelWidth: 30,
                editable:false,
                name: 'from_date',
                format: 'm/d/Y',
                maxValue: new Date()  // limited to the current date or prior
            }, {
                xtype: 'datefield',
                fieldLabel: 'To',
                labelWidth: 30,
                editable:false,
                name: 'to_date',
                format: 'm/d/Y',
                value: new Date(),  // defaults to today
                maxValue: new Date()  
            }]
        }]

    }],
    buttons:[{
        text: '查 找',
        width: 120,
        scale: 'large'
    }] 
})