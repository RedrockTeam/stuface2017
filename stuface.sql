/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 50717
 Source Host           : localhost
 Source Database       : stuface

 Target Server Type    : MySQL
 Target Server Version : 50717
 File Encoding         : utf-8

 Date: 08/07/2017 10:08:13 AM
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `tbl_image`
-- ----------------------------
DROP TABLE IF EXISTS `tbl_image`;
CREATE TABLE `tbl_image` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pic` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `big_pic` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `uid` int(20) NOT NULL,
  `vote` int(4) unsigned zerofill NOT NULL DEFAULT '0000',
  `time` int(10) NOT NULL,
  `sex` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `is_pass` int(1) unsigned zerofill NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=110 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
--  Records of `tbl_image`
-- ----------------------------
BEGIN;
INSERT INTO `tbl_image` VALUES ('105', '20170806/2015211878_1502022895.jpg', '20170806/2015211878_1502022895_big.jpg', '2015211878', '0', '1502020895', '男', '1'), ('106', '20170806/2015211888_1502022900.jpg', '20170806/2015211888_1502022900_big.jpg', '2015211888', '1', '1502022900', '男', '2'), ('108', '20170806/2015211878_1502023742.jpg', '20170806/2015211878_1502023742_big.jpg', '2015211878', '2', '1502021742', '男', '2'), ('109', '20170807/2015211812_1502067957.jpg', '20170807/2015211812_1502067957_big.jpg', '2015211812', '0', '1502067957', '男', '3');
COMMIT;

-- ----------------------------
--  Table structure for `tbl_manager`
-- ----------------------------
DROP TABLE IF EXISTS `tbl_manager`;
CREATE TABLE `tbl_manager` (
  `id` int(11) NOT NULL,
  `manager` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
--  Records of `tbl_manager`
-- ----------------------------
BEGIN;
INSERT INTO `tbl_manager` VALUES ('1', 'redrockstaff', 'redrockstaff');
COMMIT;

-- ----------------------------
--  Table structure for `tbl_user`
-- ----------------------------
DROP TABLE IF EXISTS `tbl_user`;
CREATE TABLE `tbl_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `stu_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `uid` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `sex` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
--  Records of `tbl_user`
-- ----------------------------
BEGIN;
INSERT INTO `tbl_user` VALUES ('1', '张三', '2014', '2014', '男'), ('2', '李四', '2015', '2015', '男'), ('3', '王思', '111111', '111111', '女'), ('4', '王一仁', '2015212432', '092516', '男'), ('5', '111', '666', '666', '男'), ('6', '', '111', '111', ''), ('7', '', '222', '222', ''), ('8', '', '333', '333', ''), ('9', '43', '43', '43', '0'), ('10', '5', '7', '7', '7'), ('11', '3', '22', '22', '1'), ('12', '', '999', '999', ''), ('13', '梁宸', '2014214054', '', '0'), ('14', 'dsadsa', 'dsad', '', 'dsada'), ('15', '王良', '2014255486', '', '男'), ('16', '333', '233', '233', '男'), ('18', 'ff', '1', '2', '男'), ('21', '李立平', '2015211878', '024914', '男'), ('22', 'dd', '2015211888', '222', '男'), ('23', '13', '2015211812', '222', '男');
COMMIT;

-- ----------------------------
--  Table structure for `tbl_vote`
-- ----------------------------
DROP TABLE IF EXISTS `tbl_vote`;
CREATE TABLE `tbl_vote` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `vote_uid` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `vote_day` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
--  Records of `tbl_vote`
-- ----------------------------
BEGIN;
INSERT INTO `tbl_vote` VALUES ('35', '2015211878', '2015211878', '1502071447'), ('36', '2015211878', '2015211888', '1502071464');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
