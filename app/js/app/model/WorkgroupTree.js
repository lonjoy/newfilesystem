Ext.define('FS.model.WorkgroupTree',{
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {name: 'u_id', type: 'int'},
        {name: 'u_name', type: 'string'},
        {name: 'u_parent', type: 'int'},
        {name: 'u_email', type: 'string'},
        {name: 'u_isgroup', type: 'int'},
        {name: 'text', type: 'string'},
        {name: 'u_grade', type: 'string'},
        {name: 'id', type: 'int'}
    ]
})