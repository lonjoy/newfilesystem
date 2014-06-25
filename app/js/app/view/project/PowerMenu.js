//后端判断最好，先前端吧
var powermenu = {
    "open":{
        text: '打开',
        ename: 'open',
        iconCls: 'icon-doc-open'
    },"alterfile":{
        text: '修改编号或名称',
        iconCls:'icon-edit',
        ename: 'alterfile'
    },"newdir":{
        text: '新建文件夹',
        iconCls:'icon-doc-new',
        ename: 'newdir'
    },"upload":{
        text:'上传文件',
        iconCls:'icon-doc-upload',
        ename: 'upload'
    },"del":{
        text:'删除',
        iconCls:'icon-doc-remove',
        ename: 'del'
    },"copystruct":{
        text: '复制文件夹结构',
        iconCls: 'icon-doc-open',
        ename: 'copystruct'
    },"addshare":{
        text: '设置共享',
        iconCls:'icon-share-doc-setting',
        ename: 'addshare'
    },"cannelshare":{
        text: '取消共享',
        iconCls:'icon-share-doc-setting',
        disabled: true,
        ename: 'cannelshare'
    },"history":{
        text:'历史版本',
        iconCls:'icon-doc-history',
        ename:'history'
    },"download":{
        text:'下载',
        iconCls:'icon-doc-download',
        ename:'download'
    },"powersetting":{
        text:'权限设置',
        iconCls:'icon-doc-setting',
        ename:'powersetting'
    },"refresh":{
        text: '刷新',
        iconCls: 'refresh',
        ename: 'refresh'
}};

Ext.define('FS.view.project.PowerMenu',{
    extend:'Ext.menu.Menu',
    alias: 'widget.powermenu',
    initComponent: function(){
        Ext.apply(this,{
            float: true,
            xtype: 'menu',
            items:[]
        });
        this.callParent(arguments);
    },
    addMenuItem: function(isdir){
        var fun=[];
        if(isdir==1){
            fun = ['refresh','open', 'alterfile','newdir', 'upload', 'del','powersetting', 'copystruct','addshare','cannelshare'];
        }else{
            fun = ['open', 'alterfile', 'del', 'download', 'history'];
        }
        this.addpower(fun);   
    },
    addpower: function(fun){
        this.removeAll();
        if(fun.length>0){
            for(var i=0;i<fun.length; i++){
                this.add(powermenu[fun[i]]);
            } 
        }
    }
    
})
