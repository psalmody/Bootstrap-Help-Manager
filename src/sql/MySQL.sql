-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Jul 21, 2015 at 12:44 PM
-- Server version: 5.6.17
-- PHP Version: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `mysql`
--

-- --------------------------------------------------------

--
-- Table structure for table `bhm_helpers`
--

CREATE TABLE IF NOT EXISTS `bhm_helpers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `field_selecter` varchar(50) CHARACTER SET utf8 NOT NULL,
  `title` varchar(50) CHARACTER SET utf8 NOT NULL,
  `large` tinyint(1) NOT NULL DEFAULT '0',
  `html` text CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=8 ;

--
-- Dumping data for table `bhm_helpers`
--

INSERT INTO `bhm_helpers` (`id`, `field_selecter`, `title`, `large`, `html`) VALUES
(1, '.bhm-help', 'Help with Helpers (Large)', 1, '<p>The default setting for helper icons is to append it to the element(s) selected. On this test page, the following styles were applied to help the display with <code>&lt;h2&gt;</code> tags.</p>\n\n<pre>\n<code>    .bhm-helper {\n        cursor: pointer;\n    }\n    h1 .bhm-helper, h2 .bhm-helper, h3 .bhm-helper {\n        font-size: 16px;\n        position:relative;\n        top: -10px;\n    }\n</code></pre>\n'),
(2, '#bhm-help-justone', 'Help with Just One (Large)', 1, '<p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>\n'),
(3, '.bhm-help-input', 'Help with Input (Group)', 0, '<p>Input-group help</p>\n\n<p>&nbsp;</p>\n\n<p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>\n'),
(4, '#bhm-button-help', 'Help with Button', 0, '<p><code>&lt;button&gt;</code>s will be wrapped&nbsp;in&nbsp;<code>.btn-group</code>s.&nbsp;</p>\n\n<p>Note: <code>.btn-block</code> classes will be removed from <code>&lt;button&gt;</code>s as <code>.btn-group</code> breaks the btn-block styling.</p>\n\n<p>&nbsp;</p>\n\n<p>\\Test</p>\n'),
(5, 'textarea', 'Help with Textarea', 1, '<p>Textarea helpers look for the attached label (closest <code>.form-group</code>''s child label) and appends there.</p>\n\n<p>If no label is found, the help icon is added before the <code>&lt;textarea&gt;</code>.</p>\n'),
(6, 'select', 'Help with Select', 0, '<p><code>&lt;select&gt;</code> tags receive <code>.input-group</code> icons. Use caution when adding helpers to <code>&lt;selects&gt;</code>s as bootstrap''s documentation states:</p>\n\n<blockquote>\n<p>Textual <code>&lt;input&gt;</code>s only</p>\n\n<p>Avoid using <code>&lt;select&gt;</code> elements here as they cannot be fully styled in WebKit browsers.</p>\n\n<p>Avoid using <code>&lt;textarea&gt;</code> elements here as their <code>rows</code> attribute will not be respected in some cases.</p>\n</blockquote>\n'),
(7, 'h2', 'Help with Headers', 0, '<p>Hey! It''s working on an index page! Try accessing with and without the /index.html at the end of the url.</p>\n');

-- --------------------------------------------------------

--
-- Table structure for table `bhm_pages`
--

CREATE TABLE IF NOT EXISTS `bhm_pages` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `url` varchar(200) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `url` (`url`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `bhm_pages`
--

INSERT INTO `bhm_pages` (`id`, `url`) VALUES
(1, '/dev/Bootstrap-Help-Manager/tests/bhm.testclient.html'),
(2, '/dev/Bootstrap-Help-Manager/tests/index.html');

-- --------------------------------------------------------

--
-- Table structure for table `bhm_relationships`
--

CREATE TABLE IF NOT EXISTS `bhm_relationships` (
  `help_id` int(11) NOT NULL,
  `page_id` int(11) NOT NULL,
  PRIMARY KEY (`help_id`,`page_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `bhm_relationships`
--

INSERT INTO `bhm_relationships` (`help_id`, `page_id`) VALUES
(1, 1),
(2, 1),
(3, 1),
(4, 1),
(5, 1),
(5, 2),
(6, 2),
(7, 1);
