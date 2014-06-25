Ext.define('FS.controller.PowerMenu',{
    extend: 'Ext.app.Controller',
    views:[
    'project.PowerMenu'        
    ],
    init: function(){
        this.control({
            'powermenu':{
                click: this.getfunction
            }
        });
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
    copystruct: function(view, rcd, item, index, event){

    },
    alterfile: function(view, rcd, item, index, event){
        if(rcd.get('fs_isdir')==1){
            editdocumentformPanel(rcd);
        }else{
            editfileformPanel(rcd, parentrcd); 
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
    }
});