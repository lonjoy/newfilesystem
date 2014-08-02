Ext.define('FS.view.project.List',{
    extend: 'Ext.grid.Panel',
    alias: 'widget.projectList',
    region:'center',
    store: 'List',
    selModel: 'MULTI',
    tbar:[
    {xtype:'button', text: '', iconCls: 'go_history'},
    {xtype:'tbseparator'},
    {xtype:'button', text: '', iconCls: 'go_forward', disabled: true}
    ],
    initComponent: function(){
        this.columns = [
        { header: '类型', width: 40, dataIndex: 'icon', renderer: gfun.sicon,sortable: false, menuDisabled : true},
        { header: '文件编号', width: 120, dataIndex: 'text', sortable: true,menuDisabled : true },
        { header: '文件名称', width: 150, dataIndex: 'fs_intro',sortable: false, menuDisabled : true},
        { header: '纸版', width: 50, dataIndex: 'fs_haspaper', renderer: gfun.ishaspaper, menuDisabled : true },
        { header: '大小', align:'right', width: 70, dataIndex: 'fs_size', renderer: gfun.formatFileSize, menuDisabled : true },
        { header: '创建时间', width: 150, dataIndex: 'fs_create', menuDisabled : true },
        { header: '更新时间', width: 150, dataIndex: 'fs_lastmodify', menuDisabled : true },
        { header: '所属用户', width: 120, dataIndex: 'u_name', sortable: false, menuDisabled : true },
        { header: '是否加密', width: 70, dataIndex: 'fs_encrypt', renderer: gfun.isencrypt, sortable: false, menuDisabled : true  }
        ];
        this.callParent(arguments);
    },
    dockedItems: [{
        xtype: 'pagingtoolbar',
        store: 'List',
        dock: 'bottom',
        displayInfo: true
    }],
    onRender: function(){
        this.store.load();
        this.callParent(arguments);
    }
})