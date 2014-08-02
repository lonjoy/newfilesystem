Ext.define('FS.controller.Email', {
    extend: 'Ext.app.Controller',

    stores:['Email','Emailp', 'Tree'],
    views:[       
    'email.Email',
    'email.CheckForm',
    'email.StoreDocument'
    ],
    init: function(){
        this.control({
            'email':{
                render: this.emailRender,
                itemcontextmenu: this.emailcontentmenu
            },
            'checkemailform button[id="userpasswordvaluebtn"]':{
                click: this.submitcheckform  
            },
            'checkemailform':{
                close: this.checkformclose
            }
        });
    },
    refs:[{
        ref: 'email',
        selector: 'email'
    },{
        ref: 'checkemailform',
        selector: 'checkemailform'
    }],
    emailRender:function(){
        this.checkformpanel = Ext.widget("checkemailform");
        this.checkformpanel.show();
    },
    checkformclose: function(){
        if(typeof this.getEmail()!='undefined'){
            this.getEmail().ownerCt.ownerCt.getActiveTab().close()
        }
    },
    submitcheckform: function(){
        var me=this;
        Ext.Ajax.request({
            url: base_path + "index.php?c=email&a=checkEmail",
            params : this.getCheckemailform().items.getAt(0).getValues(),
            method : 'POST',
            timeout: 600000,
            success: function(response, options){
                if(response.responseText){
                    var result = Ext.JSON.decode(response.responseText); 
                    if(result.success){
                        me.getEmailpStore().removeAll();
                        me.getEmailpStore().add({p:me.getCheckemailform().items.getAt(0).getValues().userpasswordvalue});
                        me.getEmailStore().getProxy().extraParams={maillistnum:me.getCheckemailform().items.getAt(0).getValues().maillistnum};
                        me.getEmailStore().load();
                        me.checkformpanel.hide();
                        return true;
                    }else{
                        Ext.Msg.alert('提示', result.msg); 
                        return false;
                    }
                }
            },
            failure: function(resp,opts) {
                msgTip.hide();
                Ext.Msg.alert('提示', '操作失败！  ');   
            }      
        });
    },
    emailcontentmenu:function(view, rcd, item, index, event){
        event.stopEvent();
        var me=this;
        Ext.create('Ext.menu.Menu', {
            float: true,
            items:[{
                text: '收邮件',
                iconCls: 'icon_email',
                handler: function(obj, event){
                    me.showprojectdoc(rcd);
                }
            }]
        }).showAt(event.getXY());
    },
    showprojectdoc:function(rcd){
        //rcd.set('p', this.getEmailpStore().getAt(0).get('p'));
        //var param=rcd.raw;
        //param.p=this.getEmailpStore().getAt(0).get('p');
        var win=Ext.widget("storedocument", {rcd:rcd, store:this.getTreeStore()});;
        win.show();
    }
})
