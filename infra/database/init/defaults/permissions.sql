-- Author: Team Mango
-- Created: 2024-05-23
-- Inserts permissions into the database. The order they are inserted represents the number of the permisssion.
--
-- INSERTS FOR PERMISSION
--

-- Admin
INSERT INTO permission (permission_name, permission_desc) VALUES ('Adminrättigheter', 'Admin rättigheter. Detsamma som att ha alla rättigheter på sidan.');

-- Beta access
INSERT INTO permission (permission_name, permission_desc) VALUES ('Beta tillgång', 'Ger användaren tillgång till funktioner som inte är fullt implementerat i systemet.')

-- Tillfällen (Session)
INSERT INTO permission (permission_name, permission_desc) VALUES ('Hantera tillfällen för egna grupper', 'Tillåtelse att skapa, redigera och radera tillfällen för sina egna grupper.');
INSERT INTO permission (permission_name, permission_desc) VALUES ('Hantera tillfällen för alla grupper', 'Tillåtelse att skapa, rediger och radera alla tillfällen, oberoende av grupp.');

-- Grupper (Plan)
INSERT INTO permission (permission_name, permission_desc) VALUES ('Hantera egna grupper', 'Tillåtelse att skapa, redigera och radera sina egna grupper.');
INSERT INTO permission (permission_name, permission_desc) VALUES ('Hantera alla grupper', 'Tillåtelse att skapa, redigera och radera alla grupper.');

-- Pass (Workout)
INSERT INTO permission (permission_name, permission_desc) VALUES ('Hantera egna pass', 'Tillåtelse att skapa, redigera och radera sina egna pass.');
INSERT INTO permission (permission_name, permission_desc) VALUES ('Hantera alla pass', 'Tillåtelse att skapa, redigera och radera pass som de kan nå.');

-- Tekniker och övningar (Activity)
INSERT INTO permission (permission_name, permission_desc) VALUES ('Hantera alla tekniker/övningar', 'Tillåtelse att skapa tekniker och övningar samt redigera och radera tekniker och övningar som de kan nå.');

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
INSERT INTO role_to_permission (role_id, permission_id) VALUES (2, 2);
INSERT INTO role_to_permission (role_id, permission_id) VALUES (2, 3);
INSERT INTO role_to_permission (role_id, permission_id) VALUES (2, 4);
INSERT INTO role_to_permission (role_id, permission_id) VALUES (2, 5);
INSERT INTO role_to_permission (role_id, permission_id) VALUES (2, 6);
INSERT INTO role_to_permission (role_id, permission_id) VALUES (2, 7);
INSERT INTO role_to_permission (role_id, permission_id) VALUES (2, 8);
INSERT INTO role_to_permission (role_id, permission_id) VALUES (2, 9);


-- User role
INSERT INTO role_to_permission (role_id, permission_id) VALUES (3, 2);
INSERT INTO role_to_permission (role_id, permission_id) VALUES (3, 4);
INSERT INTO role_to_permission (role_id, permission_id) VALUES (3, 6);
