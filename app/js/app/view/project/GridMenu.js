Ext.define('FS.view.project.GridMenu',{
    extend:'Ext.menu.Menu',
    alias: 'widget.gridmenu',
    initComponent: function(){
        Ext.apply(this,{
            float: true,
            xtype: 'menu',
            items:[{
                text: '新建文件夹',
                iconCls:'icon-doc-new',
                ename: 'newdir'
            },{
                text:'上传文件',
                iconCls:'icon-doc-upload', 
                handler: function(){
                    this.up('menu').hide();
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
                }
            }]
        });
        this.callParent(arguments);
    }
})