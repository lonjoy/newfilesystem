Ext.define('FS.model.List',{
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {name: 'id', type: 'int'},
        {name: 'text', type: 'string'},
        {name: 'fs_name', type: 'string'},
        {name: 'fs_isdir', type: 'int'},
        {name: 'fs_intro', type: 'string'},
        {name: 'fs_encrypt', type: 'int'},
        {name: 'fs_haspaper', type: 'int'},
        {name: 'fs_create', type: 'string'},
        {name: 'fs_lastmodify', type: 'string'},
        {name: 'fs_id', type: 'int'},
        {name: 'icon', type: 'string'},
        {name: 'fs_size', type: 'string'},
        {name: 'managerok', type: 'string'},
        {name: 'fs_id_path', type: 'string'},
        {name: 'fs_group', type: 'int'},
        {name: 'fs_user', type: 'int'},
        {name: 'u_name', type: 'string'},
        {name: 'fs_parent', type: 'int'},
        {name: 'fs_is_share', type: 'int'},
        {name: 'fs_type', type: 'string'},
        {name: 'fs_hashname', type: 'string'},
        {name: 'fs_fullpath', type: 'string'}
    ]
})