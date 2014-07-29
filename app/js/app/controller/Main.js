Ext.define('FS.controller.Main',{
    extend: 'Ext.app.Controller',
    stores: [
        'FS.store.menu.DocTree',
        'FS.store.menu.GroupTree',
        'FS.store.menu.LogTree',
        'FS.store.menu.GenerateDocTree',
        'FS.store.menu.EmailTree'
    ],
    init: function(){
        this.control({
            'sidebar > treepanel':{
                afterrender:function(treepanel){
                    treepanel.on('itemclick',function(view,record,item,index){
                        if (record.get('leaf')) {
                            var title = treepanel.ownerCt.ownerCt.down('#tabCenter').items.findBy(function(result) {
                                return result.title === record.get('text');
                            });
                            if (!title) {
                                treepanel.ownerCt.ownerCt.down('#tabCenter').add({
                                    title: record.get('text') || '未命名标题',
                                    closable: true,
                                    layout: 'fit',
                                    autoDestroy: true,
                                    items: {
                                        xtype: record.raw['xtypeclass']
                                    }
                                }).show();
                            } else {
                                treepanel.ownerCt.ownerCt.down('#tabCenter').setActiveTab(title);
                            }
                        
                        }
                    },this);
                }
            }
        });
    }
});
