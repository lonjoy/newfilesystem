Ext.Loader.setConfig({enabled:true});//开启动态加载
Ext.application({
    name: 'FS', //将这个namespace注册到Ext.Loader
    autoCreateViewport: true,
    appFolder: 'js/app',
    launch:function(){
        //this.controllers.addListener('add',this.newControllerAdded,this);
    },
    //newControllerAdded:function(idx, ctrlr, token){
        //ctrlr.init();
    //},
    controllers: [
    'Main'
    ]
});