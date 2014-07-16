Ext.define('FS.view.project.Tree',{
    extend: 'Ext.tree.Panel',
    alias: 'widget.projectTreeList',
    region:'west',
    title: '项目列表',
    width:200,
    split: true,
    collapsible: true,
    rootVisible: false,
    singleExpand: false,
    autoScroll:false,
    autoHeight: true,
    multiSelect : true,
    layout: 'fit',
    root:{
        text: '中国机械设备工程股份有限公司',
    },
    border:0,
    store: 'Tree',
    viewConfig:{
        plugins:{
            ptype: 'treeviewdragdrop',
            appendOnly: true
        }
    },
    //draggable: true,
    initComponent: function(){
        this.callParent(arguments);
    },
    onRender: function(){
        //this.store.load();
        this.callParent(arguments);
    }
})