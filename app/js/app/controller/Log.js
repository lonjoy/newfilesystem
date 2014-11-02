Ext.define('FS.controller.Log', {
    extend: 'Ext.app.Controller',

    stores:['SystemLog', 'DocumentLog', 'Tree'],
    views:[       
    'log.SystemLog',
    'log.DocumentLog',
    'log.DocumentTree'
    ],
    init: function(){
        this.control({
            'documentlog':{
                itemcontextmenu: this.itemcontextmenu
            }
        })
    },
    itemcontextmenu: function(view, rcd, item, index, event){
        event.stopEvent();
        var recoverdocument_flag=false; 
        for(var p=0; p<power.length; p++){
            switch(power[p]){
                case 'recoverdocument' : recoverdocument_flag=true;break;
            }
        }
        if(recoverdocument_flag && rcd.get('log_type')=='删除' && parseInt(rcd.get('fs_size'))>0){
            var obj=this;
            var menu = Ext.create('Ext.menu.Menu', {
                float: true,
                items:[{
                    text: '恢复',
                    iconCls: 'icon-doc-rollback',
                    handler: function(){
                        this.up("menu").hide();
                        var msgTip = Ext.MessageBox.show({
                            title:'提示',
                            width: 250,
                            msg: '正在恢复中……'
                        }); 
                        //AJAX请求恢复
                        Ext.Ajax.request({
                            url: base_path + "index.php?c=document&a=recoverdocument",
                            params : rcd.data,
                            method : 'POST',
                            success: function(response, options){
                                msgTip.hide();
                                var result = Ext.JSON.decode(response.responseText);
                                if(result.success){
                                    Ext.Msg.alert('提示', result.msg);
                                    return true;
                                }else{
                                    var win=Ext.widget("documenttree", {rcd:rcd, store:obj.getTreeStore()});;
                                    win.show();
                                    //Ext.Msg.alert('提示', result.msg); 
                                    //return false;
                                }
                            }
                        });

                    }
                }]
            });
            menu.showAt(event.getXY());
        }
    }

})
