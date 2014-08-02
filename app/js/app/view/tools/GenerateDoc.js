Ext.define('FS.view.tools.GenerateDoc',{
    extend: 'Ext.panel.Panel',
    alias: 'widget.generatedoc',
    region:'center',
    autoWidth: true,
    html:'<iframe src="/index.php?c=document&a=listUserDocument" frameborder="0" marginheight="0" marginwidth="0" width="100%" height="100%"></iframe>'
})