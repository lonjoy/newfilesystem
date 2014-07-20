Ext.define("FS.view.swfupload.UploadPanel", {
    extend : "Ext.panel.Panel",
    alias : "widget.fileuploadPanel",
    layout:"fit",
    initComponent : function() {
        this.width='100%';
        this.height='100%';
        this.continuous=false;//是否连续上传，true为连续上传队列后其他文件,false只上传当前队列开始的文件
        this.parentNode=this.initialConfig.parent_record;
        this.setting={
            upload_url : base_path+'index.php?c=upload', 
            flash_url : js_path+'swfupload/swfupload.swf',
            file_size_limit : 1024*100000000 ,//上传文件体积上限，单位MB
            file_post_name : 'uploads',
            file_types : "*.*",  //允许上传的文件类型 
            file_types_description : "All Files",  //文件类型描述
            file_upload_limit : "0",  //限定用户一次性最多上传多少个文件，在上传过程中，该数字会累加，如果设置为“0”，则表示没有限制 
            file_queue_limit : "50",//上传队列数量限制，该项通常不需设置，会根据file_upload_limit自动赋值              
            post_params : {savePath:this.initialConfig.savePath, fs_id:this.initialConfig.parent_record.get('fs_id')},
            use_query_string : true,
            debug : false,
            button_cursor : SWFUpload.CURSOR.HAND,
            button_window_mode : SWFUpload.WINDOW_MODE.TRANSPARENT,
            custom_settings : {//自定义参数
                scope_handler : this
            },
            swfupload_loaded_handler : function(){
                //console.log("swf组件成功初始化");
            },// 当Flash控件成功加载后触发的事件处理函数
            file_dialog_start_handler : function(){},// 当文件选取对话框弹出前出发的事件处理函数
            file_dialog_complete_handler : function(){},//当文件选取对话框关闭后触发的事件处理
            upload_start_handler : this.upload_start_handler,// 开始上传文件前触发的事件处理函数
            upload_success_handler : this.uploadSuccess,// 文件上传成功后触发的事件处理函数 
            upload_progress_handler :this.uploadProgress,
            upload_complete_handler : this.uploadComplete,
            upload_error_handler : this.onFileError,
            file_queue_error_handler :  this.onFileError,
            file_queued_handler:this.onQueued
        };
        this.items = [ {
            listeners:{
                'itemcontextmenu':function(myself,model,item,index,e,eopt){
                    var selectmodel = myself.getSelectionModel().getSelection();
                    if(selectmodel.length>1){
                        var rightClick = Ext.create('Ext.menu.Menu', {
                            autoDestroy:true,
                            items : [
                            {
                                text : '取消上传',
                                scope:this.ownerCt,
                                handler:function(){
                                    var store = myself.getStore();
                                    for(var i in selectmodel){
                                        var cur_model = selectmodel[i];
                                        this.swfupload.cancelUpload(cur_model.get("id"),false);
                                        store.remove(cur_model);
                                        var stats=this.swfupload.getStats();
                                        var label=Ext.getCmp("queue_id");
                                        label.setText(label.text="文件队列:"+stats.files_queued);
                                    }
                                },
                                icon:"js/swfupload/image/icons/remove.png"
                            }],
                            listeners:{
                                show:function(myself,o){
                                    if(model.get("filestatus")!=-1){
                                        myself.items.getAt(0).setDisabled(true);
                                    }
                                    if(model.get("filestatus")==-4){
                                        myself.items.getAt(1).setDisabled(true);
                                    }
                                }
                            }
                        });
                    }else{  //单文件操作
                        myself.getSelectionModel().select(model); 

                        var rightClick = Ext.create('Ext.menu.Menu', {
                            autoDestroy:true,
                            items : [{
                                scope:this.ownerCt,
                                text : '开始上传',
                                handler:function(){
                                    //console.log("点击开始上传");
                                    var isok = true;
                                    //判断文件编号是否添加
                                    if(Ext.isEmpty(model.get("filecode"))){
                                        alert('文件没有填写文件编号！');
                                        isok = false;
                                        return;
                                    }
                                    var regex = /[a-zA-Z0-9\-].*?/;
                                    if(!regex.test(model.get("filecode"))){
                                        alert('请输入正确格式的文件编号');
                                        isok = false;
                                        return;
                                    }
                                    if(Ext.isEmpty(model.get("haspaper"))){
                                        alert('文件没有填写是否有纸质版！');
                                        isok = false;
                                        return;
                                    }
                                    if(isok){ 
                                        this.swfupload.customSettings.scope_handler.continuous=false;
                                        this.swfupload.startUpload(model.get("id"));
                                        //console.log(model.get("id")); 
                                        model.set("filestatus",-2);
                                    }
                                },
                                icon:"js/swfupload/image/icons/upload.gif"
                            }, {
                                text : '取消上传',
                                scope:this.ownerCt,
                                handler:function(){
                                    var store = myself.getStore();//Ext.data.StoreManager.lookup("fileItems");
                                    this.swfupload.cancelUpload(model.get("id"),false);
                                    //model.set("filestatus",SWFUpload.FILE_STATUS.CANCELLED);
                                    //model.commit();
                                    store.remove(model);
                                    var stats=this.swfupload.getStats();
                                    var label=Ext.getCmp("queue_id");
                                    label.setText(label.text="文件队列:"+stats.files_queued);
                                },
                                icon:"js/swfupload/image/icons/remove.png"
                            },{ 
                                text: '上移', 
                                iconCls: 'arrow-upon-icon',  
                                handler: function(){ 
                                    if(index == 0) { 
                                        return; 
                                    } 
                                    var store = myself.getStore();
                                    console.log(store);   
                                    var data = store.getAt(index);
                                    var up_data = store.getAt(index-1);
                                    var record=store.createModel({
                                        id: data.get('id'),
                                        name : data.get('name'),
                                        type : data.get('type'),
                                        size : data.get('size'),
                                        filestatus : data.get('filestatus'),
                                        percent : data.get('percent'),
                                        haspaper : data.get('haspaper'),
                                        hasencrypt : data.get('hasencrypt'),
                                        filecode: up_data.get('filecode'),
                                        filedesc: data.get('filedesc'),
                                        dragfile: data.get('dragfile'),
                                        percent: data.get('percent')
                                    });
                                    up_data.set('filecode', data.get('filecode'));
                                    up_data.commit();
                                    store.removeAt(index);  
                                    store.insert(index - 1, record);
                                    //this.getView().refresh();        
                                }, 
                                scope: this 
                            },{ 
                                text: '下移', 
                                iconCls: 'arrow-downon-icon',  
                                handler: function(){ 
                                    var store = myself.getStore();
                                    if(index < store.getCount() - 1) { 
                                        var data = store.getAt(index);
                                        var down_data = store.getAt(index+1);
                                        var record=store.createModel({
                                            id: data.get('id'),
                                            name : data.get('name'),
                                            type : data.get('type'),
                                            size : data.get('size'),
                                            filestatus : data.get('filestatus'),
                                            percent : data.get('percent'),
                                            haspaper : data.get('haspaper'),
                                            hasencrypt : data.get('hasencrypt'),
                                            filecode: down_data.get('filecode'),
                                            filedesc: data.get('filedesc'),
                                            dragfile: data.get('dragfile'),
                                            percent: data.get('percent')
                                        });
                                        down_data.set('filecode', data.get('filecode'));
                                        down_data.commit();
                                        store.removeAt(index);  
                                        store.insert(index + 1, record); 
                                        //this.getView().refresh(); 
                                    }       
                            }}],
                            listeners:{
                                show:function(myself,o){
                                    if(model.get("filestatus")!=-1){
                                        myself.items.getAt(0).setDisabled(true);
                                    }
                                    if(model.get("filestatus")==-4){
                                        myself.items.getAt(1).setDisabled(true);
                                    }
                                }
                            }
                        });
                    }
                    e.preventDefault(); 
                    rightClick.showAt(e.getXY()); 
                    //console.log("鼠标右键点击");
                }
            },
            xtype : "grid",
            id: "fileuploadgrid",
            border : false,
            multiSelect: true,
            store : 'FileUpload',
            height: 400,
            columns : [ 
            {
                text : '类型',
                width : 60,
                sortable : false,
                align: 'center',
                menuDisabled : true,
                dataIndex : 'type',
                renderer : gfun.formatFiletype
            },
            {
                text : '文件名称',
                width : 150,
                sortable : false,
                dataIndex : 'filedesc',
                menuDisabled : true,
                editor: {xtype: 'textfield',allowBlank:false}
            }, {
                text : '文件编号 <font color="red">*</font>',
                width : 120,
                sortable : true,
                dataIndex : 'filecode',
                menuDisabled : true,
                //renderer:this.formatProgress,
                scope:this,

                editor: {xtype: 'textfield',editable: true,value:'请输入文件编号', allowBlank:false}
                //hidden:true
            }, {
                text : '是否有纸质版',
                width : 110, 
                dataIndex : 'haspaper',
                menuDisabled : true,
                //renderer : this.formatDelBtn,
                renderer : this.haspapercheck,
                scope: this
                //hidden:true
            }, {
                text : '扩展名',
                width : 80,
                sortable : true,
                dataIndex : 'type',
                menuDisabled : true
            }, {
                text : '大小',
                width : 75,
                sortable : true,
                dataIndex : 'size',
                menuDisabled : true,
                align: 'right',
                renderer : gfun.formatFileSize
            }, {
                text : '状态',
                width : 100,
                sortable : true,
                dataIndex : 'filestatus',
                renderer:this.formatFileState,
                menuDisabled : true,
                scope : this
            }, {
                text : '是否加密',
                width : 100, 
                dataIndex : 'hasencrypt',
                menuDisabled : true,
                //renderer : this.formatDelBtn,
                renderer : this.hasencryptcheck,
                scope: this
                //hidden:true
            } ],
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop',
                    dragText: '拖放到此区域'
                },
                listeners: {
                    drop: function(node, data, dropRec, dropPosition) {
                        var viewstore = data.view.getStore();
                        var arr=[];
                        var regex=/^\d+$/;
                        /*将现有的是数据编号的文件编号进行排序*/
                        for (var i = 0; i <viewstore.getCount(); i++) {
                            var model=viewstore.getAt(i);
                            var fc = model.get('filecode');
                            if(regex.test(fc)){
                                arr.push(parseInt(fc));
                            }
                        }
                        arr.sort(compareInt);
                        /*重新对是数字编号的文件进行赋值*/
                        for (var i = 0; i <viewstore.getCount(); i++) {
                            var model=viewstore.getAt(i);
                            var fc = model.get('filecode');
                            if(regex.test(fc)){
                                model.set('filecode', arr.shift());
                                model.commit();
                            }
                        }
                        function compareInt(int1, int2){
                            var iNum1 = parseInt(int1);   //强制转换成int 型;
                            var iNum2 = parseInt(int2);
                            if(iNum1 < iNum2){
                                return -1;
                            }else if(iNum1 > iNum2){
                                return 1;
                            }else{
                                return 0;
                            }
                        }
                    }
                }
            },
            plugins: [
            Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 1,
                listeners:{
                    'edit' : function(editor,ctx){
                        if(ctx.colIdx=='2'){
                            var fs_name =  ctx.value;
                            var obj=this.grid.ownerCt;
                            var parentid = obj.initialConfig.parent_record.get('fs_id');

                            Ext.Ajax.request({
                                url: base_path + "index.php?c=upload&a=check&t="+new Date().getTime(),
                                params : {fs_name: fs_name, fs_parent:parentid},
                                method : 'POST',
                                success: function(response, options){
                                    var result = Ext.JSON.decode(response.responseText);
                                    if(result.success){
                                    }else{
                                        if(result.flag==1){
                                            Ext.Msg.confirm('提示', '文件已存在，是否覆盖？', function(btn){
                                                if(btn=='yes'){
                                                    ctx.record.set('coverfile', '1');
                                                }else{
                                                    ctx.record.set('filecode', '');
                                                }
                                            });
                                        }else{
                                            Ext.Msg.alert('提示', result.msg); 
                                        } 
                                    }
                                }
                            });
                        }
                    }
                }
            })]
        }];

        this.tbar=[
        {text:'添加文件',id:"btnAdd",icon:"js/swfupload/image/icons/add.png"},'-',
        {text:'开始上传',handler:function(){
                var store = this.getComponent('fileuploadgrid').getStore();
                this.continuous=true;
                var bianhao = true;
                //判断文件编号是否添加
                for (var i = 0; i <store.getCount(); i++) {
                    var model=store.getAt(i);
                    if(Ext.isEmpty(model.get("filecode"))){
                        alert('还有文件没有填写文件编号！');
                        bianhao = false;
                        break;
                    }
                    var regex = /[a-zA-Z0-9\-].*?/;
                    if(!regex.test(model.get("filecode"))){
                        alert('请输入正确格式的文件编号');
                        bianhao = false;
                        break; 
                    }
                    if(Ext.isEmpty(model.get("haspaper"))){
                        alert('还有文件没有填写是否有纸质版！');
                        bianhao = false;
                        break; 
                    }
                } 
                if(bianhao) {
                    for (var index = 0; index <store.getCount(); index++) {
                        var model=	store.getAt(index);
                        if(model.get("filestatus")==-1){
                            this.swfupload.startUpload(model.get("id"));
                            model.set("filestatus",-2);
                            model.commit();
                        }
                    }
                }
            },scope:this,icon:"js/swfupload/image/icons/upload.gif"},'-',
        {
            text : '停止上传',
            handler : function() {
                this.swfupload.stopUpload();

            },
            icon : "js/swfupload/image/icons/cancel.png",
            scope : this
        }, '-', {
            text : '请空列表',
            handler : function() {
                this.swfupload.cancelQueue();
                var store = this.getComponent('fileuploadgrid').getStore();
                store.removeAll();
                var stats=this.swfupload.getStats();
                var label=Ext.getCmp("queue_id");
                label.setText(label.text="文件队列:"+stats.files_queued);
                //清空进度条
                Ext.getCmp("progressBar").reset();
            },
            icon : "js/swfupload/image/icons/remove.png",
            scope:this
        }, '-', {
            xtype : 'label',
            id:"queue_id",
            text : '文件队列:0',
            margins : '0 0 0 10'
        },  {
            text : '使用拖拽上传模式',
            icon :"js/swfupload/image/icons/back.png",
            scope: this,
            margins : '0 0 0 40'
        }
        ];
        this.bbar=[
        {xtype:"progressbar",id:"progressBar",text:"0%",width:200},
        {xtype:"label",text:"平均速度：0kb/s",id:"currentSpeed",width:200},'-',
        {xtype:"label",text:"剩余时间：0s",id:"timeRemaining",width:200}
        ];
        this.listeners={
            'afterrender':function(){
                //console.log("渲染完成， 添加swf所需的设置");
                var em=Ext.get(Ext.query("#btnAdd>span")[0]);
                if(!em){
                    //此处为IE9一下版本的兼容问题的临时解决办法，目前还是不支持IE6
                    em=Ext.get("btnAdd-btnWrap");
                }
                var placeHolderId = Ext.id();
                em.setStyle({
                    position : 'relative',
                    display : 'block'
                });
                em.createChild({
                    tag : 'div',
                    id : placeHolderId
                });
                this.swfupload = new SWFUpload(Ext.apply(this.setting,{
                    button_width : em.getWidth(),
                    button_height : em.getHeight(),
                    button_placeholder_id :placeHolderId
                }));
                this.swfupload.uploadStopped = false;
                Ext.get(this.swfupload.movieName).setStyle({
                    position : 'absolute',
                    left :"0px",
                    top: "0px"
                });	
            }
        };

        this.callParent(arguments);
        scope : this;
    },
    onQueued:function(file){
        var stats=this.getStats();
        var label=Ext.getCmp("queue_id");
        label.setText(label.text="文件队列:"+stats.files_queued);
        var store = this.customSettings.scope_handler.getComponent('fileuploadgrid').getStore();//Ext.data.StoreManager.lookup("fileItems");
        //crreate a record
        var f=store.createModel({
            id: file.id,
            name : file.name,
            type : file.type,
            size : file.size,
            filestatus : file.filestatus,
            percent : 0,
            haspaper : '',
            hasencrypt : false,
            filecode: '',
            filedesc: file.name.substring(0, file.name.lastIndexOf('.'))
        });
        var oldstorelength = store.getCount();
        store.add(f);
        if(store.getCount()==1){
            Ext.Ajax.request({
                url: base_path + "index.php?c=upload&a=getfilecode&t="+new Date().getTime(),
                params : {fs_parent:this.customSettings.scope_handler.parentNode.get('fs_id')},
                method : 'POST',
                success: function(response, options){
                    var result = Ext.JSON.decode(response.responseText);
                    if(result.success){
                        for(var i=0; i<store.getCount(); i++){ 
                            var model=store.getAt(i);
                            if(i==0){
                                model.set('filecode', parseInt(result.data)+1);
                            }else{
                                model.set('filecode', parseInt(store.max('filecode'))+1);
                            }
                            model.commit();
                        }

                    }else{
                        return false;
                    }
                }
            }); 
        }else{
            //setTimeout(function(){
            f.set('filecode', parseInt(store.max('filecode'))+1);
            f.commit();
            //}, 1000);
        }
    },
    formatFileState : function(n){//文件状态
        switch(n){
            case SWFUpload.FILE_STATUS.QUEUED  : return '已加入队列';
                break;
            case SWFUpload.FILE_STATUS.IN_PROGRESS  : return '正在上传';
                break;
            case SWFUpload.FILE_STATUS.ERROR  : return '<div style="color:red;">上传失败</div>';
                break;
            case SWFUpload.FILE_STATUS.COMPLETE  : return '上传成功';
                break;
            case SWFUpload.FILE_STATUS.CANCELLED  : return '取消上传';
                break;
            default: return n;
        }
    },

    onFileError : function(file,errorCode,msg){
        var msg="";

        switch(errorCode){
            case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED : msg='待上传文件列表数量超限，不能选择！';
                break;
            case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT : msg='文件太大，不能选择！文件大小不能超过'+this.settings.file_size_limit/1024+'MB';
                break;
            case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE : msg='该文件大小为0，不能选择！';
                break;
            case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE : msg='该文件类型不可以上传！';
                break;
            case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED : msg="上传已经停止";
                break;
            case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:msg="所有文件已经取消！";
                break;
            case SWFUpload.UPLOAD_ERROR.IO_ERROR,SWFUpload.UPLOAD_ERROR.HTTP_ERROR: msg="文件保存失败！";
                break;
            case SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED:msg="文件上传失败！";
                break;
            default:msg="文件已存在！!";
                break;
        }
        Ext.Msg.show({
            title : '提示',
            msg : msg,
            width : 280,
            icon : Ext.Msg.WARNING,
            buttons :Ext.Msg.OK

        });
    },
    uploadProgress : function(file, bytesComplete, totalBytes){//处理进度条
        //console.log("完成百分比"+file.percentUploaded+"，当前速度"+file.currentSpeed/8/1024/1024+"MB/s");
        //console.log(SWFUpload.speed.formatBytes(bytesComplete));
        var ds = this.customSettings.scope_handler.getComponent('fileuploadgrid').getStore();
        for(var i=0;i<ds.getCount();i++){
            var record =ds.getAt(i);
            if(record.get('id')==file.id){
                record.set('percent', file.percentUploaded);
                record.set('filestatus', file.filestatus);
                record.commit();
            }
        }
        //更新进度条
        var pb=Ext.getCmp("progressBar");
        pb.updateProgress(file.percentUploaded/100,SWFUpload.speed.formatPercent(file.percentUploaded),true);
        //更新当前速度
        var speed=Ext.getCmp("currentSpeed");
        var speedNum=Math.ceil(file.averageSpeed/8/1024);
        //console.log(Math.ceil(2.8));
        var unit=speedNum/1024<0?"KB/s":"MB/s";
        var speedValue=speedNum/1024<0?speedNum:speedNum/1024;
        speedValue=Math.ceil(speedValue);
        speed.setText("平均速度:"+speedValue+unit);
        //更新剩余时间
        var timeRemaining=Ext.getCmp("timeRemaining");
        timeRemaining.setText("估计剩余时间:"+SWFUpload.speed.formatTime(file.timeRemaining));

    },
    uploadSuccess : function(file, serverdata){
        if(serverdata){
            //serverdata = eval('('+serverdata+')');
            //refresh list grid data to show new add file
            this.customSettings.scope_handler.initialConfig.ListStore.load({params:{fs_id:this.customSettings.scope_handler.parentNode.get('fs_id')}});
            //refresh tree data to show new add file
            this.customSettings.scope_handler.initialConfig.TreeStore.load({node: this.customSettings.scope_handler.parentNode,params:{fs_id:this.customSettings.scope_handler.parentNode.get('fs_id')}});
        }
    },
    uploadComplete:function(file){
        //更新进度条
        var pb=Ext.getCmp("progressBar");
        pb.updateProgress(0,'0%',true);

        var store = this.customSettings.scope_handler.getComponent('fileuploadgrid').getStore();
        model=store.getById(file.id);
        model.set("filestatus",file.filestatus);
        model.commit();
        var stats=this.getStats();
        var label=Ext.getCmp("queue_id");
        label.setText(label.text="文件队列:"+stats.files_queued);
        if(stats.files_queued==0){
            //refreshtree(this.customSettings.scope_handler.parentNode,1);
            //projectTreePanel.getSelectionModel().select(this.customSettings.scope_handler.parentNode);
            //this.customSettings.scope_handler.parentNode.collapse();
        }
        return this.customSettings.scope_handler.continuous;
    },
    haspapercheck:function(value,cellmeta,record,rowIndex,columnIndex,store){
        me = this; 
        var file_id = record.get('id');
        var str= '<div style="text-align:center;"><input type="radio" name="haspapercheck'+file_id+'" id="'+file_id+'_1" onclick="me.checkvalue(\'haspaper\','+rowIndex+', \'1\', this);" value="1"';
        if(record.get('haspaper')=='1'){
            str+=' checked="checked" ';
        }
        str += ' >有</input> <input type="radio" name="haspapercheck'+file_id+'" id="'+file_id+'_0" onclick="me.checkvalue(\'haspaper\','+rowIndex+', \'0\', this);" value="0"';
        if(record.get('haspaper')=='0'){
            str+=' checked="checked" ';
        }
        str += '>无</input></div>'; 
        return str;
    },    
    hasencryptcheck:function(value,cellmeta,record,rowIndex,columnIndex,store){
        var file_id = record.get('id');
        me = this;
        var str='<div style="text-align:center;"><input type="checkbox" name="hasencryptcheck" id="hasencryptcheck'+file_id+'" onclick="me.checkvalue(\'hasencrypt\','+rowIndex+', this.checked, this);"';
        if(record.get('hasencrypt')){
            str+=' checked="checked" ';
        }
        str+='></input></div>'; 
        return str;
    },

    upload_start_handler: function(file){
        var haspaper, hasencrypt;
        var store =  this.customSettings.scope_handler.getComponent('fileuploadgrid').getStore();
        for(var i=0;i<store.getCount();i++){
            var record =store.getAt(i);
            if(record.get('id')==file.id){ 
                this.customSettings.scope_handler.swfupload.addPostParam('haspaper', record.get('haspaper'));
                this.customSettings.scope_handler.swfupload.addPostParam('hasencrypt', record.get('hasencrypt'));
                this.customSettings.scope_handler.swfupload.addPostParam('filecode', record.get("filecode"));
                this.customSettings.scope_handler.swfupload.addPostParam('filedesc', record.get("filedesc"));
                this.customSettings.scope_handler.swfupload.addPostParam('coverfile', record.get("coverfile"));
                this.customSettings.scope_handler.swfupload.addPostParam('auth', gfun.getauth());
            }
        }
    },
    checkvalue : function(t, rowIndex, v, obj){
        var store = this.getComponent('fileuploadgrid').getStore();
        var record =store.getAt(rowIndex);
        record.set(t, v);
        record.commit();
        $("#"+obj.id).attr('checked', Boolean(v));
    }

});