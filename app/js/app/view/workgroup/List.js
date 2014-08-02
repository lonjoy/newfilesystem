Ext.define('FS.view.workgroup.List',{
    extend: 'Ext.grid.Panel',
    alias: 'widget.workgroupList',
    region:'center',
    store: 'WorkgroupList',
    initComponent: function(){
        this.columns = [
        { header: '用户', width: 150, dataIndex: 'u_name', sortable: false, menuDisabled : true},
        { header: '邮箱', width: 200, dataIndex: 'u_email', sortable: true,menuDisabled : true },
        { header: '权限', width: 300, dataIndex: 'u_grade', renderer : gfun.getusergrade, sortable: false, menuDisabled : true }
        ];
        this.callParent(arguments);
    },
    dockedItems: [{
        xtype: 'pagingtoolbar',
        store: 'WorkgroupList',
        dock: 'bottom',
        displayInfo: true
    }],
    onRender: function(){
        this.store.load();
        this.callParent(arguments);
    }
})