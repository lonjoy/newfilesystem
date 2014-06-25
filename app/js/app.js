Ext.Loader.setConfig({enabled:true});//开启动态加载
Ext.application({
    name: 'FS', //将这个namespace注册到Ext.Loader
    autoCreateViewport: true,
    appFolder: 'js/app',
    launch:function(){
          
    },
    controllers: [
        'Main',
        'Project'
    ]
});