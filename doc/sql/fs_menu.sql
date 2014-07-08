/*
Navicat MySQL Data Transfer

Source Server         : 本地
Source Server Version : 50524
Source Host           : 127.0.0.1:3306
Source Database       : filesystem

Target Server Type    : MYSQL
Target Server Version : 50524
File Encoding         : 65001

Date: 2014-07-09 00:21:18
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `fs_menu`
-- ----------------------------
DROP TABLE IF EXISTS `fs_menu`;
CREATE TABLE `fs_menu` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '',
  `parentid` int(10) NOT NULL DEFAULT '0',
  `listorder` int(10) NOT NULL DEFAULT '0',
  `display` tinyint(1) NOT NULL DEFAULT '1',
  `xtypeclass` varchar(20) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8 COMMENT='权限菜单表';

-- ----------------------------
-- Records of fs_menu
-- ----------------------------
INSERT INTO `fs_menu` VALUES ('1', '文件及文件夹管理', '0', '0', '1', '');
INSERT INTO `fs_menu` VALUES ('2', '工作组和组员管理', '0', '1', '1', '');
INSERT INTO `fs_menu` VALUES ('3', '日志管理', '0', '1', '1', '');
INSERT INTO `fs_menu` VALUES ('4', '生成目录', '0', '1', '1', '');
INSERT INTO `fs_menu` VALUES ('5', '项目管理', '1', '0', '1', 'projectview');
INSERT INTO `fs_menu` VALUES ('6', '文件查询', '1', '0', '1', '');
INSERT INTO `fs_menu` VALUES ('7', '公共信息栏', '1', '0', '1', '');
INSERT INTO `fs_menu` VALUES ('8', '创建公共信息栏', '1', '0', '1', '');
INSERT INTO `fs_menu` VALUES ('9', '工作组列表', '2', '0', '1', '');
INSERT INTO `fs_menu` VALUES ('10', '添加工作组', '2', '0', '1', '');
INSERT INTO `fs_menu` VALUES ('11', '系统操作日志', '3', '0', '1', '');
INSERT INTO `fs_menu` VALUES ('12', '文件操作日志', '3', '0', '1', '');
INSERT INTO `fs_menu` VALUES ('13', '生成目录', '4', '0', '1', '');
INSERT INTO `fs_menu` VALUES ('14', '生成公共文件目录', '4', '0', '1', '');
INSERT INTO `fs_menu` VALUES ('15', '邮件管理', '0', '0', '1', '');
INSERT INTO `fs_menu` VALUES ('16', '查看邮件列表', '15', '0', '1', '');
