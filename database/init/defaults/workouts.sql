--
-- INSERTS FOR WORKOUTS
--
INSERT INTO workout (workout_name, workout_desc, workout_duration, workout_created, workout_changed, workout_date, workout_hidden, workout_author) VALUES ('Basic Judo Throws', 'This Judo workout focuses on practicing basic throws such as the hip throw, shoulder throw, and foot sweep. It includes both solo and partner drills to improve technique and timing.', 90, '2023-04-29', '2023-05-02', '2023-04-30', False, 1);
INSERT INTO workout (workout_name, workout_desc, workout_duration, workout_created, workout_changed, workout_date, workout_hidden, workout_author) VALUES ('Judo Randori', 'In this Judo workout, you will participate in randori, which is a form of sparring. The focus is on applying techniques learned in class in a live situation. The workout includes both standing and ground techniques.', 76, '2023-04-30', '2023-05-02', '2023-05-01', False, 1);
INSERT INTO workout (workout_name, workout_desc, workout_duration, workout_created, workout_changed, workout_date, workout_hidden, workout_author) VALUES ('Judo Footwork Drills', 'This Judo workout focuses on footwork drills to improve balance and movement. The drills include various shuffles, steps, and pivots to help develop better footwork on the mat.', 45, '2023-05-01', '2023-05-03', '2023-05-02', False, 1);

--
-- INSERTS FOR WORKOUTS TAG
--

INSERT INTO workout_tag (work_id, tag_id) VALUES(1, 24);
INSERT INTO workout_tag (work_id, tag_id) VALUES(1, 25);
INSERT INTO workout_tag (work_id, tag_id) VALUES(2, 24);
INSERT INTO workout_tag (work_id, tag_id) VALUES(3, 24);
INSERT INTO workout_tag (work_id, tag_id) VALUES(3, 26);

--
-- INSERTS FOR WORKOUT FAVOURITES
--

INSERT INTO workout_favorite (workout_id, user_id) VALUES (1, 1);
INSERT INTO workout_favorite (workout_id, user_id) VALUES (3, 1);
