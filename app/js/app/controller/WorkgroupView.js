Ext.define('FS.controller.WorkgroupView', {
    extend: 'Ext.app.Controller',
    stores: [
    'WorkgroupTreeTwo',
    'WorkgroupList'
    ],
    views:[
    'workgroup.WorkgroupView',
    'workgroup.List',
    'workgroup.Tree'       
    ],

    init: function(){
        this.control({
            'workgroupTreeList':{
                 beforeitemexpand:function(rcd){
                    if(!rcd.isRoot()){
                        this.getWorkgroupTreeTwoStore().setProxy({
                            type:'ajax', 
                            url: base_path + "index.php?c=usergroup&a=listgroupuser&groupid="+rcd.get('u_id'),
                            reader:'json'
                        });
                    }else{
                        //rcd.removeAll();
                        this.getWorkgroupTreeTwoStore().setProxy({
                            type: 'ajax',
                            url: base_path + "index.php?c=usergroup&a=listworkgroup",
                            reader: {
                                type: 'json',
                                root: ''
                            }
                        });
                    }
                },
            }
        });
    }
    
})
