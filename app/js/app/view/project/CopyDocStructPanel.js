Ext.define('FS.view.project.CopyDocStructPanel',{
    extend: 'Ext.window.Window',
    alias: 'widget.copydocstruct',
    layout:'fit',
    title: '复制文件夹结构',
    frame: true,
    bodyStyle: 'padding: 5 5 5 5',
    buttonAlign: 'center',
    shadow: true,
    modal: true,
    width:350,
    initComponent: function(){
        var me=this;
        var rcd=this.initialConfig.rcd;
        var parentrcd=this.initialConfig.parentrcd;
        var new_fs_name=this.initialConfig.new_fs_name;
        var projectview=this.initialConfig.projectview;
        this.items=[{
            xtype: 'form',
            frame: true,
            buttonAlign: 'center',
            items:[{
                xtype:'hiddenfield',
                name: 'document_parentid',
                value: parentrcd.get('fs_id')
            },{
                xtype:'hiddenfield',
                name: 'current_doc_id',
                value: rcd.get('fs_id')
            },{
                xtype:'textfield',
                fieldLabel: '上级文件夹',
                readOnly:true,
                value:parentrcd.get('text')
            }, {
                xtype:'textfield',
                name: 'document_newname',
                allowBlank: false,
                blankText: '不允许为空',
                fieldLabel: '文件夹编号',
                value:new_fs_name
            }, {
                xtype:'textfield',
                width: 300,
                name: 'document_newintro',
                allowBlank: false,
                blankText: '不允许为空',
                fieldLabel: '文件夹名称',
                value: rcd.get('fs_intro')
            }]
        }];
        this.buttons=[{
            text: '确 定',
            handler: function(){
                var copydocstructPanel=me.items.getAt(0);
                if(copydocstructPanel.getForm().isValid()){
                    copydocstructPanel.getForm().submit({
                        url: base_path+'index.php?c=document&a=copydocstruct',
                        method: 'post',
                        timeout: 30,
                        params: copydocstructPanel.getForm().getValues,
                        success: function(form, action){
                            Ext.Msg.alert('温馨提示', action.result.msg);
                            //load grid
                            projectview.getListStore().getProxy().extraParams={fs_id:parentrcd.get('fs_id')};
                            projectview.getListStore().load();
                            //load tree
                            projectview.getTreeStore().getProxy().extraParams={fs_id:parentrcd.get('fs_id')};
                            projectview.getTreeStore().load({node:parentrcd, callback:function(){}});
                            projectview.getProjectTree().getView().refresh();
                            me.close();
                        },
                        failure: function(form, action){
                            Ext.Msg.alert('温馨提示', action.result.msg);
                        }
                    });
                }
            }
        }];
        this.callParent(arguments);
    },
    onRender: function(){
        this.callParent(arguments);
    }
})