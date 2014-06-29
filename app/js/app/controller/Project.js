Ext.define('FS.controller.Project',{
    extend: 'Ext.app.Controller',
    stores: [
    'List',
    'HistoryList',
    'ParentRecord',
    'FileUpload'
    ],
    views:[
    'project.List',
    'project.PowerMenu',
    'project.HistoryList',
    'swfupload.UploadPanel'        
    ],
    init: function(){
        this.control({
            'projectList': {
                containercontextmenu: this.powermenufun,
                itemdblclick: this.opendoc,
                itemcontextmenu: this.powermenufun
            },
            'powermenu':{
                click: this.getfunction
            },
            'fileuploadPanel': {
                onQueued: function(file){
                    alert(222);
                }
            }

        });
        this.powermenu = Ext.widget('powermenu');
    },
    //菜单功能
    opendoc: function(view, rcd, item, index, event){
        event.preventDefault();
        event.stopEvent();
        if(rcd.get('fs_isdir')==1){
            //add parent record
            this.getParentRecordStore().removeAll();
            this.getParentRecordStore().add(rcd);
            view.ownerCt.getStore().load({params:{fs_id:rcd.get('fs_id')}});
        }
        if(rcd.get('fs_isdir')==0){
            window.open(base_path + "index.php?c=document&a=openfile&fs_id="+rcd.get('fs_id')+'&t='+rcd.get('fs_type'));
        }
    },
    //权限菜单
    powermenufun: function(view, rcd, item, index, event){
        if(arguments.length==2){
            arguments[1].preventDefault();
            arguments[1].stopEvent();
            this.gridview=arguments[0];
            var obj='gridmenu';
            this.rcd=undefined;
            this.item=undefined;
            this.event=event;
            this.powermenu.addMenuItem(null,null, obj); //根据是否是文件进行显示
            this.powermenu.showAt(arguments[1].getXY());
        }else{
            event.preventDefault();
            event.stopEvent();
            view.getSelectionModel().select(rcd);
            //防止重复创建VIEW
            this.rcd=rcd;
            this.gridview=view;
            this.item=item;
            this.rowindex=index;
            this.event=event;
            var obj='powermenu';
            this.powermenu.addMenuItem(rcd.get('fs_isdir'),rcd.get('fs_parent'), obj); //根据是否是文件进行显示
            this.powermenu.showAt(event.getXY());
        }
    },
    getfunction: function(menu, item, e){
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

    },
    alterfile: function(view, rcd, item, index, event){
        if(rcd.get('fs_isdir')==1){
            this.editdocumentformPanel(view, rcd, item, index, event);
        }else{
            this.editfileformPanel(view, rcd, item, index, event); 
        }
    },
    addshare: function(view, rcd, item, index, event){
        sharedoc_setting(rcd);
    },
    cannelshare: function(view, rcd, item, index, event){
        sharedoc_delsetting(rcd);
    },
    history: function(view, rcd, item, index, event){
        var panel = Ext.widget("historypanel");
        var win = Ext.create('Ext.window.Window',{
            layout:'fit',
            width:700,
            height: 400,
            closeAction:'hide',
            resizable: false,
            shadow: true,
            modal: true,
            items: panel
        });
        panel.getView().getStore().load({params:{fs_id:rcd.get('fs_id')}});
        win.setTitle('历史版本');
        win.show();
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
                        url: base_path + "index.php?c=document&a=downloadfile",
                        params : rcd.getData(),
                        method : 'POST',
                        success: function(response, options){
                            msgTip.hide();
                            var result = Ext.JSON.decode(response.responseText);
                            if(result.success){
                                location.href=base_path + "index.php?c=document&a=downloadfile&file="+result.msg;
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
        powersettingformPanel(rcd);
    },
    del: function(view, rcd, item, index, event){
        Ext.Msg.show({  
            title:'提示',
            closable: false, 
            msg:'确定删除 '+rcd.get('text'), 
            icon:Ext.MessageBox.QUESTION,
            buttons: Ext.Msg.OKCANCEL,
            fn: function(btn){
                if(btn=='ok'){
                    var msgTip = Ext.MessageBox.show({
                        title:'提示',
                        width: 250,
                        msg: '正在删除……'
                    });
                    Ext.Ajax.request({
                        url: base_path + "index.php?c=document&a=deldocument",
                        params : rcd.getData(),
                        method : 'POST',
                        success: function(response, options){
                            msgTip.hide();
                            var result = Ext.JSON.decode(response.responseText);
                            if(result.success){
                                Ext.Msg.alert('提示', result.msg);
                                view.getStore().remove(rcd);
                                view.refresh();
                                return true;
                            }else{
                                Ext.Msg.alert('提示', result.msg);
                                view.refresh(); 
                                return false;
                            }
                        }
                    });
                }
                return false;
            } 
        });
    },
    newdir: function(view, rcd, item, index, event){
        if(typeof rcd=='undefined'){ //if it is gridmenu
            var parent_record = this.getParentRecordStore().getAt(0);
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
                            url: base_path+'index.php?c=document&a=adddocument',
                            method: 'post',
                            timeout: 30,
                            params: adddocumentformPanel.getForm().getValues,
                            success: function(form, action){
                                Ext.Msg.alert('温馨提示', action.result.msg);
                                view.ownerCt.getStore().load({params:{fs_id:parent_record.get('fs_id')}});
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
            var parent_record = this.getParentRecordStore().getAt(0);
        }else{
            var parent_record=rcd;
        }
        var win = Ext.create('Ext.window.Window',{
            layout:'fit',
            width:'80%',
            resizable: false,
            modal: true,
            closable : true,
            items: Ext.widget('fileuploadPanel', {parent_record:parent_record, savePath:parent_record.get('fs_fullpath')})//this.getSwfuploadUploadPanelView()
        });
        win.setTitle('上传文件---文件夹'+parent_record.get('text'));
        win.show();
        /*
        var uppanel = Ext.create('Org.fileupload.Panel',{
            //var uppanel = Ext.create('Org.dragfileupload.Panel',{
            width : '100%',
            title : '上传文件---文件夹'+rcd.get('text'),
            items : [
            {
                border : false,
                fileSize : 1024*1000000,//限制文件大小单位是字节
                uploadUrl : base_path+'index.php?c=upload',//提交的action路径
                flashUrl : js_path+'swfupload/swfupload.swf',//swf文件路径
                filePostName : 'uploads', //后台接收参数
                fileTypes : '*.*',//可上传文件类型
                parentNode : rcd,
                postParams : {savePath:rcd.get('fs_fullpath'), fs_id:rcd.get('fs_id')} //http请求附带的参数
            }
            ]
        });
        */
    },
    refreshtree: function(view, rcd, item, index, event){
        refreshtree(rcd, 1);
    },

    //文件夹编辑
    editdocumentformPanel:function(view, rcd, item, index, event){
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
                            url: base_path+'index.php?c=document&a=editdocument',
                            method: 'post',
                            timeout: 30,
                            params: editprojectform.getForm().getValues(),
                            success: function(form, action){
                                Ext.Msg.alert('温馨提示', action.result.msg);
                                rcd.set('text', action.result.data.document_pathname);
                                rcd.set('fs_name', action.result.data.document_name);
                                rcd.set('fs_intro', action.result.data.document_intro);
                                rcd.set('fs_encrypt', action.result.data.fs_encrypt);
                                rcd.set('fs_lastmodify', action.result.data.fs_lastmodify);
                                rcd.commit();
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
                            url: base_path+'index.php?c=document&a=editfile',
                            method: 'post',
                            timeout: 30,
                            params: editprojectform.getForm().getValues(),
                            success: function(form, action){
                                win.hide();
                                Ext.Msg.alert('温馨提示', action.result.msg);

                                rcd.set('text', action.result.data.document_pathname);

                                rcd.set('fs_name', action.result.data.document_name);
                                rcd.set('fs_intro', action.result.data.document_intro);
                                rcd.set('fs_haspaper', action.result.data.fs_haspaper);
                                rcd.set('fs_encrypt', action.result.data.fs_encrypt);
                                rcd.set('fs_lastmodify', action.result.data.fs_lastmodify);
                                rcd.commit();
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
});