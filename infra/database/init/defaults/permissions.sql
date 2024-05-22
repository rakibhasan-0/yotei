--
-- INSERTS FOR PERMISSION
--
INSERT INTO permission (permission_name, permission_desc) VALUES ('admin', 'Admin rättigheter. Detsamma som att ha alla rättigheter på sidan.');

-- Tillfällen (Session)
INSERT INTO permission (permission_name, permission_desc) VALUES ('session_own', 'Tillåtelse att skapa, redigera och radera sina egna tillfällen.');
INSERT INTO permission (permission_name, permission_desc) VALUES ('session_all', 'Tillåtelse att skapa tillfällen samt redigera och radera tillfällen som de kan nå.');

-- Grupper (Plan)
INSERT INTO permission (permission_name, permission_desc) VALUES ('plan_own', 'Tillåtelse att skapa, redigera och radera sina egna grupper.');
INSERT INTO permission (permission_name, permission_desc) VALUES ('plan_all', 'Tillåtelse att skapa grupper samt redigera och radera grupper som de kan nå.');

-- Pass (Workout)
INSERT INTO permission (permission_name, permission_desc) VALUES ('workout_own', 'Tillåtelse att skapa, redigera och radera sina egna pass.');
INSERT INTO permission (permission_name, permission_desc) VALUES ('workout_all', 'Tillåtelse att skapa pass samt redigera och radera pass som de kan nå.');

-- Tekniker och övningar (Techniques and exercises)
INSERT INTO permission (permission_name, permission_desc) VALUES ('technique_exercise_own', 'Tillåtelse att skapa, redigera och radera sina egna tekniker och övningar.');
INSERT INTO permission (permission_name, permission_desc) VALUES ('technique_exercise_all', 'Tillåtelse att skapa tekniker och övningar samt redigera och radera tekniker och övningar som de kan nå.');

-- Gradering (Grading)
INSERT INTO permission (permission_name, permission_desc) VALUES ('grading_own', 'Tillåtelse att skapa, redigera och radera sina egna graderingar.');
INSERT INTO permission (permission_name, permission_desc) VALUES ('grading_all', 'Tillåtelse att skapa graderingar samt redigera och radera graderingar som de kan nå.');

-- INSERT INTO ...

--
-- INSERTS FOR ROLE_TO_PERMISSION
--

-- Admin role - Has all permissions
INSERT INTO role_to_permission (role_id, permission_id) VALUES (1, 1);
INSERT INTO role_to_permission (role_id, permission_id) VALUES (1, 2);
INSERT INTO role_to_permission (role_id, permission_id) VALUES (1, 3);
INSERT INTO role_to_permission (role_id, permission_id) VALUES (1, 4);
INSERT INTO role_to_permission (role_id, permission_id) VALUES (1, 5);
INSERT INTO role_to_permission (role_id, permission_id) VALUES (1, 6);
INSERT INTO role_to_permission (role_id, permission_id) VALUES (1, 7);
INSERT INTO role_to_permission (role_id, permission_id) VALUES (1, 8);
INSERT INTO role_to_permission (role_id, permission_id) VALUES (1, 9);
INSERT INTO role_to_permission (role_id, permission_id) VALUES (1, 10);
INSERT INTO role_to_permission (role_id, permission_id) VALUES (1, 11);

-- Editor role
INSERT INTO role_to_permission (role_id, permission_id) VALUES (2, 4);
INSERT INTO role_to_permission (role_id, permission_id) VALUES (2, 6);
INSERT INTO role_to_permission (role_id, permission_id) VALUES (2, 8);
INSERT INTO role_to_permission (role_id, permission_id) VALUES (2, 10);


-- User role
INSERT INTO role_to_permission (role_id, permission_id) VALUES (3, 4);
INSERT INTO role_to_permission (role_id, permission_id) VALUES (3, 6);
INSERT INTO role_to_permission (role_id, permission_id) VALUES (3, 10);
