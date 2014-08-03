Ext.define('FS.view.workgroup.UserTree',{
    extend: 'Ext.window.Window',
    alias: 'widget.usertree',
    layout:'fit',
    width:600,
    height: 500,
    autoScroll: true,
    resizable: true,
    shadow: true,
    modal: true,
    closable: true,
    initComponent: function(){
        var userrcd=this.initialConfig.rcd;
        this.items=[{
            xtype: 'treepanel',
            rootVisible: false,
            singleExpand: false,
            width:'100%',
            autoScroll:true,
            autoHeight: true,
            border:0,
            store:  new Ext.data.TreeStore({
                proxy:{
                    type: 'ajax',
                    url: base_path + "index.php?c=usergroup&a=listusertree&u_id="+userrcd.get('u_id'),
                    reader: 'json'
                },
                autoLoad: true, 
                fields:['fs_id', 'fs_name', 'text', 'fs_intro', 'fs_fullpath', 'fs_isdir', 'fs_type']
            }),
            listeners : { 
            /*  
                //目录树双击击事件
                'itemdblclick' : function(view, rcd, item, idx, event, eOpts) {
                    if(rcd.raw.fs_isdir=='0'){
                        openfile(view, rcd, item, idx, event, eOpts);
                    }
                },
                */
                'beforeitemexpand': function(rcd, eOpts){
                    this.store.setProxy({
                        type:'ajax', 
                        url: base_path + "index.php?c=usergroup&a=listusertree&u_id="+userrcd.get('u_id')+"&fs_id="+rcd.get('fs_id'),
                        reader:'json'
                    });
                }
            }
        }];
        this.callParent(arguments);
    },
    onRender:function(){
        this.setTitle(this.initialConfig.rcd.get('u_name')+'-目录结构');
        this.callParent(arguments);
    }
})