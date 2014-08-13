Ext.define('FS.controller.WorkgroupView', {
    extend: 'Ext.app.Controller',
    stores: [
    'WorkgroupTreeTwo',
    'WorkgroupList'
    ],
    views:[
    'workgroup.WorkgroupView',
    'workgroup.List',
    'workgroup.Tree',
    'workgroup.EditWorkgroup',       
    'workgroup.AddWorkgroup',
    'workgroup.AddGroupUser',       
    'workgroup.EditGroupUser',       
    'workgroup.UserTree'       
    ],
    refs:[{
        ref: 'editWorkgroup',
        selector: 'editworkgroup' 
    },{
        ref: 'workgroupTreeList',
        selector: 'workgroupTreeList' 
    },{
        ref: 'addWorkgroup',
        selector: 'addworkgroup' 
    },{
        ref: 'addGroupuser',
        selector: 'addgroupuser' 
    },{
        ref: 'editGroupUser',
        selector: 'editgroupuser' 
    }],
    init: function(){
        this.control({
            'workgroupTreeList':{
                itemexpand: this.itemexpand,
                beforeitemexpand:this.beforeitemexpand,
                itemcontextmenu : this.workcontextmenu,
                itemclick: this.itemclick
            },
            'workgroupList':{
                itemdblclick: this.itemclick
            },
            'editworkgroup button':{
                click:this.summitworkgroupinfo
            },
            'addworkgroup button': {
                click:this.addworkgroup
            },
            'addgroupuser button': {
                click: this.addgroupuser
            },
            'editgroupuser button':{
                click: this.editgroupuser 
            }
        });
    },
    workcontextmenu:function(view, rcd, item, idx, event) {
        event.preventDefault();
        event.stopEvent();
        var me=this;
        var editworkgroup=addworkgroup=addgroupuser=delgroupuser=false;
        for(var p=0; p<power.length; p++){
            switch(power[p]){
                case 'editworkgroup' : editworkgroup=true;break;
                case 'addworkgroup': addworkgroup=true;break;
                case 'addgroupuser': addgroupuser=true;break;
                case 'delgroupuser': delgroupuser=true;break;
            }
        }
        var editworkgroup_obj=addworkgroup_obj=addgroupuser_obj=delgroupuser_obj=null;
        if(editworkgroup){
            editworkgroup_obj = {
                text: '编辑',
                iconCls: 'icon-edit',
                handler: function(){
                    this.up("menu").hide();
                    if(rcd.get('u_isgroup')=='1'){
                        me.editworkgroupform(rcd);
                    }else{
                        me.editgroupuserform(rcd);
                    }
                }
            };
        }
        if(addworkgroup && (login_user.u_grade=='99' || login_user.u_grade=='100')){
            addworkgroup_obj={
                text: '添加工作组',
                iconCls: 'icon-user-add',
                handler: function(){
                    this.up("menu").hide();
                    me.addworkgroupform();
                }
            };
        }
        if(addgroupuser && rcd.get('u_isgroup')==1){
            addgroupuser_obj={
                text:'添加组员',
                iconCls: 'icon-user-add',
                handler: function(){
                    this.up('menu').hide();
                    me.addworkgroupuserform(rcd);
                }
            };
        }
        if(delgroupuser && rcd.get('u_isgroup')==0){
            delgroupuser_obj={
                text: '删除组员',
                iconCls: 'icon-user-del',
                handler: function(){
                    this.up("menu").hide();
                    Ext.Msg.show({  
                        title:'提示',
                        closable: false, 
                        msg:'确定要删除 '+rcd.parentNode.get('text')+' '+rcd.get('u_name')+' 组员信息吗？', 
                        icon:Ext.MessageBox.QUESTION,
                        buttons:Ext.Msg.OKCANCEL,
                        fn: function(btn){
                            if(btn=='ok'){
                                deletegroupuser(rcd.get('u_id'));
                            }
                            return false;
                        } 
                    }); 
                } 
            }
        }
        var refresh = {
            text: '刷新',
            iconCls: 'refresh',
            handler: function(){
                this.up("menu").hide();
                me.getWorkgroupTreeTwoStore().reload();
            } 
        }
        var menu = new Ext.menu.Menu({
            float: true
        });
        rcd.raw.u_isgroup=='1' && menu.add(refresh);
        Ext.isEmpty(editworkgroup_obj) || menu.add(editworkgroup_obj);
        Ext.isEmpty(addworkgroup_obj) || menu.add(addworkgroup_obj);
        Ext.isEmpty(addgroupuser_obj) || menu.add(addgroupuser_obj);
        Ext.isEmpty(delgroupuser_obj) || menu.add(delgroupuser_obj);
        menu.showAt(event.getXY());
    },
    beforeitemexpand: function(rcd){
        if(rcd.get('u_isgroup')=='1'){
            this.getWorkgroupTreeTwoStore().setProxy({
                type:'ajax', 
                url: base_path + "index.php?c=usergroup&a=listgroupuser&groupid="+rcd.get('u_id'),
                reader:'json'
            });
        }
    },
    itemexpand: function(rcd){
        if(login_user.u_grade=='1'){
            this.getWorkgroupListStore().getProxy().extraParams={workgroup_id:login_user.u_targetgroup}; 
        }else{
            this.getWorkgroupListStore().getProxy().extraParams={workgroup_id:rcd.get('u_id')}; 
        }
        this.getWorkgroupListStore().load();
    },
    itemclick:function(view, rcd, item, index, event){
        event.preventDefault();
        event.stopEvent();
        view.toggleOnDblClick=false;
        if(rcd.get('u_isgroup')=='1'){
            this.getWorkgroupListStore().getProxy().extraParams={workgroup_id:rcd.get('u_id')};
            this.getWorkgroupListStore().load();
        }else{
            this.showUserTree(view, rcd, item, index, event);
        }
    },
    editworkgroupform: function(rcd){
        var win=Ext.widget('editworkgroup', {rcd:rcd});
        win.show();
    },
    summitworkgroupinfo: function(){
        var me=this;
        var editworkgrouppanel=this.getEditWorkgroup().items.getAt(0);
        if(editworkgrouppanel.getForm().isValid()){
            editworkgrouppanel.getForm().submit({
                url: base_path + 'index.php?c=usergroup&a=editgroup',
                method: 'post',
                timeout: 30,
                params: editworkgrouppanel.getForm().getValues(),
                success: function(form, action){
                    Ext.Msg.alert('温馨提示', action.result.msg);
                    //me.getEditWorkgroup().initialConfig.rcd.set('u_name', editworkgrouppanel.getForm().getValues().workgroup_name);
                    me.getWorkgroupTreeTwoStore().setProxy({type: 'ajax',
                        url: base_path + "index.php?c=usergroup&a=listworkgroup",//&type=checkbox
                        reader: {
                            type: 'json',
                            root: ''
                        }
                    });
                    me.getWorkgroupTreeTwoStore().load();
                    me.getEditWorkgroup().close();
                },
                failure: function(form, action){
                    Ext.Msg.alert('温馨提示', action.result.msg);
                }
            });
        }
    },
    editgroupuserform:function(rcd){
        var win=Ext.widget('editgroupuser', {rcd:rcd});
        win.show();
    },
    editgroupuser:function(){
        var me=this;
        var editworkgrouppanel=this.getEditGroupUser().items.getAt(0);
        if(editworkgrouppanel.form.isValid()){
            var formparams = editworkgrouppanel.getForm().getValues();
            editworkgrouppanel.getForm().submit({
                url: base_path + 'index.php?c=usergroup&a=editgroupuser',
                method: 'post',
                timeout: 30,
                params: formparams,
                success: function(form, action){
                    Ext.Msg.alert('温馨提示', action.result.msg);
                    me.getWorkgroupListStore().reload();
                    me.getWorkgroupTreeTwoStore().reload();
                    me.getEditGroupUser().close();
                },
                failure: function(form, action){
                    Ext.Msg.alert('温馨提示', action.result.msg);
                }
            });
        }
    },
    addworkgroupform: function(){
        var win=Ext.widget('addworkgroup');
        win.show();
    },
    addworkgroup: function(){
        var me=this;
        var addworkgroupPanel=this.getAddWorkgroup().items.getAt(0);
        if(addworkgroupPanel.getForm().isValid()){
            addworkgroupPanel.getForm().submit({
                url: base_path+'index.php?c=usergroup&a=addworkgroup',
                method: 'post',
                timeout: 30,
                params: addworkgroupPanel.getForm().getValues,
                success: function(form, action){
                    Ext.Msg.alert('温馨提示', action.result.msg);
                    me.getAddWorkgroup().close();
                    me.getWorkgroupTreeTwoStore().setProxy({type: 'ajax',
                        url: base_path + "index.php?c=usergroup&a=listworkgroup",//&type=checkbox
                        reader: {
                            type: 'json',
                            root: ''
                        }
                    });
                    me.getWorkgroupTreeTwoStore().load();
                },
                failure: function(form, action){
                    Ext.Msg.alert('温馨提示', action.result.msg); 
                }
            });
        }
    },
    addworkgroupuserform:function(rcd){
        var win=Ext.widget('addgroupuser', {rcd:rcd});
        win.show();
    },
    addgroupuser:function(){
        var me=this;
        var addgroupuserPanel=this.getAddGroupuser().items.getAt(0);
        if(addgroupuserPanel.getForm().isValid()){
            addgroupuserPanel.getForm().submit({
                url: base_path+'index.php?c=usergroup&a=addgroupuser',
                method: 'post',
                timeout: 30,
                params: addgroupuserPanel.getForm().getValues,
                success: function(form, action){
                    Ext.Msg.alert('温馨提示', action.result.msg);
                    me.getWorkgroupTreeTwoStore().reload();
                    me.getAddGroupuser().close();
                },
                failure: function(form, action){
                    Ext.Msg.alert('温馨提示', action.result.msg);
                }
            });
        }
    },
    showUserTree: function(view, rcd, item, index, event){
        var win=Ext.widget('usertree', {rcd:rcd});
        win.show();
    }
})
