-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Table structure for table `favourites`
--

CREATE TABLE IF NOT EXISTS `favourites` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `person` varchar(255) NOT NULL,
  `favourite` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=234 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `favourites`
--

INSERT INTO `favourites` (`id`, `person`, `favourite`) VALUES
(167, 'Jim', 'Fish'),
(168, 'Bob', 'Desert'),
(189, 'Alice', 'Fish'),
(195, 'Zed', 'Vegetables'),
(197, 'Bob', 'Fish'),
(199, 'Joe', 'Vegetables'),
(200, 'Bob', 'Fish'),
(215, 'Alice', 'Meat'),
(216, 'Bob', 'Vegetables'),
(224, 'Zed', 'Fish'),
(230, 'Jim', 'Fish'),
(231, 'Zed', 'Desert'),
(233, 'Leo', 'Desert');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
