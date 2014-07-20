Ext.define('FS.controller.Search', {
    extend: 'Ext.app.Controller',

    stores:['Search'],
    views:[       
    'search.SearchPanel',
    'search.Form',
    'search.List'
    ],
    refs:[{
        ref: 'searchform',
        selector: 'searchform'
    },{
        ref: 'searchList',
        selector: 'searchList'
    }],
    init: function(){
        this.control({
            'searchform button':{
                click: function(){
                    if(this.getSearchform().getForm().isValid()){
                        this.getSearchStore().load({params:this.getSearchform().getForm().getValues()});
                    }
                }
            },
            'searchList pagingtoolbar button': {
                click: function(obj, event){
                    //get store getProxy , then proxy has extraParams param to set add param
                    this.getSearchStore().getProxy().extraParams=this.getSearchform().getForm().getValues();
                    this.getSearchStore().load();
                }
            },
            'searchList':{
                containercontextmenu: this.getController('ProjectView').powermenufun,
                itemdblclick: this.opendoc,
                itemcontextmenu: this.getController('ProjectView').powermenufun
            } 
        })
    },
    //菜单功能
    opendoc: function(view, rcd, item, index, event){
        event.preventDefault();
        event.stopEvent();
        if(rcd.get('fs_isdir')==1){
            //add parent record
            //this.getParentRecordStore().removeAll();
            //this.getParentRecordStore().add(rcd);
            this.getSearchStore().load({params:{fs_id:rcd.get('fs_id')}}); //加载grid数据 
        }
        if(rcd.get('fs_isdir')==0){
            window.open(base_path+"index.php?c=document&a=openfile&fs_id="+rcd.get('fs_id')+'&t='+rcd.get('fs_type'));
        }
    },

})
