Ext.define('FS.controller.ProjectTree', {
    extend: 'Ext.app.Controller',

    stores:['Tree'],
    views:[       
    'project.Tree',
    ],

    init: function(){
        this.control({
            'projectTreeList':{
                beforeitemmove:function(node, oldParent, newParent, index, eOpts){
                    if(Ext.isEmpty(newParent) || newParent.get('id')=='root' || newParent.raw.fs_isdir=='0'){
                        Ext.Msg.alert('提示', '目标文件夹错误， 请重现选择');
                        return false;
                    }
                    Ext.Msg.show({  
                        title:'提示',
                        closable: false, 
                        msg:'确定移动'+node.get('text')+' 到 '+newParent.get('text')+'下吗？', 
                        icon:Ext.MessageBox.QUESTION,
                        buttons: Ext.Msg.YESNO,
                        fn: function(btn){
                            if(btn=='yes'){
                                dragtreepaneldata(node, oldParent, newParent);
                            }
                            return false;
                        } 
                    });
                    return false;
                },
                //文件夹树单击事件
                itemclick : this.itemclick,     
                //文件夹树单击事件
                beforeitemdbclick : function(view, rcd, item, idx, event, eOpts) {
                    event.stopEvent();
                    return false;
                },    
                //文件夹树双击击事件
                itemdblclick : this.itemdblclick,
                beforeitemexpand: this.beforeitemexpand,

                itemcollapse: this.itemcollapse,
                //文件夹数右键事件
                itemcontextmenu : function(view, rcd, item, idx, event, eOpts) {
                    event.preventDefault();
                    event.stopEvent();
                    var selectlength = projectTreePanel.getSelectionModel().selected.length;
                    if(selectlength>1){
                        showmenu(view, rcd, item, idx, event, eOpts);
                        return false;
                    }else{
                        projectTreePanel.getSelectionModel().select(rcd); 
                        showmenu(view, rcd, item, idx, event, eOpts);
                    }
                }
            }
        })
    },
    itemcollapse : function(rcd){
        //this.getProjectTreeView().create().getView().getSelectionModel().select(rcd);
        this.getProjectTreeView().create().selectPath(rcd.getPath());
    },
    beforeitemexpand: function(rcd){
        this.getTreeStore().getProxy().extraParams={fs_id:rcd.get('fs_id')};
    },
    itemdblclick : function(view, rcd, item, index, event) {
        //alert(Ext.create('FS.controller.ProjectTree'));
        //console.log(Ext.create('FS.controller.ProjectTree'));
        event.stopEvent();
        if(rcd.get('fs_isdir')=='0'){
            openfile(view, rcd, item, index, event);
        }else{
            return false;
        }
    },
    itemclick : function(view, rcd, item, index, event) {
        event.stopEvent();
        console.log(this.application.getController('Project').getProjectListView());
        //this.application.getController('Project').opendoc(view, rcd, item, index, event);
        return false;
    },
})
