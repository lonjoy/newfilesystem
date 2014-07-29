Ext.define('FS.controller.Email', {
    extend: 'Ext.app.Controller',

    stores:['Email'],
    views:[       
    'email.Email',
    'email.CheckForm'
    ],
    init: function(){
        this.control({
            'email':{
                render: this.emailRender
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
    }
})
