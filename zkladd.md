2024-05-20 09:52:14 2024-05-20 07:52:14.301 UTC [60] ERROR:  insert or update on table "exercise_tag" violates foreign key constraint "et_fk_exercise"
2024-05-20 09:52:14 2024-05-20 07:52:14.301 UTC [60] DETAIL:  Key (ex_id)=(285) is not present in table "exercise".
2024-05-20 09:52:14 2024-05-20 07:52:14.301 UTC [60] STATEMENT:  INSERT INTO exercise_tag (ex_id, tag_id) VALUES (285, 40), (285, 45), (285, 50);
2024-05-20 09:52:14 psql:/docker-entrypoint-initdb.d/defaults/exercises.sql:66: ERROR:  insert or update on table "exercise_tag" violates foreign key constraint "et_fk_exercise"
2024-05-20 09:52:14 DETAIL:  Key (ex_id)=(285) is not present in table "exercise".