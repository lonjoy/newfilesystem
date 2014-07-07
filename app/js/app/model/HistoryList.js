Ext.define('FS.model.HistoryList',{
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {name: 'fs_id', type: 'int'},
        {name: 'fs_name', type: 'string'},
        {name: 'fs_intro', type: 'string'},
        {name: 'log_type', type: 'string'},
        {name: 'log_user', type: 'string'},
        {name: 'fs_size', type: 'string'},
        {name: 'log_optdate', type: 'string'},
        {name: 'fs_type', type: 'string'}
    ]
})