Ext.define('FS.view.email.StoreDocument',{
    extend: 'Ext.window.Window',
    alias: 'widget.storedocument',
    layout:'fit',
    width:600,
    height: 500,
    autoScroll: true,
    title: '请选择邮件要存储的目录！',
    closeAction:'destroy',
    resizable: true,
    shadow: true,
    modal: true,
    closable: true,
    initComponent: function(){
        var emailrcd=this.initialConfig.rcd.getData();
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
                        Ext.getCmp('emailtreepathvalue').setValue(rcd.get('fs_code'));
                        Ext.getCmp('emailtreepathid').setValue(rcd.get('fs_id'));
                        Ext.getCmp('fs_is_share').setValue(rcd.get('fs_is_share'));
                    }else if(rcd.get('fs_parent')=='0'){
                        Ext.getCmp('emailtreepathvalue').setValue('');
                        Ext.getCmp('emailtreepathid').setValue('');
                        Ext.getCmp('fs_is_share').setValue('');
                    }
                },
                //目录树双击击事件
                'itemdblclick' : function(view, rcd, item, idx, event, eOpts) {
                    event.stopEvent();
                    /*
                    if(rcd.raw.fs_isdir=='0'){
                        openfile(view, rcd, item, idx, event, eOpts);
                    }
                    */
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
            id: 'usersharevaluebtn',
            handler: function(){            
                var emailtreepathvalue = Ext.getCmp('emailtreepathvalue').getValue();
                var emailtreepathid = Ext.getCmp('emailtreepathid').getValue();  
                var emailmsgid = Ext.getCmp('emailmsgid').getValue();
                var emailuidl = Ext.getCmp('emailuidl').getValue();
                var fs_is_share=Ext.getCmp('fs_is_share').getValue();
                if(!emailtreepathvalue){
                    Ext.Msg.alert('提示', '请选择邮件要存储的目录！');
                    return false;
                }else{
                    var msgTip = new Ext.LoadMask({
                        target: Ext.getBody(),
                        msg:'正在处理，请稍候...',  
                        removeMask : true                     
                    });  
                    msgTip.show();  
                    Ext.Ajax.request({
                        url: base_path + "index.php?c=email",
                        params : {emailtreepathvalue:emailtreepathvalue, emailtreepathid:emailtreepathid, emailmsgid:emailrcd.msg_id, emailsubject:emailrcd.subject, emailuidl:emailuidl, fs_is_share:fs_is_share},
                        method : 'POST',
                        timeout: 600000,
                        success: function(response, options){
                            msgTip.hide();
                            var result = Ext.JSON.decode(response.responseText); 
                            if(result.success){
                                listtreestore.reload();
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
            id: 'emailtreepathvalue'
        },{
            xtype: 'hiddenfield',
            id: 'emailtreepathid'
        },{
            xtype: 'hiddenfield',
            id: 'emailmsgid',
            //value: rcd.data.msg_id
        },{
            xtype: 'hiddenfield',
            id: 'emailsubject',
            //value: rcd.data.Subject
        },{
            xtype: 'hiddenfield',
            id: 'emailuidl',
            //value: rcd.data.uidl
        },{
            xtype: 'hiddenfield',
            id: 'fs_is_share',
        }];
        this.callParent(arguments);
    },
    onRender: function(){
        this.callParent(arguments);
    }
})