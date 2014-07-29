Ext.define('FS.view.email.Email',{
    extend: 'Ext.grid.Panel',
    alias: 'widget.email',
    region:'center',
    store: 'Email',
    initComponent: function(){
        this.columns = [
        { header: '发件人', width: 200, dataIndex: 'from', sortable: false,menuDisabled : true },
        { header: '主题', width: 550, dataIndex: 'subject', sortable: false,menuDisabled : true },
        { header: '大小', width: 100, dataIndex: 'size',sortable: false, renderer:gfun.formatFileSize, menuDisabled : true, align: 'right' },
        { header: '日期', width: 150, dataIndex: 'received_date',sortable: false, menuDisabled : true }
        ];
        this.callParent(arguments);
    },
    dockedItems: [{
        xtype: 'pagingtoolbar',
        store: 'Email',
        dock: 'bottom',
        displayInfo: true
    }]
})