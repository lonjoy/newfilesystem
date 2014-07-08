Ext.define('FS.controller.ProjectView', {
    extend: 'Ext.app.Controller',

    views:[       
    'project.ProjectView'
    ],

    requires: [
    'FS.controller.Project',
    'FS.controller.ProjectTree'
    ],
    init: function(){
        this.control({
            
        });
    }
})
