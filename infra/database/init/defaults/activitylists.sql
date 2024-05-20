--
-- INSERTS FOR ACTIVITY LIST
--

INSERT INTO activity_list (author, name, description, private, created_date) VALUES (3, 'Viktors favoriter', 'Viktors favorittekniker och -övningar!', true, '2024-05-07');
INSERT INTO activity_list (author, name, description, private, created_date) VALUES (2, 'Editors privata', 'En samling rekommenderade övningar', true, '2024-05-01');
INSERT INTO activity_list (author, name, description, private, created_date) VALUES (2, 'Editors publika lista', 'En samling rekommenderade övningar', false, '2024-05-01');
INSERT INTO activity_list (author, name, description, private, created_date) VALUES (3, 'Viktors privata', 'En samling rekommenderade övningar', true, '2024-05-01');



INSERT INTO activity_list_entry(list_id, exercise_id) VALUES (1, 286);
INSERT INTO activity_list_entry(list_id, exercise_id) VALUES (1, 287);
INSERT INTO activity_list_entry(list_id, technique_id) VALUES (1, 1);

INSERT INTO activity_list_entry(list_id, exercise_id, duration) VALUES (2, 290, 10);
INSERT INTO activity_list_entry(list_id, exercise_id, duration) VALUES (2, 286, 20);
INSERT INTO activity_list_entry(list_id, technique_id, duration) VALUES (2, 2, 15);


INSERT INTO activity_list_entry(list_id, exercise_id, duration) VALUES (3, 302, 15);
INSERT INTO activity_list_entry(list_id, exercise_id, duration) VALUES (3, 301, 10);
INSERT INTO activity_list_entry(list_id, technique_id, duration) VALUES (3, 6, 5);

INSERT INTO activity_list_entry(list_id, exercise_id, duration) VALUES (4, 300, 20);
INSERT INTO activity_list_entry(list_id, technique_id, duration) VALUES (4, 5, 10);

INSERT INTO user_to_activity_list(user_id, list_id) VALUES (2, 1);
INSERT INTO user_to_activity_list(user_id, list_id) VALUES (1, 1);
INSERT INTO user_to_activity_list(user_id, list_id) VALUES (2, 3);
