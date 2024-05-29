-- Author: Team Mango
-- Created: 2024-05-27
-- Inserts permissions into the database. The order they are inserted represents the number of the permisssion.
--
-- INSERTS FOR PERMISSION
--

-- Admin
INSERT INTO permission (permission_name, permission_desc) VALUES ('Adminrättigheter', 'Admin rättigheter. Detsamma som att ha alla rättigheter på sidan.');

-- Beta access
INSERT INTO permission (permission_name, permission_desc) VALUES ('Experimentella funktioner', 'Ger användaren tillgång till funktioner som inte är fullt implementerat i systemet.');

-- Grupper (Plan) och Tillfällen (Session)
INSERT INTO permission (permission_name, permission_desc) VALUES ('Hantera egna grupper och tillfällen', 'Tillåtelse att skapa, redigera och radera sina egna grupper och tillfällen till de grupperna.');
INSERT INTO permission (permission_name, permission_desc) VALUES ('Hantera alla grupper och tillfällen', 'Tillåtelse att skapa grupper samt redigera och radera grupper och tillfällen som de kan nå.');

-- Pass (Workout)
INSERT INTO permission (permission_name, permission_desc) VALUES ('Hantera egna pass', 'Tillåtelse att skapa, redigera och radera sina egna pass.');
INSERT INTO permission (permission_name, permission_desc) VALUES ('Hantera alla pass', 'Tillåtelse att skapa, redigera och radera pass som de kan nå.');

-- Tekniker (Techniques)
INSERT INTO permission (permission_name, permission_desc) VALUES ('Hantera alla tekniker', 'Tillåtelse att skapa, redigera och radera alla tekniker.');

-- Övningar (Exercises)
INSERT INTO permission (permission_name, permission_desc) VALUES ('Hantera alla övningar', 'Tillåtelse att skapa, redigera och radera alla övningar.');

-- Gradering (Grading)
INSERT INTO permission (permission_name, permission_desc) VALUES ('Kan skapa en gradering', 'Tillåtelse att skapa graderingar samt redigera och radera graderingar som de kan nå.');

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

-- Editor role
INSERT INTO role_to_permission (role_id, permission_id) VALUES (2, 3);
INSERT INTO role_to_permission (role_id, permission_id) VALUES (2, 4);
INSERT INTO role_to_permission (role_id, permission_id) VALUES (2, 5);
INSERT INTO role_to_permission (role_id, permission_id) VALUES (2, 6);
INSERT INTO role_to_permission (role_id, permission_id) VALUES (2, 7);
INSERT INTO role_to_permission (role_id, permission_id) VALUES (2, 8);
INSERT INTO role_to_permission (role_id, permission_id) VALUES (2, 9);


-- User role
INSERT INTO role_to_permission (role_id, permission_id) VALUES (3, 3);
INSERT INTO role_to_permission (role_id, permission_id) VALUES (3, 5);
INSERT INTO role_to_permission (role_id, permission_id) VALUES (3, 7);
