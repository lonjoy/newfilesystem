Ext.define('FS.controller.Project',{
    extend: 'Ext.app.Controller',
    stores: [
    'Project'
    ],
    views:[
    'project.List',
    'project.GridMenu',
    'project.PowerMenu'        
    ],
    init: function(){
        this.control({
            'projectList': {
                containercontextmenu: this.gridmenu,
                itemdblclick: this.opendoc,
                itemcontextmenu: this.powermenu
            },
            'powermenu':{
                click: this.getfunction
            }

        });
        this.gridmenu = Ext.widget('gridmenu');
        this.powermenu = Ext.widget('powermenu');
    },
    gridmenu: function(view,  event){
        event.preventDefault();
        event.stopEvent();
        requires:['FS.view.project.GridMenu'],
        Ext.widget('gridmenu').showAt(event.getXY());
    },
    //菜单功能
    opendoc: function(view, rcd, item, index, event){
        event.preventDefault();
        event.stopEvent();
        if(rcd.get('fs_isdir')==1){
            view.ownerCt.getStore().load({params:{fs_id:rcd.get('fs_id')}});
        }
        if(rcd.get('fs_isdir')==0){
            window.open(base_path + "index.php?c=document&a=openfile&fs_id="+rcd.get('fs_id')+'&t='+rcd.get('fs_type'));
        }
    },
    //权限菜单
    powermenu: function(view, rcd, item, index, event){
        event.preventDefault();
        event.stopEvent();

        view.getSelectionModel().select(rcd);
        //防止重复创建VIEW
        this.rcd=rcd;
        this.gridview=view;
        this.item=item;
        this.rowindex=index;
        this.event=event;
        this.powermenu.addMenuItem(rcd.get('fs_isdir')); //根据是否是文件进行显示
        this.powermenu.showAt(event.getXY());
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
            this.editdocumentformPanel(rcd);
        }else{
            this.editfileformPanel(rcd, parentrcd); 
        }
    },
    addshare: function(view, rcd, item, index, event){
        sharedoc_setting(rcd);
    },
    cannelshare: function(view, rcd, item, index, event){
        sharedoc_delsetting(rcd);
    },
    history: function(view, rcd, item, index, event){
        alert('history');
        showhistorygrid(rcd);
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
                    downloadfilefs(rcd);
                }
                return false;
            } 
        });
    },
    powersetting: function(view, rcd, item, index, event){
        powersettingformPanel(rcd);
    },
    del: function(view, rcd, item, index, event){
        var selectlength = projectTreePanel.getSelectionModel().getSelection().length;
        if(selectlength>1){
            var selectrcd = projectTreePanel.getSelectionModel().getSelection();
            var array=[];
            for(var i in selectrcd){
                if(Ext.isEmpty(array)){
                    array.push(selectrcd[i].parentNode);
                }else
                    if(!Ext.Array.contains(array, selectrcd[i].parentNode)){
                    Ext.Msg.alert('提示', '请选择同一个文件夹下的文件进行操作！');
                    return false;
                }
            }
            Ext.Msg.show({  
                title:'提示',
                closable: false, 
                msg:'确定进行批量删除这'+selectlength+'个文件么？', 
                icon:Ext.MessageBox.QUESTION,
                buttons: Ext.Msg.OKCANCEL,
                fn: function(btn){
                    if(btn=='ok'){
                        batch_deldocumentfs(selectrcd);
                    }
                    return false;
                } 
            });
        }else{
            Ext.Msg.show({  
                title:'提示',
                closable: false, 
                msg:'确定删除 '+rcd.get('text'), 
                icon:Ext.MessageBox.QUESTION,
                buttons: Ext.Msg.OKCANCEL,
                fn: function(btn){
                    if(btn=='ok'){
                        deldocumentfs(rcd, parentrcd);
                    }
                    return false;
                } 
            });
        }
    },
    newdir: function(view, rcd, item, index, event){
        adddocumentform(rcd);
    },
    upload: function(view, rcd, item, index, event){
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
    },
    refreshtree: function(view, rcd, item, index, event){
        refreshtree(rcd, 1);
    },


    editdocumentformPanel:function(rcd){
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
                { boxLabel: '是', name: 'encrypt', inputValue: '1', checked:encrypt(1)},
                { boxLabel: '否', name: 'encrypt', inputValue: '0', checked:encrypt(0)}
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
                                if(rcd.index==undefined){ //tree
                                    rcd.set('text', action.result.data.document_pathname + '（'+action.result.data.document_intro+'）');
                                }else{
                                    rcd.set('text', action.result.data.document_pathname);
                                }
                                rcd.set('fs_name', action.result.data.document_name);
                                rcd.set('fs_intro', action.result.data.document_intro);
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
        /*是否加密*/
        function encrypt(val){
            if(val==rcd.get('fs_encrypt')){
                return true;
            } 
            return false;
        }
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
    }
    //file edit function end
});