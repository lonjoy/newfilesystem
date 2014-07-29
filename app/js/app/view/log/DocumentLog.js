Ext.define('FS.view.log.DocumentLog',{
    extend: 'Ext.grid.Panel',
    alias: 'widget.documentlog',
    region:'center',
    store: 'DocumentLog',
    initComponent: function(){
        this.columns = [
        { header: '操作时间', width: 150, dataIndex: 'log_optdate', sortable: false, menuDisabled : true },
        { header: '操作用户', width: 120, dataIndex: 'u_name', sortable: true, menuDisabled : true  },
        { header: '文件编号', width: 150, dataIndex: 'fs_textname', sortable: true,menuDisabled : true },
        { header: '文件名称', width: 200, dataIndex: 'fs_intro', sortable: true,menuDisabled : true },
        { header: '大小', width: 75, align:'right', dataIndex: 'fs_size', renderer:gfun.formatFilesize, sortable: true,menuDisabled : true },
        { header: '类型', width: 80, align:'center', dataIndex: 'fs_type',sortable: false, menuDisabled : true},
        { header: '操作', width: 100, dataIndex: 'log_type', sortable: true, menuDisabled : true  }
        ];
        this.callParent(arguments);
    },
    dockedItems: [{
        xtype: 'pagingtoolbar',
        store: 'DocumentLog',
        dock: 'bottom',
        displayInfo: true
    }],
    onRender: function(){
        this.store.load();
        this.callParent(arguments);
    }
})