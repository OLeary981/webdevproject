DROP TABLE IF EXISTS `snapshot_trigger`;
DROP TABLE IF EXISTS `snapshot`;
DROP TABLE IF EXISTS `trigger`;
DROP TABLE IF EXISTS user_details;

-- User table
CREATE TABLE user_details (
    user_ID INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email_address VARCHAR(255),
    Password VARCHAR(255)
);
INSERT INTO user_details (first_name, last_name, email_address) VALUES
('Joan', 'Bloggs', 'joan.bloggs@gmail.com');

-- Snapshot table
CREATE TABLE `snapshot` (
    snapshot_ID INT AUTO_INCREMENT PRIMARY KEY,
    enjoyment_level INT,
    surprise_level INT,
    contempt_level INT,
    sadness_level INT,
    fear_level INT,
    disgust_level INT,
    anger_level INT,
    user_id INT,
    timestamp DATETIME,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES user_details (user_id)
);
INSERT INTO `snapshot` (`snapshot_ID`, `enjoyment_level`, `surprise_level`, `contempt_level`, `sadness_level`, `fear_level`, `disgust_level`, `anger_level`, `user_id`, `timestamp`, `notes`) VALUES
(52, 6, 1, 0, 1, 2, 1, 1, 1, '2023-07-01 06:00:00', 'Enjoyed a morning walk in the park with friends.'),
(53, 7, 1, 0, 2, 3, 1, 1, 1, '2023-07-03 14:00:00', 'Had a successful presentation at work.'),
(54, 5, 1, 0, 3, 4, 1, 1, 1, '2023-07-05 10:00:00', 'Feeling a bit down due to family issues.'),
(55, 8, 1, 0, 1, 2, 1, 1, 1, '2023-07-06 18:00:00', 'Spent a lovely evening with friends.'),
(56, 6, 1, 0, 2, 8, 1, 3, 1, '2023-07-08 12:00:00', 'Feeling anxious and sad due to a sick grandparent.'),
(57, 7, 1, 0, 1, 3, 1, 1, 1, '2023-07-10 09:00:00', 'Went for a hike with friends.'),
(58, 6, 1, 0, 3, 4, 1, 1, 1, '2023-07-12 16:00:00', 'Feeling worried about family.'),
(59, 8, 1, 0, 2, 9, 1, 4, 1, '2023-07-13 20:00:00', 'Received bad news about my grandparent.'),
(60, 5, 1, 0, 3, 2, 1, 1, 1, '2023-07-15 11:00:00', 'Struggling with emotions.'),
(61, 7, 1, 0, 2, 8, 1, 3, 1, '2023-07-17 07:00:00', 'Feeling overwhelmed with responsibilities.'),
(62, 6, 1, 0, 1, 2, 1, 1, 1, '2023-07-19 15:00:00', 'Had a nice chat with my grandparent.'),
(63, 7, 1, 0, 2, 3, 1, 1, 1, '2023-07-21 10:00:00', 'Feeling a bit better today.'),
(64, 8, 1, 0, 1, 5, 1, 2, 1, '2023-07-23 12:00:00', 'Visited my grandparent in the hospital.'),
(65, 6, 1, 0, 3, 4, 1, 1, 1, '2023-07-25 16:00:00', 'Feeling stressed about upcoming exams.'),
(66, 7, 1, 0, 2, 3, 1, 1, 1, '2023-07-27 10:00:00', 'Spent the day volunteering at a local shelter.'),
(67, 6, 1, 0, 1, 2, 1, 1, 1, '2023-07-29 15:00:00', 'Enjoyed a quiet day at home with family.'),
(68, 7, 1, 0, 2, 4, 1, 1, 1, '2023-07-31 09:00:00', 'Feeling excited about upcoming holiday plans.'),
(69, 8, 1, 0, 1, 2, 1, 1, 1, '2023-08-02 18:00:00', 'Attended a friend\'s wedding.'),
(70, 6, 1, 0, 2, 3, 1, 1, 1, '2023-08-04 10:00:00', 'Feeling a bit nostalgic today.'),
(71, 7, 1, 0, 1, 4, 1, 1, 1, '2023-08-06 09:00:00', 'Planning a family trip for next month.'),
(72, 6, 1, 0, 3, 2, 1, 1, 1, '2023-08-08 16:00:00', 'Feeling homesick.'),
(73, 7, 1, 0, 2, 8, 1, 3, 1, '2023-08-10 07:00:00', 'Received news about my grandparent\'s health.'),
(74, 8, 1, 0, 1, 3, 1, 1, 1, '2023-08-12 12:00:00', 'Went for a picnic with friends.'),
(75, 6, 1, 0, 2, 9, 1, 4, 1, '2023-08-14 20:00:00', 'Spent time with my grandparent.'),
(76, 7, 1, 0, 1, 3, 1, 1, 1, '2023-08-16 11:00:00', 'Feeling optimistic about the future.'),
(77, 8, 1, 0, 2, 8, 1, 3, 1, '2023-08-18 07:00:00', 'Preparing for an important presentation.'),
(78, 6, 1, 0, 1, 2, 1, 1, 1, '2023-08-20 15:00:00', 'Enjoyed a lazy Sunday morning.'),
(79, 7, 1, 0, 2, 3, 1, 1, 1, '2023-08-22 10:00:00', 'Had a great workout session.'),
(80, 8, 1, 0, 1, 5, 1, 2, 1, '2023-08-24 12:00:00', 'Attended a family gathering.'),
(81, 6, 1, 0, 3, 4, 1, 1, 1, '2023-08-26 16:00:00', 'Feeling overwhelmed with work.'),
(82, 6, 1, 0, 1, 2, 1, 1, 1, '2023-09-01 08:00:00', NULL),
(83, 7, 1, 0, 2, 3, 1, 1, 1, '2023-09-03 12:00:00', 'Feeling good after morning workout.'),
(84, 5, 1, 0, 3, 4, 1, 1, 1, '2023-09-05 14:00:00', NULL),
(85, 8, 1, 0, 1, 2, 1, 1, 1, '2023-09-07 18:00:00', 'Enjoyed a nice dinner with family.'),
(86, 6, 1, 0, 2, 8, 1, 3, 1, '2023-09-09 10:00:00', 'Received sad news about a friend.'),
(87, 7, 1, 0, 1, 3, 1, 1, 1, '2023-09-11 16:00:00', NULL),
(88, 6, 1, 0, 3, 4, 1, 1, 1, '2023-09-13 20:00:00', NULL),
(89, 8, 1, 0, 2, 9, 1, 4, 1, '2023-09-15 09:00:00', 'Visited my grandparent at the hospital.'),
(90, 5, 1, 0, 3, 2, 1, 1, 1, '2023-09-17 11:00:00', NULL),
(91, 7, 1, 0, 2, 8, 1, 3, 1, '2023-09-19 15:00:00', 'Feeling stressed about upcoming exams.'),
(92, 6, 1, 0, 1, 2, 1, 1, 1, '2023-09-21 17:00:00', NULL),
(93, 7, 1, 0, 2, 3, 1, 1, 1, '2023-09-23 19:00:00', 'Attended a friend\'s birthday party.'),
(94, 8, 1, 0, 1, 5, 1, 2, 1, '2023-09-25 08:00:00', NULL),
(95, 6, 1, 0, 3, 4, 1, 1, 1, '2023-09-27 10:00:00', NULL),
(96, 7, 1, 0, 2, 3, 1, 1, 1, '2023-09-29 14:00:00', 'Looking forward to the weekend.'),
(97, 6, 1, 0, 1, 2, 1, 1, 1, '2023-09-01 08:00:00', NULL),
(98, 7, 1, 0, 2, 3, 1, 1, 1, '2023-09-03 12:00:00', 'Feeling good after morning workout.'),
(99, 5, 1, 0, 3, 4, 1, 1, 1, '2023-09-05 14:00:00', NULL),
(100, 8, 1, 0, 1, 2, 1, 1, 1, '2023-09-07 18:00:00', 'Enjoyed a nice dinner with family.'),
(101, 6, 1, 0, 2, 8, 1, 3, 1, '2023-09-09 10:00:00', 'Received sad news about a friend.'),
(102, 7, 1, 0, 1, 3, 1, 1, 1, '2023-09-11 16:00:00', NULL),
(103, 6, 1, 0, 3, 4, 1, 1, 1, '2023-09-13 20:00:00', NULL),
(104, 8, 1, 0, 2, 9, 1, 4, 1, '2023-09-15 09:00:00', 'Visited my grandparent at the hospital.'),
(105, 5, 1, 0, 3, 2, 1, 1, 1, '2023-09-17 11:00:00', NULL),
(106, 7, 1, 0, 2, 8, 1, 3, 1, '2023-09-19 15:00:00', 'Feeling stressed about upcoming exams.'),
(107, 6, 1, 0, 1, 2, 1, 1, 1, '2023-09-21 17:00:00', NULL),
(108, 7, 1, 0, 2, 3, 1, 1, 1, '2023-09-23 19:00:00', 'Attended a friend\'s birthday party.'),
(109, 8, 1, 0, 1, 5, 1, 2, 1, '2023-09-25 08:00:00', NULL),
(110, 6, 1, 0, 3, 4, 1, 1, 1, '2023-09-27 10:00:00', NULL),
(111, 7, 1, 0, 2, 3, 1, 1, 1, '2023-09-29 14:00:00', 'Looking forward to the weekend.'),
(112, 8, 2, 0, 1, 2, 1, 1, 1, '2023-10-01 09:00:00', 'Enjoyed a sunny morning walk.'),
(113, 7, 2, 0, 2, 3, 1, 1, 1, '2023-10-03 11:00:00', NULL),
(114, 9, 2, 0, 1, 2, 1, 1, 1, '2023-10-05 13:00:00', 'Celebrated a friend\'s achievement.'),
(115, 8, 2, 0, 1, 2, 1, 1, 1, '2023-10-07 15:00:00', NULL),
(116, 8, 2, 0, 1, 2, 1, 1, 1, '2023-10-09 17:00:00', 'Enjoyed a relaxing day at home.'),
(117, 7, 2, 0, 2, 3, 1, 1, 1, '2023-10-11 19:00:00', NULL),
(118, 9, 2, 0, 1, 2, 1, 1, 1, '2023-10-13 21:00:00', 'Received good news about a project.'),
(119, 8, 2, 0, 1, 2, 1, 1, 1, '2023-10-15 10:00:00', NULL),
(120, 8, 2, 0, 1, 2, 1, 1, 1, '2023-10-17 12:00:00', 'Spent time with family and friends.'),
(121, 7, 2, 0, 2, 3, 1, 1, 1, '2023-10-19 14:00:00', NULL),
(122, 9, 2, 0, 1, 2, 1, 1, 1, '2023-10-21 16:00:00', 'Enjoyed a delicious meal with loved ones.'),
(123, 8, 2, 0, 1, 2, 1, 1, 1, '2023-10-23 18:00:00', NULL),
(124, 8, 2, 0, 1, 2, 1, 1, 1, '2023-10-25 20:00:00', 'Had a productive day at work.'),
(125, 7, 2, 0, 2, 3, 1, 1, 1, '2023-10-27 09:00:00', NULL),
(126, 9, 2, 0, 1, 2, 1, 1, 1, '2023-10-29 11:00:00', 'Went on a weekend getaway.'),
(127, 8, 2, 0, 1, 2, 1, 1, 1, '2023-10-31 13:00:00', NULL),
(128, 6, 1, 0, 4, 3, 1, 1, 1, '2023-11-01 10:00:00', 'Feeling down due to the gloomy weather and lack of daylight.'),
(129, 7, 1, 0, 2, 4, 1, 1, 1, '2023-11-03 12:00:00', NULL),
(130, 5, 1, 0, 6, 3, 1, 1, 1, '2023-11-05 14:00:00', NULL),
(131, 6, 1, 0, 5, 2, 1, 1, 1, '2023-11-07 16:00:00', 'Struggling to cope with the dreary weather.'),
(132, 7, 1, 0, 4, 4, 1, 1, 1, '2023-11-09 18:00:00', NULL),
(133, 6, 1, 0, 6, 3, 1, 1, 1, '2023-11-11 20:00:00', NULL),
(134, 5, 1, 0, 7, 2, 1, 1, 1, '2023-11-13 09:00:00', 'Feeling overwhelmed with financial stress.'),
(135, 6, 1, 0, 5, 3, 1, 1, 1, '2023-11-15 11:00:00', NULL),
(136, 7, 1, 0, 4, 4, 1, 1, 1, '2023-11-17 13:00:00', NULL),
(137, 6, 1, 0, 6, 2, 1, 1, 1, '2023-11-19 15:00:00', 'Hoping for brighter days ahead.'),
(138, 5, 1, 0, 7, 3, 1, 1, 1, '2023-11-21 17:00:00', NULL),
(139, 6, 1, 0, 5, 4, 1, 1, 1, '2023-11-23 19:00:00', NULL),
(140, 7, 1, 0, 4, 3, 1, 1, 1, '2023-11-25 08:00:00', NULL),
(141, 6, 1, 0, 6, 4, 1, 1, 1, '2023-11-27 10:00:00', 'Struggling with the shorter days and lack of sunlight.'),
(142, 5, 1, 0, 7, 2, 1, 1, 1, '2023-11-29 12:00:00', NULL),
(143, 6, 1, 0, 5, 3, 1, 1, 1, '0000-00-00 00:00:00', 'Feeling stressed about holiday expenses.'),
(144, 6, 1, 0, 4, 3, 1, 1, 1, '2023-12-01 10:00:00', 'Missing the daylight during these short days.'),
(145, 7, 1, 0, 2, 4, 1, 1, 1, '2023-12-03 12:00:00', NULL),
(146, 5, 1, 0, 6, 3, 1, 1, 1, '2023-12-05 14:00:00', NULL),
(147, 6, 1, 0, 5, 2, 1, 1, 1, '2023-12-07 16:00:00', 'Struggling with the darkness and cold weather.'),
(148, 7, 1, 0, 4, 4, 1, 1, 1, '2023-12-09 18:00:00', NULL),
(149, 6, 1, 0, 6, 3, 1, 1, 1, '2023-12-11 20:00:00', NULL),
(150, 5, 1, 0, 7, 2, 1, 1, 1, '2023-12-13 09:00:00', 'Feeling overwhelmed with holiday preparations.'),
(151, 6, 1, 0, 5, 3, 1, 1, 1, '2023-12-15 11:00:00', NULL),
(152, 7, 1, 0, 4, 4, 1, 1, 1, '2023-12-17 13:00:00', NULL),
(153, 6, 1, 0, 6, 2, 1, 1, 1, '2023-12-19 15:00:00', 'Looking forward to the upcoming holidays.'),
(154, 7, 1, 0, 4, 3, 1, 1, 1, '2023-12-21 17:00:00', NULL),
(155, 8, 3, 0, 2, 2, 1, 1, 1, '2023-12-23 19:00:00', 'Enjoying quality time with family and friends.'),
(156, 8, 3, 0, 2, 2, 1, 1, 1, '2023-12-25 08:00:00', 'Feeling joyful during the festive season.'),
(157, 8, 3, 0, 2, 2, 1, 1, 1, '2023-12-27 10:00:00', NULL),
(158, 7, 1, 0, 4, 3, 1, 1, 1, '2023-12-29 12:00:00', 'Thinking about setting health goals for the new year.'),
(159, 7, 1, 0, 4, 3, 1, 1, 1, '2023-12-31 14:00:00', NULL),
(160, 6, 1, 0, 4, 3, 1, 1, 1, '2024-01-01 10:00:00', 'Feeling motivated to start the new year with a trip to the gym.'),
(161, 7, 2, 0, 2, 4, 1, 1, 1, '2024-01-03 12:00:00', NULL),
(162, 5, 1, 0, 6, 3, 1, 1, 1, '2024-01-05 14:00:00', 'Missed going to the gym today, feeling disappointed.'),
(163, 6, 2, 0, 5, 2, 1, 1, 1, '2024-01-07 16:00:00', 'Had a great workout session at the gym, feeling energized!'),
(164, 7, 2, 0, 4, 4, 1, 1, 1, '2024-01-09 18:00:00', NULL),
(165, 6, 1, 0, 6, 3, 1, 1, 1, '2024-01-11 20:00:00', 'Feeling sluggish after skipping the gym today.'),
(166, 5, 1, 0, 7, 2, 1, 1, 1, '2024-01-13 09:00:00', NULL),
(167, 6, 2, 0, 5, 3, 1, 1, 1, '2024-01-15 11:00:00', 'Gym session was tough but rewarding.'),
(168, 7, 1, 0, 4, 4, 1, 1, 1, '2024-01-17 13:00:00', NULL),
(169, 6, 1, 0, 6, 2, 1, 1, 1, '2024-01-19 15:00:00', 'Feeling determined to keep up with gym routine.'),
(170, 7, 2, 0, 4, 3, 1, 1, 1, '2024-01-21 17:00:00', NULL),
(171, 2, 3, 7, 9, 2, 8, 8, 1, '2024-01-23 19:00:00', 'Had a terrifying encounter with an aggressive driver while biking, feeling shaken and angry.'),
(172, 8, 3, 0, 2, 2, 1, 1, 1, '2024-01-25 08:00:00', 'Enjoyed a refreshing workout session at the gym.'),
(173, 8, 3, 0, 2, 2, 1, 1, 1, '2024-01-27 10:00:00', 'Feeling great after hitting the gym.'),
(174, 7, 1, 0, 4, 3, 1, 1, 1, '2024-01-29 12:00:00', NULL),
(175, 7, 1, 0, 4, 3, 1, 1, 1, '2024-01-31 14:00:00', 'Felt lazy today, missed my workout, feeling a bit down.'),
(176, 7, 2, 0, 2, 4, 1, 1, 1, '2024-02-01 10:00:00', NULL),
(177, 6, 1, 0, 4, 3, 1, 1, 1, '2024-02-03 12:00:00', 'Looking forward to Valentine\'s Day plans.'),
(178, 5, 1, 0, 6, 3, 1, 1, 1, '2024-02-05 14:00:00', 'Plans cancelled by friend, feeling disappointed.'),
(179, 6, 2, 0, 5, 2, 1, 1, 1, '2024-02-07 16:00:00', 'Enjoyed a romantic evening on Valentine\'s Day.'),
(180, 7, 2, 0, 4, 4, 1, 1, 1, '2024-02-09 18:00:00', NULL),
(181, 6, 1, 0, 6, 3, 1, 1, 1, '2024-02-11 20:00:00', 'Disagreement with friend about cancelled plans.'),
(182, 5, 1, 0, 7, 2, 1, 1, 1, '2024-02-13 09:00:00', NULL),
(183, 6, 2, 0, 5, 3, 1, 1, 1, '2024-02-15 11:00:00', 'Feeling grateful for the love and support in my life.'),
(184, 7, 1, 0, 4, 4, 1, 1, 1, '2024-02-17 13:00:00', NULL),
(185, 6, 1, 0, 6, 2, 1, 1, 1, '2024-02-19 15:00:00', 'Had a heart-to-heart conversation with a friend.'),
(186, 7, 2, 0, 4, 3, 1, 1, 1, '2024-02-21 17:00:00', NULL),
(187, 6, 1, 0, 6, 4, 1, 1, 1, '2024-02-23 19:00:00', 'Feeling upset after an argument with a loved one.'),
(188, 7, 1, 0, 4, 3, 1, 1, 1, '2024-02-25 08:00:00', 'Spent quality time with friends, feeling happy.'),
(189, 8, 3, 0, 2, 2, 1, 1, 1, '2024-02-27 10:00:00', 'Enjoyed a relaxing weekend getaway.'),
(190, 7, 1, 0, 4, 3, 1, 1, 1, '2024-02-29 12:00:00', NULL),
(191, 4, 1, 0, 3, 4, 2, 1, 1, '2024-03-01 10:00:00', 'Feeling stressed about the university project.'),
(192, 4, 2, 0, 4, 5, 3, 1, 1, '2024-03-02 12:00:00', 'Struggling to meet project deadlines.'),
(193, 3, 2, 0, 5, 6, 4, 1, 1, '2024-03-03 14:00:00', 'Feeling anxious about project progress.'),
(194, 3, 3, 0, 6, 7, 5, 1, 1, '2024-03-04 16:00:00', 'Experiencing high stress levels.'),
(195, 2, 3, 0, 7, 8, 6, 1, 1, '2024-03-05 18:00:00', 'Struggling to manage project workload.'),
(196, 2, 4, 0, 7, 8, 6, 1, 1, '2024-03-06 20:00:00', 'Feeling overwhelmed with project demands.'),
(197, 2, 4, 0, 7, 8, 6, 1, 1, '2024-03-07 22:00:00', 'Finding it challenging to stay positive.'),
(198, 2, 5, 0, 6, 7, 5, 1, 1, '2024-03-08 09:00:00', 'Struggling to balance project and personal life.'),
(199, 2, 5, 0, 6, 7, 5, 1, 1, '2024-03-09 11:00:00', 'Feeling drained from project stress.'),
(200, 3, 4, 0, 5, 6, 4, 1, 1, '2024-03-10 13:00:00', 'Trying to stay focused despite project challenges.'),
(201, 3, 3, 0, 5, 6, 4, 1, 1, '2024-03-11 15:00:00', 'Feeling demotivated but pushing through.'),
(202, 3, 2, 0, 4, 5, 3, 1, 1, '2024-03-12 17:00:00', 'Finding it hard to maintain project momentum.'),
(203, 4, 2, 0, 3, 4, 2, 1, 1, '2024-03-13 19:00:00', 'Struggling with project workload.'),
(204, 4, 1, 0, 3, 4, 2, 1, 1, '2024-03-14 21:00:00', 'Relieved to have completed the project.'),
(205, 6, 1, 0, 4, 3, 1, 1, 1, '2024-03-15 08:00:00', 'Enjoying a break after completing the project.');

-- Trigger table
CREATE TABLE `trigger` (
    trigger_ID INT AUTO_INCREMENT PRIMARY KEY,
    trigger_name VARCHAR(255)
);
INSERT INTO `trigger` (trigger_name) VALUES
('Work'),
('Commute'),
('Traffic'),
('Friends'),
('Family'),
('Health'),
('Sleep'),
('Weather'),
('Finances'),
('Social interactions'),
('Relationships'),
('Exercise'),
('Nutrition'),
('Hobbies'),
('Time management'),
('Productivity'),
('Self-care'),
('Environment'),
('Daily routine'),
('Home maintenance');

-- Snapshot_trigger table
CREATE TABLE snapshot_trigger (
    snapshot_trigger_ID INT AUTO_INCREMENT PRIMARY KEY ,
    snapshot_ID INT,
    trigger_ID INT,
    FOREIGN KEY (snapshot_ID) REFERENCES snapshot(snapshot_ID),
    FOREIGN KEY (trigger_ID) REFERENCES `trigger`(trigger_ID)
);
INSERT INTO `snapshot_trigger` (snapshot_id, trigger_id) VALUES
(82, 4),  (82, 6), (82, 9), (82, 10), (82, 11),  
(82, 14), (82, 15),  (82, 17), (82, 18),(82, 19), 
(87, 4),  (87, 6),  (87, 8), (87, 9),    (87, 13),
(87, 14), (87, 16), (87, 17), (87, 20), (92, 4), (92, 6), 
 (92, 10), (92, 12),  (92, 15), (92, 16), 
 (92, 20), (97, 1), (97, 4), (97, 5), 
(97, 9),  (97, 11),  (97, 13),  (97, 15), (97, 16), 
(97, 19), (97, 20), (102, 1), (102, 4), (102, 5),  (102, 7),
(102, 9),  (102, 17), (102, 18), (107, 11), (107, 12), (107, 13),
(107, 14), (107, 19), (107, 20), (113, 1), 
(115, 1), (115, 4),  (115, 7),  (115, 13),
(115, 14), (115, 15), (115, 16), (115, 17), (115, 18), 
 (117, 4), (117, 5), (117, 6), 
 (117, 10), (117, 11), (117, 12), 
 (117, 15), (117, 16), (117, 17), 
(117, 19), (117, 20),
 (119, 4), (119, 5), 
(119, 9), (119, 10), (119, 12), (119, 13),
(119, 14), (119, 15), (119, 16), (119, 17), 
(119, 19), (119, 20),
(121, 1), (123, 4), (125, 5), (125, 6), (127, 7),
(157, 9), (157, 10), (121, 11), (127, 12), (125, 13),
(125, 14), (127, 15), (151, 16), (157, 17);
