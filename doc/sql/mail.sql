CREATE TABLE `fs_mail_contents` (
  `object_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL DEFAULT '0',
  `uid` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `from` varchar(100) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `from_name` varchar(250) COLLATE utf8_unicode_ci DEFAULT NULL,
  `sent_date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `received_date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `has_attachments` int(1) NOT NULL DEFAULT '0',
  `size` int(10) NOT NULL DEFAULT '0',
  `state` int(1) NOT NULL DEFAULT '0' COMMENT '0:nothing, 1:sent, 2:draft',
  `is_deleted` int(1) NOT NULL DEFAULT '0',
  `is_shared` int(1) NOT NULL DEFAULT '0',
  `imap_folder_name` varchar(100) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `account_email` varchar(100) COLLATE utf8_unicode_ci DEFAULT '',
  `content_file_id` varchar(40) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `message_id` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT 'Message-Id header',
  `in_reply_to_id` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT 'Message-Id header of the previous email in the conversation',
  `conversation_id` int(10) unsigned NOT NULL DEFAULT '0',
  `conversation_last` int(1) NOT NULL DEFAULT '1',
  `sync` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`object_id`),
  KEY `account_id` (`user_id`,`uid`),
  KEY `sent_date` (`sent_date`),
  KEY `received_date` (`received_date`),
  KEY `uid` (`uid`),
  KEY `conversation_id` (`conversation_id`),
  KEY `message_id` (`message_id`),
  KEY `state` (`state`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;



CREATE TABLE `fs_mail_datas` (
  `id` int(10) unsigned NOT NULL,
  `to` text COLLATE utf8_unicode_ci NOT NULL,
  `cc` text COLLATE utf8_unicode_ci NOT NULL,
  `bcc` text COLLATE utf8_unicode_ci NOT NULL,
  `subject` text COLLATE utf8_unicode_ci,
  `content` text COLLATE utf8_unicode_ci,
  `body_plain` longtext COLLATE utf8_unicode_ci,
  `body_html` longtext COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

