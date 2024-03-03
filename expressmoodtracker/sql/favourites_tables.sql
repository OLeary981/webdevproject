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
) ENGINE=InnoDB AUTO_INCREMENT=287 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `favourites`
--

INSERT INTO `favourites` (`id`, `person`, `favourite`) VALUES
(167, 'Joe', 'Meat'),
(189, 'Alice', 'Fish'),
(195, 'Zed', 'Desert'),
(257, 'Alice', 'Meat'),
(268, 'Joe', 'Vegetables'),
(269, 'Alice', 'Desert'),
(270, 'Carol', 'Fish'),
(271, 'Zed', 'Meat'),
(272, 'Jim', 'Desert'),
(273, 'Bob', 'Fish'),
(275, 'Lou', 'Fish'),
(276, 'Tony', 'Meat'),
(277, 'Bob', 'Fish'),
(279, 'Bert', 'Fish'),
(283, 'Zed', 'Fish');

-- --------------------------------------------------------

--
-- Table structure for table `favourites_users`
--

CREATE TABLE IF NOT EXISTS `favourites_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `favourites_users`
--

INSERT INTO `favourites_users` (`id`, `username`, `password`) VALUES
(1, 'bob', 'bob123'),
(2, 'admin', 'admin123');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
