--
-- INSERTS FOR ACTIVITY LIST
--

INSERT INTO activity_list (author, name, description, private, created_date) VALUES (1, 'Viktors favoriter', 'Viktors favorittekniker och -övningar!', true, '2024-05-07');

INSERT INTO activity_list (author, name, description, private, created_date) VALUES (1, 'Olivers bästa', 'En samling rekommenderade övningar', false, '2024-05-01');

INSERT INTO activity_list_entry(list_id, exercise_id) VALUES (1, 1);
INSERT INTO activity_list_entry(list_id, exercise_id) VALUES (1, 2);
INSERT INTO activity_list_entry(list_id, technique_id) VALUES (1, 1);

INSERT INTO activity_list_entry(list_id, exercise_id) VALUES (2, 1);
INSERT INTO activity_list_entry(list_id, exercise_id) VALUES (2, 2);
INSERT INTO activity_list_entry(list_id, technique_id) VALUES (2, 1);

INSERT INTO user_to_activity_list(user_id, list_id) VALUES (1, 1);
INSERT INTO user_to_activity_list(user_id, list_id) VALUES (2, 1);
INSERT INTO user_to_activity_list(user_id, list_id) VALUES (2, 2);
