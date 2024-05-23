--
-- INSERTS FOR GRADING PROTOCOLS
--



--- 5 KYU GULT BÄLTE
INSERT INTO grading_protocol (belt_id, protocol_code, protocol_name) VALUES (3 , '5 KYU', 'GULT BÄLTE');

--- Category: KIHON WAZA - ATEMI WAZA
INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (1, 'KIHON WAZA - ATEMI WAZA', 1);
-- Shotei uchi, jodan, rak stöt med främre och bakre handen
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (1, 1, 1);
-- Shotei uchi, chudan, rak stöt med främre och bakre handen
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (2, 1, 2);
-- Gedan geri, rak spark med främre och bakre benet
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (3, 1, 3);

--- Category: KIHON WAZA - KANSETSU WAZA
INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (1, 'KIHON WAZA - KANSETSU WAZA', 2);
-- O soto osae, utan grepp, nedläggning snett bakåt
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (4, 2, 1);

--- Category: KIHON WAZA - NAGE WAZA
INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (1, 'KIHON WAZA - NAGE WAZA', 3);
-- Koshi otoshi, utan grepp, nedläggning snett bakåt
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (5, 3, 1);

--- Category: JIGO WAZA
INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (1, 'JIGO WAZA', 4);
-- Grepp i två handleder framifrån Frigöring
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (6, 4, 1);
-- Grepp i två handleder bakifrån Frigöring
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (7, 4, 2);
-- Grepp i håret bakifrån Tettsui uchi, frigöring
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (8, 4, 3);
-- Försök till stryptag framifrån Jodan soto uke
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (9, 4, 4);
-- Stryptag framifrån Kawashi, frigöring
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (10, 4, 5);
-- Stryptag bakifrån Maesabaki, kawashi, frigöring
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (11, 4, 6);
-- Stryptag med armen Maesabaki, kuzure ude osae, ude henkan gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (12, 4, 7);
-- Försök till kravattgrepp från sidan Jodan chikai uke, kawashi, koshi otoshi, ude henkan gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (13, 4, 8);
-- Grepp i ärmen med drag O soto osae, ude henkan gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (14, 4, 9);
-- Livtag under armarna framifrån Tate hishigi, ude henkan gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (15, 4, 10);
-- Stryptag mot liggande sittande vid sidan Frigöring, ude henkan gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (16, 4, 11);
-- Hotfullt närmande mot liggande Uppgång bakåt
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (17, 4, 12);
-- Hotfullt närmande Hejda med tryck
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (18, 4, 13);
-- Kort svingslag Jodan chikai uke, kawashi, koshi otoshi, ude henkan gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (19, 4, 14);
-- Långt svingslag Morote jodan uke, o soto osae, ude henkan gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (20, 4, 15);
-- Påkslag mot huvudet Ju morote jodan uke
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (21, 4, 16);
-- Påkslag mot huvudet, backhand Ju morote jodan uke
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (22, 4, 17);
-- Knivhot mot magen Grepp, shotei uchi jodan
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (23, 4, 18);

--- Category: RENRAKU WAZA
INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (1, 'RENRAKU WAZA', 5);
-- Försök till stryptag framifrån - Försök till Jodan soto uke - Jodan chikai uke, kravattgrepp från sidan kawashi, koshi otoshi, ude henkan gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (24, 5, 1);

--- Category: YAKUSOKU GEIKO
INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (1, 'YAKUSOKU GEIKO', 5);
-- Försvar mot en motståndare (1)
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (25, 6, 1);

--- 4 KYU ORANGE BÄLTE
INSERT INTO grading_protocol (belt_id, protocol_code, protocol_name) VALUES (6 , '4 KYU', 'ORANGE BÄLTE');
--- Category: KIHON WAZA - ATEMI WAZA
INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (2, 'KIHON WAZA - ATEMI WAZA', 1);
-- Shotei uchi, jodan, rak stöt med främre och bakre handen
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (1, 7, 1);
-- Shotei uchi, chudan, rak stöt med främre och bakre handen
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (2, 7, 2);
-- Gedan geri, rak spark med främre och bakre benet
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (3, 7, 3);
-- Mawashi shotei uchi, jodan, cirkulär stöt med bakre handen
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (26, 7, 4);
-- Chudan tski, stöt snett uppåt med bakre handen
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (27, 7, 5);
-- Hiza geri, chudan, rak knästöt med bakre benet 
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (28, 7, 6);


--- Category: KIHON WAZA - KANSUTSU WAZA
INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (2, 'KIHON WAZA - KANSUTSU WAZA', 2);
-- O soto osae, utan grepp, nedläggning snett bakåt
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (4, 8, 1);
-- Kote gaeshi, grepp i handleden, nedläggning snett framåt
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (29, 8, 2);
-- Kote gaeshi, grepp i handleden, nedläggning snett bakåt
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (30, 8, 3);

--- Category: KIHON WAZA - NAGE WAZA
INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (2, 'KIHON WAZA - NAGE WAZA', 3);
-- Koshi otoshi, utan grepp, nedläggning snett bakåt
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (5, 9, 1);
--  Uki otoshi, i rörelse, nedläggning snett framåt 
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (31, 9, 2);

--- Category: JIGO WAZA
INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (2, 'JIGO WAZA', 4);
-- Grepp i en handled framifrån med Frigöring två händer med drag
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (32, 10, 1);
-- Grepp i två handleder bakifrån Kote gaeshi, ude hishigi hiza gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (33, 10, 2);
-- Grepp i håret framifrån Frigöring
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (34, 10, 3);
-- Försök till stryptag framifrån Uki otoshi, ude henkan gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (35, 10, 4);
-- Stryptag framifrån mot vägg Tsuri komi
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (36, 10, 5);
-- Kravattgrepp från sidan Ushiro osae, ude henkan gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (37, 10, 6);
-- Grepp om nacken och en knästöt Gedan juji uke, kawashi, frigöring
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (38, 10, 7);
-- Försök till grepp i kläderna Chudan soto uke, koshi otoshi,ude henkan gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (39, 10, 8);
-- Grepp i kläderna med tryck Kuzure ude garami, ushiro osae,ude henkan gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (40, 10, 9);
-- Stryptag mot liggande Frigöring, ude henkan gatame sittande mellan benen
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (41, 10, 10);
-- Långt svingslag Ju jodan uchi uke, uki otoshi, ude henkan gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (42, 10, 11);
-- Rak spark mot magen Gedan uchi uke, koshi otoshi, ude henkan gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (43, 10, 12);
-- Påkslag mot huvudet Ju jodan uchi uke, uki otoshi, ude hishigi hiza gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (44, 10, 13);
-- Påkslag mot huvudet, backhand Ju morote jodan uke, kote gaeshi,ude hishigi hiza gatame 
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (45, 10, 14);
-- Knivhot mot magen Grepp, shotei uchi jodan, kote gaeshi, ude hishigi hiza gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (46, 10, 15);

--- Category: RENRAKU WAZA
INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (2, 'RENRAKU WAZA', 5);
-- Grepp i två handleder framifrån - Frigöring - jodan chikai uke, kawashi, Kort svingslag koshi otoshi, ude henkan gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (47, 11, 1);
-- Hotfullt närmande - Långt svingslag Hejda med tryck - Morote jodan uke, o soto osae, ude henkan gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (48, 11, 2);

--- Category: YAKUSOKU GEIKO
INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (2, 'YAKUSOKU GEIKO', 6);
-- Försvar mot en motståndare (2)
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (49, 12, 1);


--- 3 KYU GRÖNT BÄLTE
INSERT INTO grading_protocol (belt_id, protocol_code, protocol_name) VALUES (9 , '3 KYU', 'GRÖNT BÄLTE');

--- Category: KIHON WAZA - ATEMI WAZA
INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (3, 'KIHON WAZA - ATEMI WAZA', 1);
-- Shotei uchi, jodan, rak stöt med främre och bakre handen
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (1, 13, 1);
-- Shotei uchi, chudan, rak stöt med främre och bakre handen
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (2, 13, 2);
-- Gedan geri, rak spark med främre och bakre benet
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (3, 13, 3);
-- Mawashi shotei uchi, jodan, cirkulär stöt med bakre handen
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (26, 13, 4);
-- Chudan tski, stöt snett uppåt med bakre handen
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (27, 13, 5);
-- Hiza geri, chudan, rak hnästöt med bakre benet
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (28, 13, 6);
-- Mawashi seiken tski, jodan, cirkulärt slag med främre och bakre handen
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (50, 13, 7);
-- Kin geri, gedan, spark snett uppåt med främre och bakre benet
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (51, 13, 8);
-- Mae geri, chudan, rak spark med främre och bakre benet
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (52, 13, 9);

--- Category: KIHON WAZA - KANSUTSU WAZA
INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (3, 'KIHON WAZA - KANSUTSU WAZA', 2);
-- O soto osae, utan grepp, nedläggning snett bakåt
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (4, 14, 1);
-- Kote gaeshi, grepp i handleden, nedläggning snett framåt
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (29, 14, 2);
-- Kote gaeshi, grepp i handleden, nedläggning snett bakåt
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (30, 14, 3);
-- Ude osae, grepp i kragen med tryck, nedläggning framåt
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (53, 14, 4);
-- Ude osae, i rörelse, cirkulär nedläggning
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (54, 14, 5);

--- Category: KIHON WAZA - NAGE WAZA
INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (3, 'KIHON WAZA - NAGE WAZA', 3);
-- Koshi otoshi, utan grepp, nedläggning snett bakåt
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (5, 15, 1);
-- Uki otoshi, i rörelse, nedläggning snett framåt
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (31, 15, 2);
-- O soto otoshi, grepp i kragen med drag, nedläggning snett bakåt
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (55, 15, 3);
-- O soto otoshi, utan grepp, nedläggning snett bakåt
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (56, 15, 4);

--- Category: JIGO WAZA
INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (3, 'JIGO WAZA', 4);
-- Grepp i två handleder framifrån Shiho nage, shiho nage gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (57, 16, 1);
-- Stryptag framifrån O soto otoshi, ude hishigi hiza gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (58, 16, 2);
-- Stryptag bakifrån med vänster arm Maesabaki, kuzure ude gatami, kote gaeshi, ude hishigi hiza gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (59, 16, 3);
-- Grepp i kläderna med tryck Ude osae, ude osae gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (60, 16, 4);
-- Grepp i kläderna med drag O soto otoshi, ude hishigi hiza gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (61, 16, 5);
-- Grepp om nacken och en knästöt Gedan juji uke, kawashi, koshi otoshi, ude henkan gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (62, 16, 6);
-- Livtag under armarna bakifrån Ude osae, ude osae gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (63, 16, 7);
-- Högt livtag över armarna bakifrån Maesabaki, kuzure ude osae, ude henkan gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (64, 16, 8);
-- Stryptag mot liggande Frigöring sittande mellan benen
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (65, 16, 9);
-- Svingslag mot liggande mot Jodan chikai uke, hiza kansetsu waza huvudet
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (66, 16, 10);
-- Rakt slag mot huvudet Jodan soto uke, o soto otoshi, ude hishigi hiza gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (67, 16, 11);
-- Cirkulär spark mot benen San ren uke, o soto osae, ude henkan gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (68, 16, 12);
-- Påkslag mot huvudet, backhand Ju morote jodan uke, ude osae, ude osae gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (69, 16, 13);
-- Knivhot mot halsen, vänster sida Grepp, kin geri
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (70, 16, 14);
-- Knivhot mot halsen, höger sida Grepp, kin geri 
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (71, 16, 15);

--- Category: RENRAKU WAZA
INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (3, 'RENRAKU WAZA', 5);
-- Grepp i två handleder bakifrån - Frigöring - Gedan uchi uke, koshi otoshi, Rak spark mot magen ude henkan gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (72, 17, 1);
-- Hotfullt närmande mot liggande - Uppgång bakåt - Ju jodan uchi uke, uki otoshi Långt svingslag ude henkan gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (73, 17, 2);

--- Category: YAKUSOKU GEIKO
INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (3, 'YAKUSOKU GEIKO', 6);
-- Försvar mot en motståndare (3)
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (74, 18, 1);

--- 2 KYU BLÅTT BÄLTE
INSERT INTO grading_protocol (belt_id, protocol_code, protocol_name) VALUES (12 , '2 KYU', 'BLÅTT BÄLTE');

--- Category: KIHON WAZA - ATEMI WAZA
INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (4, 'KIHON WAZA - ATEMI WAZA', 1);
-- Shotei uchi, jodan, rak stöt med främre och bakre handen
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (1, 19, 1);
-- Shotei uchi, chudan, rak stöt med främre och bakre handen
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (2, 19, 2);
-- Gedan geri, rak spark med främre och bakre benet
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (3, 19, 3);
-- Mawashi shotei uchi, jodan, cirkulär stöt med bakre handen
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (26, 19, 4);
-- Chudan tski, stöt snett uppåt med bakre handen
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (27, 19, 5);
-- Hiza geri, chudan, rak hnästöt med bakre benet
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (28, 19, 6);
-- Mawashi seiken tski, jodan, cirkulärt slag med främre och bakre handen
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (50, 19, 7);
-- Kin geri, gedan, spark snett uppåt med främre och bakre benet
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (51, 19, 8);
-- Mae geri, chudan, rak spark med främre och bakre benet
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (52, 19, 9);
-- Seiken tski, jodan, rakt slag med främre och bakre handen
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (75, 19, 10);
-- Seiken tski, chudan, rakt slag med främre och bakre handen
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (76, 19, 11);
-- Mawashi geri, gedan, cirkulär spark med främre och bakre benet
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (77, 19, 12);
-- Mawashi geri, chudan, cirkulär spark med främre och bakre benet
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (78, 19, 13);

--- Category: KIHON WAZA - KANSUTSU WAZA
INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (4, 'KIHON WAZA - KANSUTSU WAZA', 2);
-- O soto osae, utan grepp, nedläggning snett bakåt
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (4, 20, 1);
-- Kote gaeshi, grepp i handleden, nedläggning snett framåt
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (29, 20, 2);
-- Kote gaeshi, grepp i handleden, nedläggning snett bakåt
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (30, 20, 3);
-- Ude osae, grepp i kragen med tryck, nedläggning framåt
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (53, 20, 4);
-- Ude osae, i rörelse, cirkulär nedläggning
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (54, 20, 5);
-- Irimi nage, grepp i handleden, nedläggning snett bakåt
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (79, 20, 6);
-- Irimi nage, i rörelse, nedläggning snett framåt
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (80, 20, 7);

--- Category: KIHON WAZA - NAGE WAZA
INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (4, 'KIHON WAZA - NAGE WAZA', 3);
-- Koshi otoshi, utan grepp, nedläggning snett bakåt
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (5, 21, 1);
-- Uki otoshi, i rörelse, nedläggning snett framåt
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (31, 21, 2);
-- O soto otoshi, grepp i kragen med drag, nedläggning snett bakåt
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (55, 21, 3);
-- O soto otoshi, utan grepp, nedläggning snett bakåt
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (56, 21, 4);
-- O goshi, utan grepp, kast snett framåt
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (81, 21, 5);
-- Tai guruma, utan grepp, nedläggning snett framåt
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (82, 21, 6);

--- Category: JIGO WAZA
INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (4, 'JIGO WAZA', 4);
-- Stryptag från sidan med tryck Kote hineri, ude henkan gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (83, 22, 1);
-- Stryptag bakifrån O soto otoshi, ude hishigi hiza gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (84, 22, 2);
-- Grepp i kläderna mot vägg Tate hishigi, ude henkan gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (85, 22, 3);
-- Försök till livtag över armarna, Uki otoshi, ude henkan gatame framifrån
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (86, 22, 4);
-- Livtag över armarna framifrån O goshi, ude hishigi hiza gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (87, 22, 5);
-- Försök till grepp om båda benen, Tai guruma, ude henkan gatame framifrån
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (88, 22, 6);
-- Stryptag mot liggande med armen Frigöring, ude henkan gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (89, 22, 7);
-- Spark mot liggande mot huvudet San ren uke, hiza kansetsu waza
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (90, 22, 8);
-- Hotfullt uppträdande Ude hishigi
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (91, 22, 9);
-- Kort svingslag Jodan chikai uke, o soto otoshi, ude hishigi hiza gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (92, 22, 10);
-- Långt svingslag Morote jodan uke, hiza geri, tai guruma, ude henkan gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (93, 22, 11);
-- Svingslag, backhand Morote jodan uke, irimi nage, ude henkan gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (94, 22, 12);
-- Påkslag mot huvudet, backhand Ju jodan uchi uke, irimi nage, ude hishigi hiza gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (95, 22, 13);
-- Grepp och knivhot mot magen Grepp, kin geri, kote gaeshi, ude hishigi hiza gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (96, 22, 14);
-- Två motståndare, grepp i kläderna Ude osae
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (97, 22, 15);

--- Category: RENRAKU WAZA
INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (4, 'RENRAKU WAZA', 5);
-- Försök till grepp i kläderna - Chudan soto uke, Valfri jigo waza anpassad efter ukes koshi otoshi, ude henkan gatame agerande
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (98, 23, 1);
-- Grepp i kläderna med drag - O soto otoshi, Valfri jigo waza anpassad efter ukes ude hishigi hiza gatame agerande
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (99, 23, 2);
-- Cirkulär spark mot benen - San ren uke, Valfri jigo waza anpassad efter ukes o soto osae, ude henkan gatame agerande
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (100, 23, 3);

--- Category: RANDORI
INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (4, 'RANDORI', 6);
--  Försvar mot en motståndare (4)
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (101, 24, 1);

--- 1 KYU BRUNT BÄLTE
INSERT INTO grading_protocol (belt_id, protocol_code, protocol_name) VALUES (13 , '1 KYU', 'BRUNT BÄLTE');

--- Category: KIHON WAZA - ATEMI WAZA
INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (5, 'KIHON WAZA - ATEMI WAZA', 1);
-- Shotei uchi, jodan, rak stöt med främre och bakre handen
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (1, 25, 1);
-- Shotei uchi, chudan, rak stöt med främre och bakre handen
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (2, 25, 2);
-- Gedan geri, rak spark med främre och bakre benet
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (3, 25, 3);
-- Mawashi shotei uchi, jodan, cirkulär stöt med bakre handen
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (26, 25, 4);
-- Chudan tski, stöt snett uppåt med bakre handen
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (27, 25, 5);
-- Hiza geri, chudan, rak hnästöt med bakre benet
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (28, 25, 6);
-- Mawashi seiken tski, jodan, cirkulärt slag med främre och bakre handen
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (50, 25, 7);
-- Kin geri, gedan, spark snett uppåt med främre och bakre benet
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (51, 25, 8);
-- Mae geri, chudan, rak spark med främre och bakre benet
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (52, 25, 9);
-- Seiken tski, jodan, rakt slag med främre och bakre handen
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (75, 25, 10);
-- Seiken tski, chudan, rakt slag med främre och bakre handen
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (76, 25, 11);
-- Mawashi geri, gedan, cirkulär spark med främre och bakre benet
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (77, 25, 12);
-- Mawashi geri, chudan, cirkulär spark med främre och bakre benet
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (78, 25, 13);
-- Empi uchi, jodan, cirkulär stöt med främre och bakre armen
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (102, 25, 14);
-- Empi uchi, chudan, rak stöt åt sidan med närmaste armen
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (103, 25, 15);
-- Kakato geri, chudan, rak spark med bakre benet
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (104, 25, 16);
-- Yoko geri, chudan, rak spark åt sidan med närmaste benet
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (105, 25, 17);

--- Category: KIHON WAZA - KANSUTSU WAZA
INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (5, 'KIHON WAZA - KANSUTSU WAZA', 2);
-- O soto osae, utan grepp, nedläggning snett bakåt
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (4, 26, 1);
-- Kote gaeshi, grepp i handleden, nedläggning snett framåt
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (29, 26, 2);
-- Kote gaeshi, grepp i handleden, nedläggning snett bakåt
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (30, 26, 3);
-- Ude osae, grepp i kragen med tryck, nedläggning framåt
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (53, 26, 4);
-- Ude osae, i rörelse, cirkulär nedläggning
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (54, 26, 5);
-- Irimi nage, grepp i handleden, nedläggning snett bakåt
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (79, 26, 6);
-- Irimi nage, i rörelse, nedläggning snett framåt
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (80, 26, 7);
-- Waki gatame, grepp i handleden, nedläggning snett bakåt
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (106, 26, 8);
-- Kote mawashi, grepp i kragen med tryck, nedläggning snett framåt
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (107, 26, 9);

--- Category: KIHON WAZA - NAGE WAZA
INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (5, 'KIHON WAZA - NAGE WAZA', 3);
-- Koshi otoshi, utan grepp, nedläggning snett bakåt
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (5, 27, 1);
-- Uki otoshi, i rörelse, nedläggning snett framåt
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (31, 27, 2);
-- O soto otoshi, grepp i kragen med drag, nedläggning snett bakåt
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (55, 27, 3);
-- O soto otoshi, utan grepp, nedläggning snett bakåt
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (56, 27, 4);
-- O goshi, utan grepp, kast snett framåt
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (81, 27, 5);
-- Tai guruma, utan grepp, nedläggning snett framåt
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (82, 27, 6);
-- Harai goshi, utan grepp, kast snett framåt
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (108, 27, 7);
-- Harai goshi, i rörelse, kast snett framåt
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (109, 27, 8);
-- Sukui nage, utan grepp, kast snett framåt
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (110, 27, 9);
-- Ko uchi gari, utan grepp, kast snett bakåt
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (111, 27, 10);

--- Category: JIGO WAZA
INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (5, 'JIGO WAZA', 4);
-- Grepp i håret med 2 händer och knästöt Gedan juji uke, waki gatame, ude osae gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (112, 28, 1);
-- Stryptag från sidan Harai goshi, ude hishigi hiza gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (113, 28, 2);
-- Stryptag bakifrån Jodan chikai uke, sukui nage, ude hishigi hiza gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (114, 28, 3);
-- Stryptag med armen med drag O soto otoshi, ude hishigi hiza gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (115, 28, 4);
-- Kravattgrepp framifrån Chudan tski, kote hineri, ude henkan gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (116, 28, 5);
-- Kravattgrepp med nedbrytning i sidled Frigöring, ude henkan gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (117, 28, 6);
-- Grepp i kläderna med tryck Kote mawashi, ude osae gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (118, 28, 7);
-- Flera svingslag mot liggande sittande Jodan chikai uke, frigöring på magen
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (119, 28, 8);
-- Hotfullt närmande mot liggande Uppgång framåt, jodan chikai uke, hiza kansetsu waza
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (120, 28, 9);
-- Hotfullt uppträdande Hara osae, ude henkan gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (121, 28, 10);
-- Kort svingslag Jodan chikai uke, uki otoshi, ude henkan gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (122, 28, 11);
-- Kort svingslag Jodan chikai uke, ko uchi gari
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (123, 28, 12);
-- Rak spark mot magen Gedan uchi uke, irimi nage, ude henkan gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (124, 28, 13);
-- Påkslag mot huvudet forehand och backhand Tsuri ashi, ayumi ashi, ju jodan uchi uke, irimi nage, ude hishigi hiza gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (125, 28, 14);
-- Påkslag mot huvudet backhand och forehand Tsuri ashi, ayumi ashi, morote jodan uke, o soto osae, ude hishigi hiza gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (126, 28, 15);
-- Grepp och knivhot mot halsen, höger sida Grepp waki gatame, ude hiza osae gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (127, 28, 16);
-- Knivhot mot halsen bakifrån med höger arm Maesabaki, kuzure ude osae, ude hiza osae gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (128, 28, 17);
-- Knivhot mot halsen bakifrån med vänster arm Maesabaki, kuzure ude garami, kote gaeshi, ude hishigi hiza gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (129, 28, 18);
-- Två motståndare, svingslag och svingslag Morote jodan uke, hiza geri, tai guruma morote jodan uke, hiza geri, tai guruma 
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (130, 28, 19);

--- Category: RENRAKU WAZA
INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (5, 'RENRAKU WAZA', 5);
--Stryptag bakifrån - O soto otoshi, Valfri jigo waza anpassad efter ukes agerande ude hishigi hiza gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (131, 29, 1);
-- Grepp om nacken och en knästöt - Valfri jigo waza anpassad efter ukes agerande Gedan juji uke, frigöring
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (132, 29, 2);
-- Livtag över armarna framifrån - Valfri jigo waza anpassad efter ukes agerande O goshi, ude hishigi hiza gatame
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (133, 29, 3);

--- Category: RANDORI
INSERT INTO grading_protocol_category (protocol_id, category_name, category_order) VALUES (5, 'RANDORI', 6);
-- Försvar mot en motståndare (5)
INSERT INTO grading_protocol_technique (technique_id, protocol_category_id, technique_order) VALUES (134, 30, 1);