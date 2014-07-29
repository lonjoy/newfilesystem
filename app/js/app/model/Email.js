Ext.define('FS.model.Email',{
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {name: 'msg_id', type: 'int'},
        {name: 'size', type: 'int'},
        {name: 'uid', type: 'string'},
        {name: 'subject', type: 'string'},
        {name: 'from', type: 'string'},
        {name: 'received_date', type: 'string'}
    ]
})