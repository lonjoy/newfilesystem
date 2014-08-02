Ext.define('FS.view.workgroup.Tree',{
    extend: 'Ext.tree.Panel',
    alias: 'widget.workgroupTreeList',
    region:'west',
    title: '工作组列表',
    width:200,
    split: true,
    collapsible: true,
    rootVisible: false,
    singleExpand: false,
    autoScroll:false,
    autoHeight: true,
    layout: 'fit',
    root:{
        text: '中国机械设备工程股份有限公司'
    },
    border:0,
    store: 'WorkgroupTreeTwo',
    initComponent: function(){
        this.callParent(arguments);
    }
})