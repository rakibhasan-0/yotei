-- Author: Team Mango
-- Created: 2024-05-27
-- Inserts permissions into the database. The order they are inserted represents the number of the permisssion.
--
-- INSERTS FOR PERMISSION
--
INSERT INTO permission (permission_name, permission_desc) VALUES ('Admin-rättigheter: Ger alla rättigheter', 'Admin rättigheter. Detsamma som att ha alla rättigheter på sidan.');

-- Grupper (Plan) och Tillfällen (Session)
INSERT INTO permission (permission_name, permission_desc) VALUES ('Kan skapa/redigera/radera egna grupper och tillfällen', 'Tillåtelse att skapa, redigera och radera sina egna grupper och tillfällen till de grupperna.');
INSERT INTO permission (permission_name, permission_desc) VALUES ('Kan skapa/redigera/radera alla grupper och tillfällen', 'Tillåtelse att skapa grupper samt redigera och radera grupper och tillfällen som de kan nå.');

-- Pass (Workout)
INSERT INTO permission (permission_name, permission_desc) VALUES ('Kan skapa/redigera/radera egna pass', 'Tillåtelse att skapa, redigera och radera sina egna pass.');
INSERT INTO permission (permission_name, permission_desc) VALUES ('Kan skapa/redigera/radera alla pass', 'Tillåtelse att skapa pass samt redigera och radera pass som de kan nå.');

-- Tekniker (Techniques)
INSERT INTO permission (permission_name, permission_desc) VALUES ('Kan skapa/redigera/radera alla tekniker', 'Tillåtelse att skapa tekniker samt redigera och radera tekniker som de kan nå.');

-- Övningar (Exercises)
INSERT INTO permission (permission_name, permission_desc) VALUES ('Kan skapa/redigera/radera alla övningar', 'Tillåtelse att skapa övningar samt redigera och radera övningar som de kan nå.');

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

-- Editor role
INSERT INTO role_to_permission (role_id, permission_id) VALUES (2, 2);
INSERT INTO role_to_permission (role_id, permission_id) VALUES (2, 3);
INSERT INTO role_to_permission (role_id, permission_id) VALUES (2, 4);
INSERT INTO role_to_permission (role_id, permission_id) VALUES (2, 5);
INSERT INTO role_to_permission (role_id, permission_id) VALUES (2, 6);
INSERT INTO role_to_permission (role_id, permission_id) VALUES (2, 7);
INSERT INTO role_to_permission (role_id, permission_id) VALUES (2, 8);


-- User role
INSERT INTO role_to_permission (role_id, permission_id) VALUES (3, 2);
INSERT INTO role_to_permission (role_id, permission_id) VALUES (3, 4);
INSERT INTO role_to_permission (role_id, permission_id) VALUES (3, 6);
