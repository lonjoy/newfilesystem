Ext.define('FS.controller.CommonView', {
    extend: 'Ext.app.Controller',
    stores: ['CommonList', 'CommonTree', 'CommonParentRecord', 'FileUpload'],
    views:[
    'common.List',
    'common.PowerMenu',
    'swfupload.ShareUploadPanel',
    'swfupload.ShareDragUploadPanel',        
    'common.PowerSetting',
    'common.CommonView',        
    'common.Tree'
    ],
    refs:[{
        ref: 'commonTree',
        selector: 'commontree'
    },{
        ref: 'commonList',
        selector: 'commonlist'
    },{
        ref: 'powerMenu',
        selector: 'commonpowermenu'
    }],
    init: function(){
        this.control({
            'commontree':{
                itemclick : function(){new Ext.util.DelayedTask().delay(1500, this.delayitemclick, this, [arguments,'click']);}, 
                itemdblclick : function(){new Ext.util.DelayedTask().delay(500, this.delayitemclick, this, [arguments,'dbclick']);},
                beforeitemexpand: this.beforeitemexpand,
                itemcollapse: this.itemcollapse,
                itemcontextmenu : this.powermenufun,
                beforeitemmove : this.beforeitemmove
            },
            'commonlist': {
                containercontextmenu: this.powermenufun,
                itemdblclick: this.opendoc,
                itemcontextmenu: this.powermenufun
            },
            'commonlist pagingtoolbar button': {
                click: function(obj, event){
                    //get store getProxy , then proxy has extraParams param to set add param
                    if(typeof this.getCommonParentRecordStore().getAt(0)!='undefined'){
                        this.getCommonListStore().getProxy().extraParams={fs_id:this.getCommonParentRecordStore().getAt(0).get('fs_id')};
                    }
                }
            },
            'commonlist button[iconCls="go_history"]': {
                click: this.gohistory
            },
            'commonlist button[iconCls="go_forward"]': {
                click: this.goforward
            },
            'commonpowermenu':{
                click: this.getfunction
            },
            'sharefileuploadPanel button[text="使用拖拽上传模式"]':{
                click: function(buttonobj,e){
                    buttonobj.ownerCt.ownerCt.ownerCt.close();
                    this.dragupload(this.gridview, this.rcd, this.event);
                }
            },
            'sharedragfileuploadPanel button[text="返回原有上传模式"]':{
                click: function(buttonobj,e){
                    buttonobj.ownerCt.ownerCt.ownerCt.close();
                    this.upload(this.gridview, this.rcd, this.item, this.rowindex, this.event);
                }
            },
            'commonpowersetting button':{
                click: function(obj, e){
                    var me=this;
                    var rcd=obj.ownerCt.ownerCt.rcd;
                    var win=obj.ownerCt.ownerCt;
                    var powersettingPanel=Ext.getCmp('commonpowersettingform');
                    console.log(powersettingPanel);
                    if(powersettingPanel.getForm().isValid()){
                        powersettingPanel.getForm().submit({
                            url: base_path+'index.php?c=document&a=addsharedocpower',
                            method: 'post',
                            timeout: 30,
                            params: powersettingPanel.getForm().getValues(),
                            success: function(form, action){
                                var fs_group=Ext.getCmp('common_workgroup_id').getValue();
                                var fs_user=Ext.getCmp('common_user_id').getValue();
                                var u_id=Ext.getCmp('common_user_id').getValue();
                                var u_name=Ext.getCmp('common_user_id').getRawValue();
                                //grid change record
                                me.getCommonListStore().reload();

                                //tree change record
                                var treercd=me.getCommonTreeStore().getNodeById(rcd.get('fs_id'));
                                treercd.set('fs_group', fs_group);
                                treercd.set('fs_user', fs_user);
                                treercd.set('u_id', u_id);
                                treercd.set('u_name', u_name);
                                treercd.commit();
                                Ext.Msg.alert('温馨提示', action.result.msg);
                                win.close();
                            },
                            failure: function(form, action){
                                Ext.Msg.alert('温馨提示', action.result.msg);
                            }
                        });
                    }
                }
            }
        });
        this.powermenu = Ext.widget('commonpowermenu');
    },
    gohistory:function(obj, event){
        var treercd=this.getCommonTreeStore().getNodeById(this.getCommonParentRecordStore().getAt(0).get('fs_id'));
        if(typeof treercd!='undefined'){
            treercd.collapse(true);
            treercd.parentNode.expand();
            //parent record
            this.getCommonParentRecordStore().removeAll();
            this.getCommonParentRecordStore().add(treercd.parentNode);

            this.getCommonListStore().getProxy().extraParams={fs_id:this.getCommonParentRecordStore().getAt(0).get('fs_id')};
            this.getCommonListStore().load();
        }else{
            obj.setDisabled(true);
        }
        //goforward show
        //Ext.getCmp('go_forward').setDisabled(false);
    },
    goforward:function(){
        project_nav_index=project_nav_index-1;
        if(project_nav_index > 0){
            //屏蔽
        }
    },
    delayitemclick:function(){
        if(arguments[1]=='click'){
            this.itemclick.apply(this, arguments[0]);
        }else{
            this.itemdblclick.apply(this, arguments[0]);
        }
    },
    itemcollapse : function(rcd){
        this.getCommonTree().getSelectionModel().select(rcd);
    },
    beforeitemexpand: function(rcd){
        if(!isNaN(rcd.get('fs_id'))){
            this.getCommonTreeStore().getProxy().extraParams={fs_id:rcd.get('fs_id')};
            this.getCommonListStore().load({params:{fs_id:rcd.get('fs_id')}}); //加载grid数据
            this.getCommonTree().getSelectionModel().select(rcd);

            this.getCommonParentRecordStore().removeAll();
            this.getCommonParentRecordStore().add(rcd);
            //nav
            //this.getNavbarStore().insert(0, rcd);
            Ext.getCmp('common_go_history').setDisabled(false);
        }
    },
    itemclick : function(view, rcd, item, index, event) {
        event.stopEvent();
        view.toggleOnDblClick=false; //取消双击展开折叠菜单行为
        if(rcd.get('fs_isdir')=='1'){
            if(!rcd.isLoaded()){
                this.getCommonTreeStore().getProxy().extraParams={fs_id:rcd.get('fs_id')};
                this.getCommonTreeStore().load({node:rcd, callback:function(){}});
            }

            if(typeof this.getCommonParentRecordStore().getAt(0)!='undefined'){
                if(this.getCommonParentRecordStore().getAt(0).get('fs_id')!=rcd.get('fs_id')){
                    this.getCommonListStore().load({params:{fs_id:rcd.get('fs_id')}}); //加载grid数据
                }
            }else{
                this.getCommonListStore().load({params:{fs_id:rcd.get('fs_id')}}); //加载grid数据 
            }
            this.getCommonParentRecordStore().removeAll();
            this.getCommonParentRecordStore().add(rcd);
            //nav
            //this.getNavbarStore().insert(0, rcd);
            Ext.getCmp('common_go_history').setDisabled(false);
        }
    },
    beforeitemmove:function(node, oldParent, newParent, index, eOpts){
        var me=this;
        if(Ext.isEmpty(newParent) || newParent.get('id')=='1'){
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
                    var nodeid = node.get('fs_id');
                    var oldparentid = oldParent.get('fs_id');
                    var newparentid = newParent.get('fs_id');
                    var msgTip = Ext.MessageBox.show({
                        title:'提示',
                        width: 250,
                        msg: '正在移动……'
                    });
                    Ext.Ajax.request({
                        url: base_path + "index.php?c=document&a=movesharedocument",
                        params : {nodeid:nodeid, nodehashname:node.get('fs_hashname'), oldparentid:oldparentid, newparentid:newparentid, document_name: node.get('fs_name'), fs_type:node.get('fs_type'), fs_size:node.get('fs_size'), fs_intro:node.get('fs_intro'), fs_isdir:node.get('fs_isdir')},
                        method : 'POST',
                        success: function(response, options){
                            msgTip.hide();
                            var result = Ext.JSON.decode(response.responseText);
                            if(result.success){
                                Ext.Msg.alert('提示', result.msg);
                                node.remove();
                                me.getCommonTreeStore().getProxy().extraParams={fs_id:newParent.get('fs_id')};
                                me.getCommonTreeStore().load({node:newParent});
                                me.getCommonTree().getSelectionModel().select(newParent);
                                me.getCommonTree().getView().refresh();
                                me.getCommonListStore().load({params:{fs_id:newParent.get('fs_id')}}); //加载grid数据
                                return true;
                            }else{
                                Ext.Msg.alert('提示', result.msg); 
                                return false;
                            }
                        },
                        failure: function(form, action){
                            Ext.Msg.alert('温馨提示', action.result.msg); 
                            return false;
                        } 
                    });
                }
                return false;
            } 
        });
        return false;
    },
    itemdblclick : function(view, rcd, item, index, event) {
        event.preventDefault();
        event.stopEvent();
        if(rcd.get('fs_isdir')=='0'){
            this.opendoc(view, rcd, item, index, event);
        }
        //this.getCommonTree().getSelectionModel().select(rcd);
    },
    //菜单功能
    opendoc: function(view, rcd, item, index, event){
        event.preventDefault();
        event.stopEvent();
        if(rcd.get('fs_isdir')==1){
            //add parent record
            this.getCommonParentRecordStore().removeAll();
            this.getCommonParentRecordStore().add(rcd);
            this.getCommonListStore().load({params:{fs_id:rcd.get('fs_id')}}); //加载grid数据 
            this.getCommonTreeStore().getNodeById(rcd.get('fs_id')).expand();//加载tree数据
        }
        if(rcd.get('fs_isdir')==0){
            window.open(base_path+"index.php?c=document&a=opensharefile&fs_id="+rcd.get('fs_id')+'&t='+rcd.get('fs_type'));
        }
    },
    //权限菜单
    powermenufun: function(view, rcd, item, index, event){
        var isdirhere=typeof this.getCommonParentRecordStore().getAt(0)!='undefined';
        if(arguments.length==2){
            arguments[1].preventDefault();
            arguments[1].stopEvent();
            if(isdirhere){
                this.gridview=arguments[0];
                var obj='gridmenu';
                this.rcd=this.getCommonParentRecordStore().getAt(0);
                this.item=undefined;
                this.rowindex=undefined;
                this.event=arguments[1];
                this.powermenu.addMenuItem(null,null, obj, this.rcd); //根据是否是文件进行显示
                this.powermenu.showAt(arguments[1].getXY());
            }
        }else{
            event.preventDefault();
            event.stopEvent();
            if(view.getSelectionModel().selected.length==1){
                view.getSelectionModel().select(rcd);
            }
            //防止重复创建VIEW
            this.rcd=rcd;
            this.gridview=view;
            this.item=item;
            this.rowindex=index;
            this.event=event;
            var obj='powermenu';
            this.powermenu.addMenuItem(rcd.get('fs_isdir'),rcd.get('fs_parent'), obj, this.rcd); //根据是否是文件进行显示
            this.powermenu.showAt(event.getXY());
        }
    },
    getfunction: function(menu, item, e){
        if(typeof item=='undefined'){return false;}
        if(item.ename=='open'){
            this.opendoc(this.gridview, this.rcd, this.item, this.rowindex, this.event);
        }else if(item.ename=='copystruct'){
            this.copystruct(this.gridview, this.rcd, this.item, this.rowindex, this.event);
        }else if(item.ename=='alterfile'){
            this.alterfile(this.gridview, this.rcd, this.item, this.rowindex, this.event);
        }else if(item.ename=='addshare'){
            this.addshare(this.gridview, this.rcd, this.item, this.rowindex, this.event);
        }else if(item.ename=='cannelshare'){
            this.cannelshare(this.gridview, this.rcd, this.item, this.rowindex, this.event);
        }else if(item.ename=='history'){
            this.history(this.gridview, this.rcd, this.item, this.rowindex, this.event);
        }else if(item.ename=='download'){
            this.download(this.gridview, this.rcd, this.item, this.rowindex, this.event);
        }else if(item.ename=='powersetting'){
            this.powersetting(this.gridview, this.rcd, this.item, this.rowindex, this.event);
        }else if(item.ename=='del'){
            this.del(this.gridview, this.rcd, this.item, this.rowindex, this.event);
        }else if(item.ename=='newdir'){
            this.newdir(this.gridview, this.rcd, this.item, this.rowindex, this.event);
        }else if(item.ename=='upload'){
            this.upload(this.gridview, this.rcd, this.item, this.rowindex, this.event);
        }else if(item.ename=='refresh'){
            this.refreshtree(this.gridview, this.rcd, this.item, this.rowindex, this.event);
        }
    },
    copystruct: function(view, rcd, item, index, event){
        /*用正则匹配出新的文件夹编号*/
        var fs_name=rcd.get('fs_name');
        var new_fs_name='';
        regex_a=/^-?\d+$/;
        if(regex_a.test(fs_name)){
            int_fs_name=parseInt(fs_name);
            new_fs_name=(int_fs_name + 1);
        }
        var regex_b=/^0+\d+/;
        if(regex_b.test(fs_name)){
            int_fs_name=parseInt(fs_name);
            var pos=fs_name.indexOf(int_fs_name);
            var zerostr=fs_name.substring(0, pos);
            if((int_fs_name + 1).toString().length>int_fs_name.toString().length){
                zerostr=zerostr.substr(0, zerostr.length-1);
            }
            new_fs_name=zerostr + '' + (parseInt(fs_name) + 1);
        }
        var regex_c=/^([A-Za-z]+)(\d+)$/;
        if(regex_c.test(fs_name)){
            regex_c_a=/\d+$/g;
            var regexstr=fs_name.match(regex_c);
            int_fs_name=parseInt(regexstr[2]);
            var pos=fs_name.indexOf(regexstr[1])+regexstr.length;
            var intpos=fs_name.indexOf(int_fs_name);
            var zerostr=fs_name.substring(pos, intpos);
            if((int_fs_name + 1).toString().length>int_fs_name.toString().length){
                zerostr=zerostr.substr(0, zerostr.length-1);
            }
            new_fs_name=regexstr[1] + '' + zerostr + (int_fs_name + 1);
        }
        var regex_istree=/.*?Tree.*?/
        if(regex_istree.test(rcd.id)){
            parentrcd=rcd.parentNode;
        }else{
            parentrcd=this.getCommonParentRecordStore().getAt(0);
        }
        //判断是否是tree触发

        var win=Ext.widget('copydocstruct', {parentrcd:parentrcd, rcd:rcd, new_fs_name:new_fs_name, projectview: this});
        win.show();
    },

    alterfile: function(view, rcd, item, index, event){
        if(rcd.get('fs_isdir')==1){
            this.editdocumentformPanel(view, rcd, item, index, event);
        }else{
            this.editfileformPanel(view, rcd, item, index, event); 
        }
    },

    /*设置共享*/
    addshare: function(view, rcd, item, index, event){
    },

    /*取消共享*/
    cannelshare: function(view, rcd, item, index, event){
    },
    history: function(view, rcd, item, index, event){
        var panel = Ext.widget("historypanel");
        var win = Ext.create('Ext.window.Window',{
            layout:'fit',
            width:700,
            height: 400,
            //closeAction:'hide',
            resizable: true,
            shadow: true,
            modal: true,
            items: panel
        });
        panel.getView().getStore().getProxy().extraParams={fs_id:rcd.get('fs_id')};
        panel.getView().getStore().load();
        win.setTitle('历史版本');
        win.show();
    },
    historymenu:function(view, rcd, item, index, event){
        event.stopEvent();
        var gridmenu =Ext.create('Ext.menu.Menu', {});
        var me=this;
        gridmenu.add({
            text: '下载',
            iconCls: 'icon-doc-download',
            handler: function(obj,e){
                obj.up("menu").hide();
                me.download(view, rcd, item, index, event);
            }
        });
        gridmenu.showAt(event.getXY());
    },
    download: function(view, rcd, item, index, event){
        Ext.Msg.show({  
            title:'提示',
            closable: false, 
            msg:'确定下载 '+rcd.get('fs_intro')+' 吗？', 
            icon:Ext.MessageBox.QUESTION,
            buttons: Ext.Msg.OKCANCEL,
            fn: function(btn){
                if(btn=='ok'){
                    var msgTip = Ext.MessageBox.show({
                        title:'提示',
                        width: 250,
                        msg: '正在获取下载资源……'
                    });

                    Ext.Ajax.request({
                        url: base_path + "index.php?c=document&a=downloadsharefile",
                        params : rcd.getData(),
                        method : 'POST',
                        success: function(response, options){
                            msgTip.hide();
                            var result = Ext.JSON.decode(response.responseText);
                            if(result.success){
                                location.href=base_path + "index.php?c=document&a=downloadsharefile&file="+result.msg;
                                return true;
                            }else{
                                Ext.Msg.alert('提示', result.msg); 
                                return false;
                            }
                        }
                    });    
                }
                return false;
            } 
        });
    },
    powersetting: function(view, rcd, item, index, event){
        var powersettingWin=Ext.widget('commonpowersetting', {rcd:rcd});
        powersettingWin.show();
    },
    del: function(view, rcd, item, index, event){
        var selected_rcd = view.getSelectionModel().selected;
        var me=this;
        Ext.Msg.show({  
            title:'提示',
            closable: false, 
            msg:selected_rcd.length==1 ? '确定删除 '+rcd.get('text') : '确定进行批量删除这'+selected_rcd.length+'个文件么？', 
            icon:Ext.MessageBox.QUESTION,
            buttons: Ext.Msg.OKCANCEL,
            fn: function(btn){
                if(btn=='ok'){
                    me.startdeldocument(selected_rcd, 0);
                    me.getCommonList().getView().refresh();
                    me.getCommonTree().getView().refresh();
                }
                return false;
            } 
        });
    },
    startdeldocument: function(selected_rcd){ //logic has question will 
        var me=this;
        var msgTip = Ext.MessageBox.show({
            title:'提示',
            width: 250,
            msg: '正在删除……'
        });
        var rcd=selected_rcd.items[0]; //first rcd
        if(selected_rcd.length>0){
            Ext.Ajax.request({
                url: base_path + "index.php?c=document&a=delsharedocument",
                params : rcd.getData(),
                method : 'POST',
                success: function(response, options){
                    var result = Ext.JSON.decode(response.responseText);
                    if(result.success){
                        Ext.Msg.alert('提示', result.msg);
                        me.getCommonListStore().remove(rcd);
                        me.getCommonTreeStore().getNodeById(rcd.get('fs_id')).remove();
                        me.startdeldocument(selected_rcd);

                    }else{
                        Ext.Msg.alert('提示', result.msg);
                    }
                }
            });
        }else{
            msgTip.hide(); 
        }
    },
    newdir: function(view, rcd, item, index, event){
        var me=this;
        if(typeof rcd=='undefined'){ //if it is gridmenu
            var parent_record = this.getCommonParentRecordStore().getAt(0);
        }else{
            var parent_record=rcd;
        }
        var adddocumentformPanel = Ext.create('Ext.form.Panel', {
            autoHeight : true,
            frame: true,
            bodyStyle: 'padding: 5 5 5 5',
            defaultType: 'textfield',
            buttonAlign: 'center',
            defaults: {
                autoFitErrors: false,
                labelSeparator : '：',
                labelWidth: 80,
                width: 300,
                labelAlign: 'left'
                //msgTarget: 'under'  
            },
            items: [{
                xtype:'hiddenfield',
                name: 'project_doc_parentid',
                value: parent_record.get('fs_id')
            },{
                xtype:'textfield',
                fieldLabel: '上级文件夹',
                readOnly:true,
                value:parent_record.get('text')
            }, {
                xtype:'textfield',
                name: 'project_doc_name',
                id: 'project_doc_name',
                allowBlank: false,
                blankText: '不允许为空',
                fieldLabel: '文件夹编号'
            }, {
                xtype:'textfield',
                width: 300,
                name: 'project_doc_intro',
                id: 'project_doc_intro',
                allowBlank: false,
                blankText: '不允许为空',
                fieldLabel: '文件夹名称'
            },{
                xtype:'radiogroup',
                fieldLabel: '是否加密',
                width:250,
                items: [
                { boxLabel: '是', name: 'encrypt', inputValue: '1'},
                { boxLabel: '否', name: 'encrypt', inputValue: '0', checked:true}
                ]
            }],
            buttons:[{
                text: '添加',
                handler: function(){
                    if(adddocumentformPanel.form.isValid()){
                        adddocumentformPanel.getForm().submit({
                            url: base_path+'index.php?c=document&a=addsharedocument',
                            method: 'post',
                            timeout: 30,
                            params: adddocumentformPanel.getForm().getValues,
                            success: function(form, action){
                                Ext.Msg.alert('温馨提示', action.result.msg);
                                me.getCommonListStore().load({params:{fs_id:parent_record.get('fs_id')}});
                                me.getCommonTreeStore().load({node:rcd, callback:function(){}});
                                win.close();
                            },
                            failure: function(form, action){
                                Ext.Msg.alert('温馨提示', action.result.msg);
                            }
                        });
                    }
                }
            }]
        });
        var win = Ext.create('Ext.window.Window',{
            layout:'fit',
            width:350,
            resizable: false,
            modal: true,
            closable : true,
            items: adddocumentformPanel
        });
        win.setTitle('新建文件夹');
        win.show();
    },
    upload: function(view, rcd, item, index, event){
        if(typeof rcd=='undefined'){ //if it is gridmenu
            var parent_record = this.getCommonParentRecordStore().getAt(0);
        }else{
            var parent_record=rcd;
        }
        var fileitem=Ext.widget('sharefileuploadPanel', {
            parent_record:parent_record,
            savePath:parent_record.get('fs_fullpath'),
            ListStore:this.getCommonListStore(),
            TreeStore:this.getCommonTreeStore() 
        });
        var fileuploadstore=this.getFileUploadStore();
        var win = Ext.create('Ext.window.Window',{
            layout:'fit',
            width:'80%',
            resizable: true,
            modal: true,
            closable : true,
            items: fileitem,
            listeners:{
                'close':function(panel, eOpts){
                    fileuploadstore.removeAll();
                    fileitem.getComponent('fileuploadgrid').getView().refresh();
                }
            }
        });
        win.setTitle('上传文件---文件夹'+parent_record.get('text'));
        win.show();
    },    
    dragupload: function(view, rcd, event){
        if(typeof rcd=='undefined'){ //if it is gridmenu
            var parent_record = this.getCommonParentRecordStore().getAt(0);
        }else{
            var parent_record=rcd;
        }
        var fileitem=Ext.widget('sharedragfileuploadPanel', {
            parent_record:parent_record,
            savePath:parent_record.get('fs_fullpath'),
            ListStore:this.getCommonListStore(),
            TreeStore:this.getCommonTreeStore()
        });
        var fileuploadstore=this.getFileUploadStore();
        var win = Ext.create('Ext.window.Window',{
            layout:'fit',
            width:'80%',
            resizable: true,
            modal: true,
            closable : true,
            items: fileitem,
            listeners:{
                'close':function(panel, eOpts){
                    fileuploadstore.removeAll();
                    fileitem.getComponent('dragfileuploadgrid').getView().refresh();
                }
            }
        });
        win.setTitle('上传文件---文件夹'+parent_record.get('text'));
        win.show();
    },
    refreshtree: function(view, rcd, item, index, event){
        refreshtree(rcd, 1);
    },

    //文件夹编辑
    editdocumentformPanel:function(view, rcd, item, index, event){
        var me=this;
        var editprojectform = Ext.create('Ext.form.Panel', {
            frame: true,
            bodyStyle: 'padding: 5 5 5 5',
            defaultType: 'textfield',
            buttonAlign: 'center',
            defaults: {
                autoFitErrors: false,
                labelSeparator : '：',
                labelWidth: 80,
                allowBlank: false,
                blankText: '不允许为空',
                labelAlign: 'left',
                msgTarget: 'under'  
            },
            items: [{
                xtype:'hiddenfield',
                name: 'project_doc_id',
                value: rcd.get('fs_id')
            },{
                xtype:'hiddenfield',
                name: 'document_parentid',
                value: rcd.get('fs_parent')
            },{
                xtype:'hiddenfield',
                name: 'project_doc_oldintro',
                value: rcd.get('fs_intro')
            },{
                xtype:'textfield',
                name: 'project_doc_name',
                fieldLabel: '编号',
                width: 250,
                value:rcd.get('fs_name')
            }, {
                xtype:'textfield',
                width: 250,
                name: 'project_doc_intro',
                fieldLabel: '名称',
                value:rcd.get('fs_intro')
            },{
                xtype:'radiogroup',
                fieldLabel: '是否加密',
                width:250,
                items: [
                { boxLabel: '是', name: 'encrypt', inputValue: '1', checked:'1'==rcd.get('fs_encrypt')},
                { boxLabel: '否', name: 'encrypt', inputValue: '0', checked:'0'==rcd.get('fs_encrypt')}
                ]
            }],
            buttons:[{
                text: '确定',
                handler: function(){
                    if(editprojectform.form.isValid()){
                        editprojectform.getForm().submit({
                            url: base_path+'index.php?c=document&a=editsharedocument',
                            method: 'post',
                            timeout: 30,
                            params: editprojectform.getForm().getValues(),
                            success: function(form, action){
                                Ext.Msg.alert('温馨提示', action.result.msg);
                                //grid change record
                                var listrcd=me.getCommonListStore().findRecord('fs_id',rcd.get('fs_id'));
                                if(listrcd==null){
                                    me.getCommonListStore().reload();
                                }else{
                                    listrcd.set('text', action.result.data.document_pathname);
                                    listrcd.set('fs_name', action.result.data.document_name);
                                    listrcd.set('fs_intro', action.result.data.document_intro);
                                    listrcd.set('fs_encrypt', action.result.data.fs_encrypt);
                                    listrcd.set('fs_lastmodify', action.result.data.fs_lastmodify);
                                    listrcd.commit();
                                }
                                //tree change record
                                var treercd=me.getCommonTreeStore().getNodeById(rcd.get('fs_id'));
                                treercd.set('text', action.result.data.document_pathname+'（'+action.result.data.document_intro+'）');
                                treercd.set('fs_name', action.result.data.document_name);
                                treercd.set('fs_intro', action.result.data.document_intro);
                                treercd.set('fs_encrypt', action.result.data.fs_encrypt);
                                treercd.set('fs_lastmodify', action.result.data.fs_lastmodify);
                                treercd.commit();
                                win.hide(); 
                            },
                            failure: function(form, action){
                                Ext.Msg.alert('温馨提示', action.result.msg);
                            }
                        });
                    }
                }
            }]
        });
        var win = Ext.create('Ext.window.Window',{
            layout:'fit',
            width:350,
            closeAction:'hide',
            resizable: false,
            shadow: true,
            modal: true,
            closable : true,
            items: editprojectform
        });
        editprojectform.form.reset();
        editprojectform.isAdd = true;
        win.setTitle('编辑-'+rcd.get('fs_name'));
        win.show();
    },
    //文件编辑
    editfileformPanel: function(view, rcd, item, index, event){
        var me=this;
        var editprojectform = Ext.create('Ext.form.Panel', {
            frame: true,
            bodyStyle: 'padding: 5 5 5 5',
            defaultType: 'textfield',
            buttonAlign: 'center',
            defaults: {
                autoFitErrors: false,
                labelSeparator : '：',
                labelWidth: 100,
                allowBlank: false,
                blankText: '不允许为空',
                labelAlign: 'left',
                msgTarget: 'under'  
            },
            items: [{
                xtype:'hiddenfield',
                name: 'file_id',
                value: rcd.get('fs_id')
            },{
                xtype:'hiddenfield',
                name: 'size',
                value: rcd.get('fs_size')
            },{
                xtype:'hiddenfield',
                name: 'type',
                value: rcd.get('fs_type')
            },{
                xtype:'hiddenfield',
                name: 'file_oldname',
                value: rcd.get('fs_name')
            },{
                xtype:'hiddenfield',
                name: 'file_parentid',
                value: rcd.get('fs_parent')
            },{
                xtype:'textfield',
                name: 'file_name',
                fieldLabel: '编号',
                width: 300,
                value:rcd.get('fs_name')
            }, {
                xtype:'textfield',
                width: 300,
                name: 'file_intro',
                fieldLabel: '名称',
                value:rcd.get('fs_intro')
            }, {
                xtype:'radiogroup',
                fieldLabel: '是否有纸版',
                width:200,
                items: [
                { boxLabel: '是', name: 'haspaper', inputValue: '1',checked:'1'==rcd.get('fs_haspaper')},
                { boxLabel: '否', name: 'haspaper', inputValue: '0',checked:'0'==rcd.get('fs_haspaper')}
                ]
            }, {
                xtype:'radiogroup',
                fieldLabel: '是否加密',
                width:200,
                items: [
                { boxLabel: '是', name: 'encrypt', inputValue: '1', checked:'1'==rcd.get('fs_encrypt')},
                { boxLabel: '否', name: 'encrypt', inputValue: '0', checked:'0'==rcd.get('fs_encrypt')}
                ]
            }],
            buttons:[{
                text: '确定',
                handler: function(){
                    if(editprojectform.form.isValid()){
                        editprojectform.getForm().submit({
                            url: base_path+'index.php?c=document&a=editsharefile',
                            method: 'post',
                            timeout: 30,
                            params: editprojectform.getForm().getValues(),
                            success: function(form, action){
                                win.hide();
                                Ext.Msg.alert('温馨提示', action.result.msg);
                                //grid change record
                                var listrcd=me.getCommonListStore().findRecord('fs_id',rcd.get('fs_id'));
                                listrcd.set('text', action.result.data.document_pathname);
                                listrcd.set('fs_name', action.result.data.document_name);
                                listrcd.set('fs_intro', action.result.data.document_intro);
                                listrcd.set('fs_haspaper', action.result.data.fs_haspaper);
                                listrcd.set('fs_encrypt', action.result.data.fs_encrypt);
                                listrcd.set('fs_lastmodify', action.result.data.fs_lastmodify);
                                listrcd.commit();
                                //tree change record
                                var treercd=me.getCommonTreeStore().getNodeById(rcd.get('fs_id'));
                                treercd.set('text', action.result.data.document_pathname+'（'+action.result.data.document_intro+'）');
                                treercd.set('fs_name', action.result.data.document_name);
                                treercd.set('fs_intro', action.result.data.document_intro);
                                treercd.set('fs_haspaper', action.result.data.fs_haspaper);
                                treercd.set('fs_encrypt', action.result.data.fs_encrypt);
                                treercd.set('fs_lastmodify', action.result.data.fs_lastmodify);
                                treercd.commit();
                            },
                            failure: function(form, action){
                                Ext.Msg.alert('温馨提示', action.result.msg);
                            }
                        });
                    }
                }
            }]
        });

        var win = Ext.create('Ext.window.Window',{
            layout:'fit',
            width:350,
            closeAction:'hide',
            resizable: false,
            shadow: true,
            modal: true,
            closable : true,
            items: editprojectform
        });
        editprojectform.form.reset();
        win.setTitle('编辑-'+rcd.get('fs_name'));
        win.show();
    }
    //file edit function end
})
