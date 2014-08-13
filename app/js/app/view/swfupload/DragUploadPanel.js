/**************/
/****************拖拽上传 *********************************/
/**************/
Ext.define("FS.view.swfupload.DragUploadPanel", {
    extend : "Ext.panel.Panel",
    alias : "widget.dragfileuploadPanel",
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
            }
        };
        this.items = [ {
            listeners:{
                'itemcontextmenu':function(myself,model,item,index,e,eopt){
                    e.preventDefault(); 
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
                                        store.remove(cur_model);
                                        var label=Ext.getCmp("queue_id");
                                        label.setText(label.text="文件队列:"+store.getCount());
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
                                        this.start_upload(model);
                                        model.set("filestatus",-2);
                                    }
                                },
                                icon:"js/swfupload/image/icons/upload.gif"
                            }, {
                                text : '取消上传',
                                scope:this.ownerCt,
                                handler:function(){
                                    var store = myself.getStore();
                                    store.remove(model);
                                    var label=Ext.getCmp("queue_id");
                                    label.setText(label.text="文件队列:"+store.getCount());
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

                                    store.removeAt(index);  
                                    store.insert(index - 1, record);
                                    //this.getView().refresh();        
                                }, 
                                scope: this 
                            },{ 
                                text: '下移', 
                                iconCls: 'arrow-downon-icon',  
                                handler: function(){ 
                                    var store=myself.getStore();  
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
                                        store.removeAt(index);  
                                        store.insert(index + 1, record); 
                                        //this.getView().refresh(); 
                                    }       
                                }, 
                                scope: this 
                            }],
                            listeners:{
                                show:function(myself,o){
                                    if(model.get("filestatus")!=-1){
                                        myself.items.getAt(0).setDisabled(true);
                                    }
                                    if(model.get("filestatus")==-2){
                                        myself.items.getAt(1).setDisabled(true);
                                    }
                                    if(model.get("filestatus")==-4){
                                        myself.items.getAt(1).setDisabled(true);
                                    }
                                }
                            }
                        });
                    }

                    rightClick.showAt(e.getXY()); 
                    //console.log("鼠标右键点击");
                },
                'afterrender': function(myself, o){
                    var view = myself.getView();
                    var viewid = view.getId();
                    var box = document.getElementById(viewid);
                    box.style.backgroundColor='#ffffcc';
                    $(document).on({
                        dragleave: function(e){ //脱离
                            e.stopPropagation(); 
                            e.preventDefault();
                            box.style.backgroundColor='#FFFFFF';
                        },
                        drop: function(e){  //拖后放
                            e.stopPropagation(); 
                            e.preventDefault();
                            box.style.backgroundColor='#FFFFFF';
                        },
                        dragenter: function(e){ //拖进
                            e.stopPropagation(); 
                            e.preventDefault();
                            box.style.backgroundColor='#ffffcc';
                        },
                        dragover: function(e){
                            e.stopPropagation(); 
                            e.preventDefault();
                            box.style.backgroundColor='#ffffcc';
                        }
                    });

                    box.addEventListener("drop", function(e){
                        e.preventDefault();
                        var filelist=e.dataTransfer.files; //获取文件列表对象
                        var store = myself.getStore();
                        if(store.getCount()==50){
                            alert('待上传文件列表数量超限，不能选择！');
                            return ;
                        } 
                        if (filelist != null && filelist.length > 0){
                            for(var i=0; i<filelist.length; i++){ 
                                var file = filelist[i];
                                var t = new Date().getTime();
                                var f=store.createModel({
                                    id: t,
                                    name : file.name,
                                    type : file.name.substring(file.name.lastIndexOf('.')).toLowerCase(),
                                    size : file.size,
                                    filestatus : -1,
                                    percent : 0,
                                    haspaper : '',
                                    hasencrypt : false,
                                    filecode: '',///myself.ownerCt.autoNumber(),
                                    filedesc: file.name.substring(0, file.name.lastIndexOf('.')),
                                    dragfile: file,
                                    percent: '<progress value="0" max="100" id="progress_'+t+'"></progress> 0%'
                                });
                                store.add(f); 
                                if(store.getCount()==50){
                                    alert('待上传文件列表数量超过限制！');
                                    break;
                                }                               
                            }
                            var label=Ext.getCmp("queue_id");
                            label.setText(label.text="文件队列:"+store.getCount());
                            if(store.max('filecode')!=''){
                                var startflag=store.getCount()-filelist.length;
                                for(var i=startflag; i<store.getCount(); i++){ 
                                    var model=store.getAt(i);
                                    model.set('filecode', parseInt(store.max('filecode'))+1);
                                    model.commit();
                                }
                            }else{
                                Ext.Ajax.request({
                                    url: base_path + "index.php?c=upload&a=getfilecode&t="+new Date().getTime(),
                                    params : {fs_parent:myself.ownerCt.parentNode.get('fs_id')},
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
                            }
                        }
                        //appendFiles(filelist);

                    }, false);
                }
            },
            xtype : "grid",
            id: 'dragfileuploadgrid',
            multiSelect: true,
            height: 300, 
            border : false,
            multiSelect: true,
            store : 'FileUpload',
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
                sortable : true,
                dataIndex : 'filedesc',
                menuDisabled : true,
                editor: {xtype: 'textfield',allowBlank:false}
            }, {
                text : '文件编号 <font color="red">*</font>',
                width : 120,
                sortable : false,
                dataIndex : 'filecode',
                menuDisabled : true,
                scope:this,
                editor: {xtype: 'textfield',editable: true,value:'请输入文件编号', allowBlank:false}
            },  {
                text : '是否有纸质版',
                width : 110, 
                dataIndex : 'haspaper',
                menuDisabled : true,
                renderer : this.haspapercheck,
                scope: this
            },{
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
                align:'right',
                menuDisabled : true,
                renderer : gfun.formatFileSize
            }, {
                text : '状态',
                width : 100,
                sortable : true,
                dataIndex : 'filestatus',
                renderer:this.formatFileState,
                scope : this
            }, {
                text : '是否加密',
                width : 80, 
                dataIndex : 'hasencrypt',
                menuDisabled : true,
                //renderer : this.formatDelBtn,
                renderer : this.hasencryptcheck,
                scope: this
                //hidden:true
            },{
                header : '进度',
                width : 180,
                sortable : false,
                dataIndex : 'percent',
                menuDisabled : true,
                scope:this,
                hidden:false
            }],
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
                                                    //ctx.record.commit();
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
        {text:'开始上传',handler:function(){
                var store = this.getComponent('dragfileuploadgrid').getStore();
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
                        var model= store.getAt(index);
                        if(model.get("filestatus")==-1){
                            this.start_upload(model);
                        }
                    }
                }
            },scope:this,icon:"js/swfupload/image/icons/upload.gif"},'-', {
            text : '请空列表',
            handler : function() {
                var store = this.getComponent('dragfileuploadgrid').getStore();
                store.removeAll();
                var label=Ext.getCmp("queue_id");
                label.setText(label.text="文件队列:0");
            },
            icon : "js/swfupload/image/icons/remove.png",
            scope:this
        }, '-', {
            xtype : 'label',
            id:"queue_id",
            text : '文件队列:0',
            margins : '0 0 0 10'
        }, {
            text : '返回原有上传模式',
            icon :"js/swfupload/image/icons/back.png",
            scope: this,
            margins : '0 0 0 40'
        }
        ];

        this.callParent();
        scope : this;
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

    start_upload : function(rcd){
        ownerobj = this;
        var progress = document.querySelector("#progress_"+rcd.get('id'));

        var xhr = new XMLHttpRequest(); // 初始化XMLHttpRequest
        xhr.open('post', '/index.php?c=upload', true);

        function onProgressHandler(e) { // 添加数据上传进度，获取实时的上传进度
            if (e.lengthComputable) {
                var percentage = (e.loaded / e.total) * 100;
                rcd.set("percent", '<progress value="'+percentage+'" max="100" id="progress_'+rcd.get('id')+'"></progress> '+Math.ceil(percentage)+'%');
                rcd.set("filestatus",-2);
            }else {
                //console.log("Can't determine the size of the file.");
            }
        }

        function updateLoading(event){
            rcd.set("percent", '<progress value="100" max="100" id="progress_'+rcd.get('id')+'"></progress> 100%');
            var store = ownerobj.getComponent('dragfileuploadgrid').getStore();
            var label=Ext.getCmp("queue_id");
            var i=0;

            for (var index = 0; index <store.getCount(); index++) {
                if(store.getAt(index).get("filestatus")==-1){
                    i++;
                }
            }
            label.setText(label.text="文件队列:"+i);
            //上传一个插入一个，文件队列中为0后操作有问题

            if(i==0){
                //目录树选中当前上传的目录
                //projectTreePanel.getSelectionModel().select(ownerobj.parentNode);
                ownerobj.getComponent('dragfileuploadgrid').getView().refresh();
            }
            rcd.set("filestatus",-4);
            var finish=0;
            for (var index = 0; index <store.getCount(); index++) {
                if(store.getAt(index).get("filestatus")==-4){++finish;}
                if(finish==store.getCount()){
                    //refresh list grid data to show new add file
                    ownerobj.initialConfig.ListStore.load({params:{fs_id:ownerobj.parentNode.get('fs_id')}});
                    //refresh tree data to show new add file
                    ownerobj.initialConfig.TreeStore.load({node: ownerobj.parentNode,params:{fs_id:ownerobj.parentNode.get('fs_id')}});

                    ownerobj.getComponent('dragfileuploadgrid').getView().refresh();
                    //store.load(store.getProxy());
                }
            }
        }
        var onErrorHandler = function(){
            //上传失败
            rcd.set("filestatus",-3);
            rcd.set("percent", '<progress value="0" max="100" id="progress_'+rcd.get('id')+'"></progress> 0%');
        }

        xhr.upload.addEventListener('progress', onProgressHandler, false);
        xhr.upload.addEventListener('loadend', updateLoading, false);
        xhr.upload.addEventListener('error', onErrorHandler, false);


        var fd = new FormData(); // 这里很关键，初始化一个FormData，并将File文件发送到后台
        fd.append("uploads", rcd.data.dragfile);
        fd.append("savePath", this.setting.post_params.savePath);
        fd.append("haspaper", rcd.data.haspaper);
        fd.append("filedesc", rcd.data.filedesc);
        fd.append("fs_id", this.setting.post_params.fs_id);
        fd.append("filecode", rcd.data.filecode);
        fd.append("hasencrypt", rcd.data.hasencrypt);
        fd.append("coverfile", rcd.data.coverfile);
        //fd.append("hasencrypt", model.data.dragfile);
        xhr.send(fd);
        //setTimeout(function(){refreshtree(ownerobj.parentNode,1);}, 100);

        //*/
    },
    checkvalue : function(t, rowIndex, v, obj){
        var store = this.getComponent('dragfileuploadgrid').getStore();
        var record =store.getAt(rowIndex);
        record.set(t, v);
        record.commit();
        $("#"+obj.id).attr('checked', Boolean(v));
    }

});
