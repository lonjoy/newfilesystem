Ext.define('FS.store.Navbar',{
    extend: 'Ext.data.Store',
    model: 'FS.model.List',
    autoLoad: false,
    proxy:{
        type: 'localstorage',
        id: 'localnavbarstore'
    }
})