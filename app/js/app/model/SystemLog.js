Ext.define('FS.model.SystemLog',{
    extend: 'Ext.data.Model',
    idProperty: 'log_id',
    fields: [
        {name: 'log_id', type: 'int'},
        {name: 'log_date', type: 'string'},
        {name: 'log_user', type: 'string'},
        {name: 'log_email', type: 'string'},
        {name: 'log_desc', type: 'string'}
    ]
})