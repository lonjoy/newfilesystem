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
        aler(33);
        this.control({
            'projectview > projectList': {
                containercontextmenu: this.powermenufun,
                itemdblclick: this.opendoc
            }
        });
    },
    powermenufun: function(){
        alert('powermenu');
    }
})
