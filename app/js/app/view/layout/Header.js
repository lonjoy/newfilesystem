Ext.define('FS.view.layout.Header', {
    extend: 'Ext.Toolbar',
    initComponent: function() {
        Ext.applyIf(this, {
			id: 'header-panel',
            region: 'north',
            height: 30,
			items:[{
				iconCls : 'icon-user',  
                text : login_user.u_name
			},'-',{
				text : '当前角色：['+login_user.u_gradename+']'
			},'-',{
				text : Ext.Date.format(new Date(),'Y年m月d日')
			},'-',{
				text : '修改密码',  
				iconCls : 'icon-user-edit', 
				handler: function(){
					//alterpwd();
				} 
			},'-',{
				xtype:'button',
				text : '退出',  
				iconCls : 'icon-logout',
				listeners: {
					click: function(){
						//window.location.href=base_path+'index.php?c=login&a=loginout'; 
					}
				}
			}]
		});
      
		this.callParent(arguments);
    }
});
