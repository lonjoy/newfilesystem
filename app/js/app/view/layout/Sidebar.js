Ext.define('FS.view.layout.Sidebar',{
    extend: 'Ext.panel.Panel',
    region: 'west',
    title: '管理菜单',
    xtype: 'sidebar',
    iconCls: 'Sitemap',
    split: true,
    collapsible: true,
    width:180,
    layout: {
        type: 'accordion',
        animate: true
    },
    items: [
    {
        title: '文件和文件夹管理',
        xtype: 'treepanel',
        iconCls: 'icon_forder',
        rootVisible: false,
        split: true,
        collapsible: true,
        store: 'FS.store.menu.DocTree'
    },
    {
        title: '工作组和组员管理',
        xtype: 'treepanel',
        iconCls: 'icon_group',
        rootVisible: false,
        split: true,
        collapsible: true,
        store: 'FS.store.menu.GroupTree'
    },
    {
        title: '日志管理',
        xtype: 'treepanel',
        rootVisible: false,
        iconCls: 'icon_log',
        store: 'FS.store.menu.LogTree'
    },
    {
        title: '生成目录',
        xtype: 'treepanel',
        iconCls: 'icon_log',
        rootVisible: false,
        split: true,
        collapsible: true,
        store: 'FS.store.menu.GenerateDocTree'
    },
    {
        title: '邮件管理',
        xtype: 'treepanel',
        iconCls: 'icon_log',
        rootVisible: false,
        collapsible: true,
        store: 'FS.store.menu.EmailTree' 
    }
    ]
});