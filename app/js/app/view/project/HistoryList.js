Ext.define('FS.view.project.HistoryList',{
    extend: 'Ext.grid.Panel',
    alias: 'widget.historypanel',
    store: 'HistoryList',
    initComponent: function(){
        this.columns = [
        { header: '文件编号', width: 80, dataIndex: 'fs_name', sortable: true,menuDisabled : true },
        { header: '文件名称', width: 150, dataIndex: 'fs_intro',sortable: false, menuDisabled : true},
        { header: '操作', width: 50, dataIndex: 'log_type', menuDisabled : true },
        { header: '操作用户', width: 100, dataIndex: 'log_user',  menuDisabled : true },
        { header: '大小', width: 80, dataIndex: 'fs_size', renderer: gfun.formatFileSize, menuDisabled : true },
        { header: '操作时间', width: 150, dataIndex: 'log_optdate', menuDisabled : true }
        ];
        this.callParent(arguments);
    },
    dockedItems: [{
        xtype: 'pagingtoolbar',
        store: 'HistoryList',
        dock: 'bottom',
        displayInfo: true
    }],
    onRender: function(){
        this.callParent(arguments);
    }
})