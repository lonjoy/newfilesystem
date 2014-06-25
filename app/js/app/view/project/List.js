Ext.define('FS.view.project.List',{
    extend: 'Ext.grid.Panel',
    alias: 'widget.projectList',
    store: 'Project',
    xtype: 'gridpanel',
    selModel: 'MULTI',
    initComponent: function(){
        var icon = function(val){
            if(val){
                return '<img src="'+val+'">'; 
            }else{
                return '<img src="'+images_path+'folder.gif">';
            }
        };
        var ishaspaper = function(val){
            var rcd = arguments[2];
            var isdir = rcd.get('fs_isdir');
            if(val=='1' && isdir=='0'){
                return '有';
            }else if(val=='0' && isdir=='0'){
                return '无'; 
            }else{
                return '';
            }
        };    
        var isencrypt = function(val){
            if(val=='1'){
                return '<font color="red">已加密</font>';
            }else if(val=='0'){
                return '否'; 
            }else{
                return '';
            }
        };
        var formatFileSize=function(size){
            if(!size){return '';}
            if (size>=1024*1024*1204){
                size = parseFloat(size/(1024*1024*1204)).toFixed(1)+'GB';
            }
            else if(size >= 1024*1024){
                size = parseFloat(size / (1024*1024)).toFixed(1) + 'MB';
            }
            else if(size >= 1024){
                size = parseFloat(size / 1024).toFixed(1) + 'KB';
            }
            else{
                size = parseFloat(size).toFixed(1) + 'B';
            }
            return size;
        };
        this.columns = [
        { header: '类型', width: 40, dataIndex: 'icon', renderer: icon,sortable: false, menuDisabled : true},
        { header: '文件编号', width: 120, dataIndex: 'text', sortable: true,menuDisabled : true },
        { header: '文件名称', width: 150, dataIndex: 'fs_intro',sortable: false, menuDisabled : true},
        { header: '纸版', width: 50, dataIndex: 'fs_haspaper', renderer: ishaspaper, menuDisabled : true },
        { header: '大小', align:'right', width: 70, dataIndex: 'fs_size', renderer: formatFileSize, menuDisabled : true },
        { header: '创建时间', width: 150, dataIndex: 'fs_create', menuDisabled : true },
        { header: '更新时间', width: 150, dataIndex: 'fs_lastmodify', menuDisabled : true },
        { header: '所属用户', width: 120, dataIndex: 'u_name', sortable: false, menuDisabled : true },
        { header: '是否加密', width: 70, dataIndex: 'fs_encrypt', renderer: isencrypt, sortable: false, menuDisabled : true  }
        ];
        this.callParent(arguments);
    },
    dockedItems: [{
        xtype: 'pagingtoolbar',
        store: 'Project',
        dock: 'bottom',
        displayInfo: true
    }],
    onRender: function(){
        this.store.load();
        this.callParent(arguments);
    }
})