-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Jul 17, 2015 at 11:31 AM
-- Server version: 5.6.17
-- PHP Version: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `mysql`
--

-- --------------------------------------------------------

--
-- Table structure for table `bhm_help_modals`
--

CREATE TABLE IF NOT EXISTS `bhm_help_modals` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `help_page_id` int(20) NOT NULL,
  `field_selecter` varchar(50) CHARACTER SET utf8 NOT NULL,
  `title` varchar(50) CHARACTER SET utf8 NOT NULL,
  `large` tinyint(1) NOT NULL DEFAULT '0',
  `html` text CHARACTER SET utf8 NOT NULL,
  UNIQUE KEY `id` (`id`),
  KEY `filename` (`help_page_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

--
-- Dumping data for table `bhm_help_modals`
--

INSERT INTO `bhm_help_modals` (`id`, `help_page_id`, `field_selecter`, `title`, `large`, `html`) VALUES
(1, 1, '.bhm-help', 'Help with Helpers (Large)', 1, '<p>The default setting for helper icons is to append it to the element(s) selected. On this test page, the following styles were applied to help the display with <code>&lt;h2&gt;</code> tags.</p>\n\n<pre>\n<code>    .bhm-helper {\n        cursor: pointer;\n    }\n    h1 .bhm-helper, h2 .bhm-helper, h3 .bhm-helper {\n        font-size: 16px;\n        position:relative;\n        top: -10px;\n    }\n</code></pre>\n'),
(2, 1, '#bhm-help-justone', 'Help with Just One (Large)', 1, '<p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>\n'),
(3, 1, '.bhm-help-input', 'Help with Input (Group)', 0, '<p>Input-group help</p>\n\n<p>&nbsp;</p>\n\n<p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>\n'),
(4, 1, '#bhm-button-help', 'Help with Button', 0, '<p><code>&lt;button&gt;</code>s will be wrapped&nbsp;in&nbsp;<code>.btn-group</code>s.&nbsp;</p>\n\n<p>Note: <code>.btn-block</code> classes will be removed from <code>&lt;button&gt;</code>s as <code>.btn-group</code> breaks the btn-block styling.</p>\n'),
(5, 1, 'textarea', 'Help with Textarea', 1, '<p>Textarea helpers look for the attached label (closest <code>.form-group</code>''s child label) and appends there.</p>\n\n<p>If no label is found, the help icon is added before the <code>&lt;textarea&gt;</code>.</p>\n'),
(6, 1, 'select', 'Help with Select', 0, '<p><code>&lt;select&gt;</code> tags receive <code>.input-group</code> icons. Use caution when adding helpers to <code>&lt;selects&gt;</code>s as bootstrap''s documentation states:</p>\n\n<blockquote>\n<p>Textual <code>&lt;input&gt;</code>s only</p>\n\n<p>Avoid using <code>&lt;select&gt;</code> elements here as they cannot be fully styled in WebKit browsers.</p>\n\n<p>Avoid using <code>&lt;textarea&gt;</code> elements here as their <code>rows</code> attribute will not be respected in some cases.</p>\n</blockquote>\n');

-- --------------------------------------------------------

--
-- Table structure for table `bhm_help_pages`
--

CREATE TABLE IF NOT EXISTS `bhm_help_pages` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `url` varchar(200) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `url` (`url`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `bhm_help_pages`
--

INSERT INTO `bhm_help_pages` (`id`, `url`) VALUES
(1, '/dev/Bootstrap-Help-Manager/tests/bhm.testclient.html');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
