--
-- INSERTS FOR USERS
--
INSERT INTO user_table (username, password, user_role, role_id) VALUES ('admin', '1000:b7fdda8fd62b8bb1b602d39f3b4175ab:2793a42fdc4552496d82ad442794cd2aa246945a5958173104b44f194feddfe59e47871825b76240728125ab4b96cb8ad3ba54496762230990dbcef47d4b6461', admin_role_id(), 1);
INSERT INTO user_table (username, password, user_role, role_id) VALUES ('editor', '1000:07618b435e7f1c0f3b016556086a5596:826bfb6d55161e33390afdcd2398d46310ab1ac557a434092def2f7848aa89bcf55ff8d446eb21f43af218fd0efd4044c8d04c0a1e40d14e76fc5a89d22e8e77', editor_role_id(), 2);
INSERT INTO user_table (username, password, user_role, role_id) VALUES ('user', '1000:eb81d676da3acba366b5194e439702d5:9fa4d6394f05560dc9899db223701eae230c53a712bb3610d14983df25d8ec43910818bba1c359cdecd0434b9f0f5c3c14168861402970376251cd44401191cc', user_role_id(), 3);
-- INSERT INTO ...