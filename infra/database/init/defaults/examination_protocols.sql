INSERT INTO examination_protocol (belt_id, examination_protocol) VALUES (3, 
'{
    "examination_protocol": {"code": "5 KYU", "color": "GULT BÄLTE"},
    "categories": [
        {
            "category_name": "KIHON WAZA - ATEMI WAZA",
            "techniques": [
                { "text": "1. Shotei uchi, jodan, rak stöt med främre och bakre handen" },
                { "text": "2. Shotei uchi, chudan, rak stöt med främre och bakre handen" },
                { "text": "3. Gedan geri, rak spark med främre och bakre benet" }
            ]
        },
        {
            "category_name": "KIHON WAZA - KANSUTSU WAZA",
            "techniques": [
                { "text": "1. O soto osae, utan grepp, nedläggning snett bakåt" }
            ]
        },
        {
            "category_name": "KIHON WAZA - NAGE WAZA",
            "techniques": [
                { "text": "1. Koshi otoshi, utan grepp, nedläggning snett bakåt" }
            ]
        },
        {
            "category_name": "JIGO WAZA",
            "techniques": [
                { "text": "1. Grepp i två handleder framifrån \tFrigöring" },
                { "text": "2. Grepp i två handleder bakifrån \tFrigöring" },
                { "text": "3. Grepp i håret bakifrån \tTettsui uchi, frigöring" },
                { "text": "4. Försök till stryptag framifrån \tJodan soto uke" },
                { "text": "5. Stryptag framifrån \tKawashi, frigöring" },
                { "text": "6. Stryptag bakifrån \tMaesabaki, kawashi, frigöring" },
                { "text": "7. Stryptag med armen \tMaesabaki, kuzure ude osae, ude henkan gatame" },
                { "text": "8. Försök till kravattgrepp från sidan \tJodan chikai uke, kawashi, koshi otoshi, ude henkan gatame" },
                { "text": "9. Grepp i ärmen med drag \tO soto osae, ude henkan gatame" },
                { "text": "10. Livtag under armarna framifrån \tTate hishigi, ude henkan gatame" },
                { "text": "11. Stryptag mot liggande sittande vid sidan \tFrigöring, ude henkan gatame" },
                { "text": "12. Hotfullt närmande mot liggande \tUppgång bakåt" },
                { "text": "13. Hotfullt närmande \tHejda med tryck" },
                { "text": "14. Kort svingslag \tJodan chikai uke, kawashi, koshi otoshi, ude henkan gatame" },
                { "text": "15. Långt svingslag \tMorote jodan uke, o soto osae, ude henkan gatame" },
                { "text": "16. Påkslag mot huvudet \tJu morote jodan uke" },
                { "text": "17. Påkslag mot huvudet, backhand \tJu morote jodan uke" },
                { "text": "18. Knivhot mot magen \tGrepp, shotei uchi jodan" }
            ]
        },
        {
            "category_name": "RENRAKU WAZA",
            "techniques": [
                { "text": "1. Försök till stryptag framifrån - Försök till kravattgrepp från sidan \tJodan soto uke - Jodan chikai uke, kawashi, koshi otoshi, ude henkan gatame" }
            ]
        },
        {
            "category_name": "YAKUSOKU GEIKO OR RANDORI",
            "techniques": [
                { "text": "1. Försvar mot en motståndare" }
            ]
        }
    ]
}'::JSON);
<<<<<<< HEAD:infra/database/init/defaults/grading_protocols.sql
INSERT INTO grading_protocol (belt_id, grading_protocol) VALUES (6, 
=======
INSERT INTO examination_protocol (belt_id, examination_protocol) VALUES (5, 
>>>>>>> main:infra/database/init/defaults/examination_protocols.sql
'{
    "examination_protocol": {"code": "4 KYU", "color": "ORANGE BÄLTE"},
    "categories": [
        {
            "category_name": "KIHON WAZA - ATEMI WAZA",
            "techniques": [
                { "text": "1. Shotei uchi, jodan, rak stöt med främre och bakre handen" },
                { "text": "2. Shotei uchi, chudan, rak stöt med främre och bakre handen" },
                { "text": "3. Gedan geri, rak spark med främre och bakre benet" },
                { "text": "4. Mawashi shotei uchi, jodan, cirkulär stöt med bakre handen" },
                { "text": "5. Chudan tski, stöt snett uppåt med bakre handen" },
                { "text": "6. Hiza geri, chudan, rak knästöt med bakre benet" }
            ]
        },
        {
            "category_name": "KIHON WAZA - KANSUTSU WAZA",
            "techniques": [
                { "text": "1. O soto osae, utan grepp, nedläggning snett bakåt" },
                { "text": "2. Kote gaeshi, grepp i handleden, nedläggning snett framåt" },
                { "text": "3. Kote gaeshi, grepp i handleden, nedläggning snett bakåt" }
            ]
        },
        {
            "category_name": "KIHON WAZA - NAGE WAZA",
            "techniques": [
                { "text": "1. Koshi otoshi, utan grepp, nedläggning snett bakåt" },
                { "text": "2. Uki otoshi, i rörelse, nedläggning snett framåt" }
            ]
        },
        {
            "category_name": "JIGO WAZA",
            "techniques": [
                { "text": "1. Grepp i en handled framifrån med två händer med drag \tFrigöring" },
                { "text": "2. Grepp i två handleder bakifrån \tKote gaeshi, ude hishigi hiza gatame" },
                { "text": "3. Grepp i håret framifrån \tFrigöring" },
                { "text": "4. Försök till stryptag framifrån \tUki otoshi, ude henkan gatame" },
                { "text": "5. Stryptag framifrån mot vägg \tTsuri komi" },
                { "text": "6. Kravattgrepp från sidan \tUshiro osae, ude henkan gatame" },
                { "text": "7. Grepp om nacken och en knästöt \tGedan juji uke, kawashi, frigöring" },
                { "text": "8. Försök till grepp i kläderna \tChudan soto uke, koshi otoshi, ude henkan gatame" },
                { "text": "9. Grepp i kläderna med tryck \tKuzure ude garami, ushiro osae, ude henkan gatame" },
                { "text": "10. Stryptag mot liggande sittande mellan benen \tFrigöring, ude henkan gatame" },
                { "text": "11. Långt svingslag \tJu jodan uchi uke, uki otoshi, ude henkan gatame" },
                { "text": "12. Rak spark mot magen \tGedan uchi uke, koshi otoshi, ude henkan gatame" },
                { "text": "13. Påkslag mot huvudet \tJu jodan uchi uke, uki otoshi, ude hishigi hiza gatame" },
                { "text": "14. Påkslag mot huvudet, backhand \tJu morote jodan uke, kote gaeshi, ude hishigi hiza gatame" },
                { "text": "15. Knivhot mot magen \tGrepp, shotei uchi jodan, kote gaeshi, ude hishigi hiza gatame" }
            ]
        },
        {
            "category_name": "RENRAKU WAZA",
            "techniques": [
                { "text": "1. Grepp i två handleder framifrån - Kort svingslag \tFrigöring - jodan chikai uke, kawashi, koshi otoshi, ude henkan gatame" },
                { "text": "2. Hotfullt närmande - Långt svingslag \tHejda med tryck - Morote jodan uke, o soto osae, ude henkan gatame" }
            ]
        },
        {
            "category_name": "YAKUSOKU GEIKO OR RANDORI",
            "techniques": [
                { "text": "1. Försvar mot en motståndare" }
            ]
        }
    ]
}'::JSON);
<<<<<<< HEAD:infra/database/init/defaults/grading_protocols.sql
INSERT INTO grading_protocol (belt_id, grading_protocol) VALUES (9, 
=======
INSERT INTO examination_protocol (belt_id, examination_protocol) VALUES (7, 
>>>>>>> main:infra/database/init/defaults/examination_protocols.sql
'{
    "examination_protocol": {"code": "3 KYU", "color": "GRÖNT BÄLTE"},
    "categories": [
        {
            "category_name": "KIHON WAZA - ATEMI WAZA",
            "techniques": [
                { "text": "1. Shotei uchi, jodan, rak stöt med främre och bakre handen" },
                { "text": "2. Shotei uchi, chudan, rak stöt med främre och bakre handen" },
                { "text": "3. Gedan geri, rak spark med främre och bakre benet" },
                { "text": "4. Mawashi shotei uchi, jodan, cirkulär stöt med bakre handen" },
                { "text": "5. Chudan tski, stöt snett uppåt med bakre handen" },
                { "text": "6. Hiza geri, chudan, rak knästöt med bakre benet" },
                { "text": "7. Mawashi seiken tski, jodan, cirkulärt slag med främre och bakre handen" },
                { "text": "8. Kin geri, gedan, spark snett uppåt med främre och bakre benet" },
                { "text": "9. Mae geri, chudan, rak spark med främre och bakre benet" }
            ]
        },
        {
            "category_name": "KIHON WAZA - KANSUTSU WAZA",
            "techniques": [
                { "text": "1. O soto osae, utan grepp, nedläggning snett bakåt" },
                { "text": "2. Kote gaeshi, grepp i handleden, nedläggning snett framåt" },
                { "text": "3. Kote gaeshi, grepp i handleden, nedläggning snett bakåt" },
                { "text": "4. Ude osae, grepp i kragen med tryck, nedläggning framåt" },
                { "text": "5. Ude osae, i rörelse, cirkulär nedläggning" }
            ]
        },
        {
            "category_name": "KIHON WAZA - NAGE WAZA",
            "techniques": [
                { "text": "1. Koshi otoshi, utan grepp, nedläggning snett bakåt" },
                { "text": "2. Uki otoshi, i rörelse, nedläggning snett framåt" },
                { "text": "3. O soto otoshi, grepp i kragen med drag, nedläggning snett bakåt" },
                { "text": "4. O soto otoshi, utan grepp, nedläggning snett bakåt" }
            ]
        },
        {
            "category_name": "JIGO WAZA",
            "techniques": [
                { "text": "1. Grepp i två handleder framifrån \tShiho nage, shiho nage gatame" },
                { "text": "2. Stryptag framifrån \tO soto otoshi, ude hishigi hiza gatame" },
                { "text": "3. Stryptag bakifrån med vänster arm \tMaesabaki, kuzure ude gatami, kote gaeshi, ude hishigi hiza gatame" },
                { "text": "4. Grepp i kläderna med tryck \tUde osae, ude osae gatame" },
                { "text": "5. Grepp i kläderna med drag \tO soto otoshi, ude hishigi hiza gatame" },
                { "text": "6. Grepp om nacken och en knästöt \tGedan juji uke, kawashi, koshi otoshi, ude henkan gatame" },
                { "text": "7. Livtag under armarna bakifrån \tUde osae, ude osae gatame" },
                { "text": "8. Högt livtag över armarna bakifrån \tMaesabaki, kuzure ude osae, ude henkan gatame" },
                { "text": "9. Stryptag mot liggande sittande mellan benen \tFrigöring" },
                { "text": "10. Svingslag mot liggande mot huvudet \tJodan chikai uke, hiza kansetsu waza " },
                { "text": "11. Rakt slag mot huvudet \tJodan soto uke, o soto otoshi, ude hishigi hiza gatame" },
                { "text": "12. Cirkulär spark mot benen \tSan ren uke, o soto osae, ude henkan gatame" },
                { "text": "13. Påkslag mot huvudet, backhand \tJu morote jodan uke, ude osae, ude osae gatame" },
                { "text": "14. Knivhot mot halsen, vänster sida \tGrepp, kin geri" },
                { "text": "15. Knivhot mot halsen, höger sida \tGrepp, kin geri" }
            ]
        },
        {
            "category_name": "RENRAKU WAZA",
            "techniques": [
                { "text": "1. Grepp i två handleder bakifrån - Rak spark mot magen \tFrigöring - Gedan uchi uke, koshi otoshi, ude henkan gatame" },
                { "text": "2. Hotfullt närmande mot liggande - Långt svingslag \tUppgång bakåt - Ju jodan uchi uke, uki otoshi ude henkan gatame" }
            ]
        },
        {
            "category_name": "YAKUSOKU GEIKO_OR_RANDORI",
            "techniques": [
                { "text": "1. Försvar mot en motståndare" }
            ]
        }
    ]
}'::JSON);
<<<<<<< HEAD:infra/database/init/defaults/grading_protocols.sql
INSERT INTO grading_protocol (belt_id, grading_protocol) VALUES (12, 
=======
INSERT INTO examination_protocol (belt_id, examination_protocol) VALUES (9, 
>>>>>>> main:infra/database/init/defaults/examination_protocols.sql
'{
    "examination_protocol": {"code": "2 KYU", "color": "BLÅTT BÄLTE"},
    "categories": [
        {
            "category_name": "KIHON WAZA - ATEMI WAZA",
            "techniques": [
                { "text": "1. Shotei uchi, jodan, rak stöt med främre och bakre handen" },
                { "text": "2. Shotei uchi, chudan, rak stöt med främre och bakre handen" },
                { "text": "3. Gedan geri, rak spark med främre och bakre benet" },
                { "text": "4. Mawashi shotei uchi, jodan, cirkulär stöt med bakre handen" },
                { "text": "5. Chudan tski, stöt snett uppåt med bakre handen" },
                { "text": "6. Hiza geri, chudan, rak knästöt med bakre benet" },
                { "text": "7. Mawashi seiken tski, jodan, cirkulärt slag med främre och bakre handen" },
                { "text": "8. Kin geri, gedan, spark snett uppåt med främre och bakre benet" },
                { "text": "9. Mae geri, chudan, rak spark med främre och bakre benet" },
                { "text": "10. Seiken tski, jodan, rakt slag med främre och bakre handen" },
                { "text": "11. Seiken tski, chudan, rakt slag med främre och bakre handen" },
                { "text": "12. Mawashi geri, gedan, cirkulär spark med främre och bakre benet" },
                { "text": "13. Mawashi geri, chudan, cirkulär spark med främre och bakre benet" }
            ]
        },
        {
            "category_name": "KIHON WAZA - KANSUTSU WAZA",
            "techniques": [
                { "text": "1. O soto osae, utan grepp, nedläggning snett bakåt" },
                { "text": "2. Kote gaeshi, grepp i handleden, nedläggning snett framåt" },
                { "text": "3. Kote gaeshi, grepp i handleden, nedläggning snett bakåt" },
                { "text": "4. Ude osae, grepp i kragen med tryck, nedläggning framåt" },
                { "text": "5. Ude osae, i rörelse, cirkulär nedläggning" },
                { "text": "6. Irimi nage, grepp i handleden, nedläggning snett bakåt" },
                { "text": "7. Irimi nage, i rörelse, nedläggning snett framåt" }
            ]
        },
        {
            "category_name": "KIHON WAZA - NAGE WAZA",
            "techniques": [
                { "text": "1. Koshi otoshi, utan grepp, nedläggning snett bakåt" },
                { "text": "2. Uki otoshi, i rörelse, nedläggning snett framåt" },
                { "text": "3. O soto otoshi, grepp i kragen med drag, nedläggning snett bakåt" },
                { "text": "4. O soto otoshi, utan grepp, nedläggning snett bakåt" },
                { "text": "5. O goshi, utan grepp, kast snett framåt" },
                { "text": "6. Tai guruma, utan grepp, nedläggning snett framåt" }
            ]
        },
        {
            "category_name": "JIGO WAZA",
            "techniques": [
                { "text": "1. Stryptag från sidan med tryck \tKote hineri, ude henkan gatame" },
                { "text": "2. Stryptag bakifrån \tO soto otoshi, ude hishigi hiza gatame" },
                { "text": "3. Grepp i kläderna mot vägg \tTate hishigi, ude henkan gatame" },
                { "text": "4. Försök till livtag över armarna, framifrån \tUki otoshi, ude henkan gatame" },
                { "text": "5. Livtag över armarna framifrån \tO goshi, ude hishigi hiza gatame" },
                { "text": "6. Försök till grepp om båda benen, framifrån \tTai guruma, ude henkan gatame" },
                { "text": "7. Stryptag mot liggande med armen \tFrigöring, ude henkan gatame" },
                { "text": "8. Spark mot liggande mot huvudet \tSan ren uke, hiza kansetsu waza" },
                { "text": "9. Hotfullt uppträdande \tUde hishigi" },
                { "text": "10. Kort svingslag \tJodan chikai uke, o soto otoshi, ude hishigi hiza gatame" },
                { "text": "11. Långt svingslag \tMorote jodan uke, hiza geri, tai guruma, ude henkan gatame" },
                { "text": "12. Svingslag, backhand \tMorote jodan uke, irimi nage, ude henkan gatame" },
                { "text": "13. Påkslag mot huvudet, backhand \tJu jodan uchi uke, irimi nage, ude hishigi hiza gatame" },
                { "text": "14. Grepp och knivhot mot magen \tGrepp, kin geri, kote gaeshi, ude hishigi hiza gatame" },
                { "text": "15. Två motståndare, grepp i kläderna \tUde osae" }
            ]
        },
        {
            "category_name": "RENRAKU WAZA",
            "techniques": [
                { "text": "1. Försök till grepp i kläderna - Chudan soto uke, koshi otoshi, ude henkan gatame \tValfri jigo waza anpassad efter ukes agerande" },
                { "text": "2. Grepp i kläderna med drag - O soto otoshi, ude hishigi hiza gatame \tValfri jigo waza anpassad efter ukes agerande" },
                { "text": "3. Cirkulär spark mot benen - San ren uke, o soto osae, ude henkan gatame \tValfri jigo waza anpassad efter ukes agerande" }
            ]
        },
        {
            "category_name": "YAKUSOKU GEIKO_OR_RANDORI",
            "techniques": [
                { "text": "1. Försvar mot en motståndare" }
            ]
        }
    ]
}'::JSON);
<<<<<<< HEAD:infra/database/init/defaults/grading_protocols.sql
INSERT INTO grading_protocol (belt_id, grading_protocol) VALUES (13, 
=======
INSERT INTO examination_protocol (belt_id, examination_protocol) VALUES (11, 
>>>>>>> main:infra/database/init/defaults/examination_protocols.sql
'{
    "examination_protocol": {"code": "1 KYU", "color": "BRUNT BÄLTE"},
    "categories": [
        {
            "category_name": "KIHON WAZA - ATEMI WAZA",
            "techniques": [
                { "text": "1. Shotei uchi, jodan, rak stöt med främre och bakre handen" },
                { "text": "2. Shotei uchi, chudan, rak stöt med främre och bakre handen" },
                { "text": "3. Gedan geri, rak spark med främre och bakre benet" },
                { "text": "4. Mawashi shotei uchi, jodan, cirkulär stöt med bakre handen" },
                { "text": "5. Chudan tski, stöt snett uppåt med bakre handen" },
                { "text": "6. Hiza geri, chudan, rak knästöt med bakre benet" },
                { "text": "7. Mawashi seiken tski, jodan, cirkulärt slag med främre och bakre handen" },
                { "text": "8. Kin geri, gedan, spark snett uppåt med främre och bakre benet" },
                { "text": "9. Mae geri, chudan, rak spark med främre och bakre benet" },
                { "text": "10. Seiken tski, jodan, rakt slag med främre och bakre handen" },
                { "text": "11. Seiken tski, chudan, rakt slag med främre och bakre handen" },
                { "text": "12. Mawashi geri, gedan, cirkulär spark med främre och bakre benet" },
                { "text": "13. Mawashi geri, chudan, cirkulär spark med främre och bakre benet" },
                { "text": "14. Empi uchi, jodan, cirkulär stöt med främre och bakre armen" },
                { "text": "15. Empi uchi, chudan, rak stöt åt sidan med närmaste armen" },
                { "text": "16. Kakato geri, chudan, rak spark med bakre benet" },
                { "text": "17. Yoko geri, chudan, rak spark åt sidan med närmaste benet" }
            ]
        },
        {
            "category_name": "KIHON WAZA - KANSUTSU WAZA",
            "techniques": [
                { "text": "1. O soto osae, utan grepp, nedläggning snett bakåt" },
                { "text": "2. Kote gaeshi, grepp i handleden, nedläggning snett framåt" },
                { "text": "3. Kote gaeshi, grepp i handleden, nedläggning snett bakåt" },
                { "text": "4. Ude osae, grepp i kragen med tryck, nedläggning framåt" },
                { "text": "5. Ude osae, i rörelse, cirkulär nedläggning" },
                { "text": "6. Irimi nage, grepp i handleden, nedläggning snett bakåt" },
                { "text": "7. Irimi nage, i rörelse, nedläggning snett framåt" },
                { "text": "8. Waki gatame, grepp i handleden, nedläggning snett bakåt" },
                { "text": "9. Kote mawashi, grepp i kragen med tryck, nedläggning snett framåt" }
            ]
        },
        {
            "category_name": "KIHON WAZA - NAGE WAZA",
            "techniques": [
                { "text": "1. Koshi otoshi, utan grepp, nedläggning snett bakåt" },
                { "text": "2. Uki otoshi, i rörelse, nedläggning snett framåt" },
                { "text": "3. O soto otoshi, grepp i kragen med drag, nedläggning snett bakåt" },
                { "text": "4. O soto otoshi, utan grepp, nedläggning snett bakåt" },
                { "text": "5. O goshi, utan grepp, kast snett framåt" },
                { "text": "6. Tai guruma, utan grepp, nedläggning snett framåt" },
                { "text": "7. Harai goshi, utan grepp, kast snett framåt" },
                { "text": "8. Harai goshi, i rörelse, kast snett framåt" },
                { "text": "9. Sukui nage, utan grepp, kast snett framåt" },
                { "text": "10. Ko uchi gari, utan grepp, kast snett bakåt" }
            ]
        },
        {
            "category_name": "JIGO WAZA",
            "techniques": [
                { "text": "1. Grepp i håret med två händer och knästöt \tGedan juji uke, waki gatame, ude osae gatame" },
                { "text": "2. Stryptag från sidan \tHarai goshi, ude hishigi hiza gatame" },
                { "text": "3. Stryptag bakifrån \tJodan chikai uke, sukui nage, ude hishigi hiza gatame" },
                { "text": "4. Stryptag med armen med drag \tO soto otoshi, ude hishigi hiza gatame" },
                { "text": "5. Kravattgrepp framifrån \tChudan tski, kote hineri, ude henkan gatame" },
                { "text": "6. Kravattgrepp med nedbrytning i sidled \tFrigöring, ude henkan gatame" },
                { "text": "7. Grepp i kläderna med tryck \tKote mawashi, ude osae gatame" },
                { "text": "8. Flera svingslag mot liggande sittande på magen \tJodan chikai uke, frigöring " },
                { "text": "9. Hotfullt närmande mot liggande \tUppgång framåt, jodan chikai uke, hiza kansetsu waza" },
                { "text": "10. Hotfullt uppträdande \tHara osae, ude henkan gatame" },
                { "text": "11. Kort svingslag \tJodan chikai uke, uki otoshi, ude henkan gatame" },
                { "text": "12. Kort svingslag \tJodan chikai uke, ko uchi gari" },
                { "text": "13. Rak spark mot magen \tGedan uchi uke, irimi nage, ude henkan gatame" },
                { "text": "14. Påkslag mot huvudet forehand och backhand \tTsuri ashi, ayumi ashi, ju jodan uchi uke, irimi nage, ude hishigi hiza gatame" },
                { "text": "15. Påkslag mot huvudet backhand och forehand \tTsuri ashi, ayumi ashi, morote jodan uke, o soto osae, ude hishigi hiza gatame" },
                { "text": "16. Grepp och knivhot mot halsen, höger sida \tGrepp waki gatame, ude hiza osae gatame" },
                { "text": "17. Knivhot mot halsen bakifrån med höger arm \tMaesabaki, kuzure ude osae, ude hiza osae gatame" },
                { "text": "18. Knivhot mot halsen bakifrån med vänster arm \tMaesabaki, kuzure ude garami, kote gaeshi, ude hishigi hiza gatame" },
                { "text": "19. Två motståndare, svingslag och svingslag \tMorote jodan uke, hiza geri, tai guruma morote jodan uke, hiza geri, tai guruma" }
            ]
        },
        {
            "category_name": "RENRAKU WAZA",
            "techniques": [
                { "text": "1. Stryptag bakifrån - O soto otoshi, ude hishigi hiza gatame \tValfri jigo waza anpassad efter ukes agerande" },
                { "text": "2. Grepp om nacken och en knästöt - Gedan juji uke, frigöring \tValfri jigo waza anpassad efter ukes agerande" },
                { "text": "3. Livtag över armarna framifrån - O goshi, ude hishigi hiza gatame \tValfri jigo waza anpassad efter ukes agerande" }
            ]
        },
        {
            "category_name": "YAKUSOKU GEIKO_OR_RANDORI",
            "techniques": [
                { "text": "1. Försvar mot en motståndare" }
            ]
        }
    ]
}'::JSON);