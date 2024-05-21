--
-- INSERTS FOR PLANS
--
INSERT INTO plan (name, user_id) VALUES ('Grönt bälte träning', 1);
INSERT INTO plan (name, user_id) VALUES ('Orange och Gult bälte träning', 1);
INSERT INTO plan (name, user_id) VALUES ('Svart bälte träning', 1);
INSERT INTO plan (name, user_id) VALUES ('Gult bälte träning',  1);
INSERT INTO plan (name, user_id) VALUES ('Brunt bälte träning', 1);

--
-- INSERTS FOR PLANS TO BELT
--

INSERT INTO plan_to_belt (belt_id, plan_id) VALUES (9, 1);
INSERT INTO plan_to_belt (belt_id, plan_id) VALUES (6, 2);
INSERT INTO plan_to_belt (belt_id, plan_id) VALUES (3, 2);
INSERT INTO plan_to_belt (belt_id, plan_id) VALUES (14, 3);
INSERT INTO plan_to_belt (belt_id, plan_id) VALUES (3, 4);
INSERT INTO plan_to_belt (belt_id, plan_id) VALUES (13, 5);
