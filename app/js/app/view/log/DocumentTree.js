Ext.define('FS.view.log.DocumentTree',{
    extend: 'Ext.window.Window',
    alias: 'widget.documenttree',
    layout:'fit',
    width:600,
    height: 500,
    autoScroll: true,
    title: '提示：原有文件夹已删除，请选择新的目标文件夹！',
    closeAction:'destroy',
    resizable: true,
    shadow: true,
    modal: true,
    closable: true,
    initComponent: function(){
        var logrcd=this.initialConfig.rcd.getData();
        var listtreestore=this.initialConfig.store;

        this.items=[{
            xtype: 'treepanel',
            id:'mailtreepanel',
            rootVisible: false,
            singleExpand: false,
            width:'100%',
            autoScroll:true,
            autoHeight: true,
            border:0,
            store: new Ext.data.TreeStore({
                proxy:{
                    type: 'ajax',
                    url: base_path + "index.php?c=document&a=listdocument&showshare=1",
                    reader: 'json'
                },
                autoLoad: true, 
                fields:['fs_id', 'fs_name', 'text', 'fs_intro', 'fs_fullpath', 'fs_isdir', 'fs_code', 'fs_is_share', 'fs_parent']
            }),
            listeners : {
                //目录数右键事件
                'itemcontextmenu' : function(view, rcd, item, idx, event, eOpts) {
                    event.preventDefault();
                    event.stopEvent();
                },   
                //目录树单击事件
                'itemclick' : function(view, rcd, item, idx, event, eOpts) {
                    event.stopEvent();
                    if(rcd.get('fs_isdir')!=0 && rcd.get('fs_parent')!='0'){
                        Ext.getCmp('logtreepathvalue').setValue(rcd.get('fs_code'));
                        Ext.getCmp('logtreepathid').setValue(rcd.get('fs_id'));
                    }else if(rcd.get('fs_parent')=='0'){
                        Ext.getCmp('logtreepathvalue').setValue('');
                        Ext.getCmp('logtreepathid').setValue('');
                    }
                },
                //目录树双击击事件
                'itemdblclick' : function(view, rcd, item, idx, event, eOpts) {
                    event.stopEvent();
                },
                'beforeitemexpand': function(rcd, eOpts){
                    this.store.setProxy({
                        type:'ajax', 
                        url:base_path + "index.php?c=document&a=listdocument&showshare=1&fs_id="+rcd.raw.fs_id,
                        reader:'json'
                    });
                }
            }
        }];
        this.buttons=[{
            text: '确 定',
            handler: function(){
                var logtreepathvalue = Ext.getCmp('logtreepathvalue').getValue();
                var logtreepathid = Ext.getCmp('logtreepathid').getValue();  
                if(!logtreepathvalue || !logtreepathid){
                    Ext.Msg.alert('提示', '请选择目标文件夹！');
                    return false;
                }else{
                    logrcd.fs_parent = logtreepathid;
                    var msgTip = new Ext.LoadMask({
                        target: Ext.getBody(),
                        msg:'正在处理，请稍候...',  
                        removeMask : true                     
                    });  
                    msgTip.show();  
                    Ext.Ajax.request({
                        url: base_path + "index.php?c=document&a=recoverdocument",
                        params : logrcd,
                        method : 'POST',
                        timeout: 600000,
                        success: function(response, options){
                            msgTip.hide();
                            var result = Ext.JSON.decode(response.responseText); 
                            if(result.success){
                                Ext.Msg.alert('提示', result.msg);
                            }else{
                                Ext.Msg.alert('提示', result.msg); 
                            }
                        },
                        failure: function(resp,opts) {
                            msgTip.hide();
                            Ext.Msg.alert('提示', '操作失败！  ');   
                        }      
                    });
                }
            }
        },{
            xtype: 'textfield',
            readOnly: true,
            id: 'logtreepathvalue'
        },{
            xtype: 'hiddenfield',
            id: 'logtreepathid'
        }];
        this.callParent(arguments);
    },
    onRender: function(){
        this.callParent(arguments);
    }
})