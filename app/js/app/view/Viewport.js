Ext.define('FS.view.Viewport', {
    extend: 'Ext.container.Viewport',
    layout: 'fit',
    requires: [
    'FS.view.layout.Sidebar',
    'FS.view.layout.Header',
    'FS.view.layout.Footer',
    'FS.view.layout.Main',
    'Ext.layout.container.Border'
    ],
    initComponent: function(){
        Ext.apply(this, {
            layout: 'border',
            items:[
            Ext.create('FS.view.layout.Sidebar'),
            Ext.create('FS.view.layout.Header'),
            Ext.create('FS.view.layout.Footer'),
            Ext.create('FS.view.layout.Main')
            ]
        });
        this.callParent(arguments);
    }
});
