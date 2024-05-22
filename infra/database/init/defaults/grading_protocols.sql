--
-- INSERTS FOR GRADING PROTOCOLS
--



--- 5 KYU GULT BÄLTE
INSERT INTO grading_protocol (belt_id, protocol_code, protocol_name) VALUES (3 , '5 KYU', 'GULT BÄLTE');
INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (1, 'KIHON WAZA - ATEMI WAZA', 1);
--- ADD TECHNIQUES TO CATEGORY HERE

---- MOCK DATA ---
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (1, 1, 1);
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (2, 1, 2);
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (3, 1, 3);
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (4, 1, 4);



INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (1, 'KIHON WAZA - KANSETSU WAZA', 2);

---- MOCK DATA ---
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (5, 2, 1);
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (6, 2, 2);
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (7, 2, 3);
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (8, 2, 4);


INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (1, 'KIHON WAZA - NAGE WAZA', 3);

---- MOCK DATA ---
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (9, 3, 1);
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (10, 3, 2);
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (11, 3, 3);
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (12, 3, 4);

INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (1, 'RENRAKU WAZA', 4);

---- MOCK DATA ---
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (13, 4, 1);
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (14, 4, 2);
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (15, 4, 3);
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (16, 4, 4);

INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (1, 'YAKUSOKU GEIKO', 5);

---- MOCK DATA ---
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (17, 5, 1);
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (18, 5, 2);
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (19, 5, 3);
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (20, 5, 4);


--- 4 KYU ORANGE BÄLTE
INSERT INTO grading_protocol (belt_id, protocol_code, protocol_name) VALUES (6 , '4 KYU', 'ORANGE BÄLTE');
INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (2, 'KIHON WAZA - ATEMI WAZA', 1);
INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (2, 'KIHON WAZA - KANSUTSU WAZA', 2);
INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (2, 'KIHON WAZA - NAGE WAZA', 3);
INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (2, 'RENRAKU WAZA', 4);
INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (2, 'YAKUSOKU GEIKO', 5);


--- 3 KYU GRÖNT BÄLTE
INSERT INTO grading_protocol (belt_id, protocol_code, protocol_name) VALUES (9 , '3 KYU', 'GRÖNT BÄLTE');
INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (3, 'KIHON WAZA - ATEMI WAZA', 1);
INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (3, 'KIHON WAZA - KANSUTSU WAZA', 2);
INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (3, 'KIHON WAZA - NAGE WAZA', 3);
INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (3, 'RENRAKU WAZA', 4);
INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (3, 'YAKUSOKU GEIKO', 5);

--- 2 KYU BLÅTT BÄLTE
INSERT INTO grading_protocol (belt_id, protocol_code, protocol_name) VALUES (12 , '2 KYU', 'BLÅTT BÄLTE');
INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (4, 'KIHON WAZA - ATEMI WAZA', 1);
INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (4, 'KIHON WAZA - KANSUTSU WAZA', 2);
INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (4, 'KIHON WAZA - NAGE WAZA', 3);
INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (4, 'RENRAKU WAZA', 4);
INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (4, 'RANDORI', 5);

--- 1 KYU BRUNT BÄLTE
INSERT INTO grading_protocol (belt_id, protocol_code, protocol_name) VALUES (13 , '1 KYU', 'BRUNT BÄLTE');
INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (5, 'KIHON WAZA - ATEMI WAZA', 1);
INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (5, 'KIHON WAZA - KANSUTSU WAZA', 2);
INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (5, 'KIHON WAZA - NAGE WAZA', 3);
INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (5, 'RENRAKU WAZA', 4);
INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (5, 'RANDORI', 5);