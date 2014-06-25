<?php
    /**
    * @name      M_Menu.php
    * @describe  左侧菜单
    * @author    qinqf
    * @version   1.0 
    * @todo       
    * @changelog  
    */  
    class M_Menu extends M_Model {

        static $db;
        static $table_name = 'fs_menu';
        /*** 初始化操作 */
        public static function init(){
            self::$db = parent::init();    
        }


        /**
        * 获取文档管理菜单树
        * 
        */
        public static function docmenu() {
            self::init();
            $rs = array();
            $sql = "select * from ".self::$table_name." where parentid=1 and display=1";
            $rs = self::$db->get_results($sql);
            if(!empty($rs)){
                foreach($rs as &$val){
                    $val['leaf'] = true;
                    $val['text'] = $val['name'];
                }
            }
            return $rs; 
        }

        /**
        * 获取文档管理菜单树
        * 
        */
        public static function groupmenu() {
            self::init();
            $rs = array();
            $sql = "select * from ".self::$table_name." where parentid=2 and display=1";
            $rs = self::$db->get_results($sql);
            if(!empty($rs)){
                foreach($rs as &$val){
                    $val['leaf'] = true;
                    $val['text'] = $val['name'];
                }
            }
            return $rs; 
        }
        /**
        * 获取文档管理菜单树
        * 
        */
        public static function logmenu() {
            self::init();
            $rs = array();
            $sql = "select * from ".self::$table_name." where parentid=3 and display=1";
            $rs = self::$db->get_results($sql);
            if(!empty($rs)){
                foreach($rs as &$val){
                    $val['leaf'] = true;
                    $val['text'] = $val['name'];
                }
            }
            return $rs; 
        }  
        /**
        * 获取文档管理菜单树
        * 
        */
        public static function generateDocmenu() {
            self::init();
            $rs = array();
            $sql = "select * from ".self::$table_name." where parentid=4 and display=1";
            $rs = self::$db->get_results($sql);
            if(!empty($rs)){
                foreach($rs as &$val){
                    $val['leaf'] = true;
                    $val['text'] = $val['name'];
                }
            }
            return $rs; 
        }        
        
        /**
        * 获取文档管理菜单树
        * 
        */
        public static function emailmenu() {
            self::init();
            $rs = array();
            $sql = "select * from ".self::$table_name." where parentid=15 and display=1";
            $rs = self::$db->get_results($sql);
            if(!empty($rs)){
                foreach($rs as &$val){
                    $val['leaf'] = true;
                    $val['text'] = $val['name'];
                }
            }
            return $rs; 
        }

    }
?>
