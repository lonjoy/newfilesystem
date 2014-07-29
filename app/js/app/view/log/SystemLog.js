Ext.define('FS.view.log.SystemLog',{
    extend: 'Ext.grid.Panel',
    alias: 'widget.systemlog',
    region:'center',
    store: 'SystemLog',
    initComponent: function(){
        this.columns = [
        { header: '操作时间', width: 150, dataIndex: 'log_date', sortable: true, menuDisabled : true  },
        { header: '操作用户', width: 100, dataIndex: 'log_user', sortable: true,menuDisabled : true },
        { header: '用户邮箱', width: 200, dataIndex: 'log_email',sortable: false, menuDisabled : true},
        { header: '操作描述', width: 600, dataIndex: 'log_desc', sortable: false, menuDisabled : true }
        ];
        this.callParent(arguments);
    },
    dockedItems: [{
        xtype: 'pagingtoolbar',
        store: 'SystemLog',
        dock: 'bottom',
        displayInfo: true
    }],
    onRender: function(){
        this.store.load();
        this.callParent(arguments);
    }
})