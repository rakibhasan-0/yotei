--
-- INSERTS FOR PERMISSION
--
INSERT INTO permission (permission_name, permission_desc) VALUES ('admin', 'Admin permissions. Equal to having all permissions.');
-- INSERT INTO ...

--
-- INSERTS FOR ROLE_TO_PERMISSION
--
INSERT INTO role_to_permission (role_id, permission_id) VALUES (1, 1);