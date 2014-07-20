Ext.define('FS.view.search.SearchPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.searchview',
    layout: 'border',
    
    initComponent: function(){
        this.items=[
        {xtype:'searchform'},
        {xtype:'searchList'}
        ];
        this.callParent(arguments);
    }
})
