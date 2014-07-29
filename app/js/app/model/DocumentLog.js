Ext.define('FS.model.DocumentLog',{
    extend: 'Ext.data.Model',
    idProperty: 'log_id',
    fields: [
        {name: 'log_id', type: 'int'},
        {name: 'fs_id', type: 'int'},
        {name: 'fs_parent', type: 'int'},
        {name: 'fs_textname', type: 'string'},
        {name: 'fs_name', type: 'string'},
        {name: 'fs_intro', type: 'string'},
        {name: 'log_user', type: 'string'},
        {name: 'fs_size', type: 'string'},
        {name: 'fs_type', type: 'string'},
        {name: 'log_type', type: 'string'},
        {name: 'log_lastname', type: 'string'},
        {name: 'log_optdate', type: 'string'},
        {name: 'u_name', type: 'string'},
        {name: 'fs_parent', type: 'int'}
    ]
})