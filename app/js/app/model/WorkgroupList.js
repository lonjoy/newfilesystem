Ext.define('FS.model.WorkgroupList',{
    extend: 'Ext.data.Model',
    idProperty: 'u_id',
    fields: [
        {name: 'u_id', type: 'int'},
        {name: 'u_name', type: 'string'},
        {name: 'u_parent', type: 'int'},
        {name: 'u_email', type: 'string'},
        {name: 'u_isgroup', type: 'int'},
        {name: 'u_grade', type: 'string'}
    ]
})