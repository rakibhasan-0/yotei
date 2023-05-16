--
-- Init Yotei DB
--


-- Inställningar (justera gärna :-))
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;
SET search_path = "psql", public, postgis;
SET default_tablespace = '';

SET default_table_access_method = heap;

GRANT usage ON schema public to public;
GRANT CREATE ON schema public to public;

DROP TABLE IF EXISTS exercise_tag CASCADE;
DROP TABLE IF EXISTS technique_tag CASCADE;
DROP TABLE IF EXISTS workout_tag CASCADE;
DROP TABLE IF EXISTS activity CASCADE;
DROP TABLE IF EXISTS tag CASCADE;
DROP TABLE IF EXISTS user_workout CASCADE;
DROP TABLE IF EXISTS workout CASCADE;
DROP TABLE IF EXISTS technique CASCADE;
DROP TABLE IF EXISTS techniques_url CASCADE;
DROP TABLE IF EXISTS exercise CASCADE;
DROP TABLE IF EXISTS user_table CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS plan CASCADE;
DROP TABLE IF EXISTS session CASCADE;
DROP TABLE IF EXISTS workout_favorite CASCADE;
DROP TABLE IF EXISTS workout_review CASCADE;
DROP TABLE IF EXISTS user_settings CASCADE;
DROP TABLE IF EXISTS user_to_plan CASCADE;
DROP TABLE IF EXISTS belt CASCADE;
DROP TABLE IF EXISTS plan_to_belt CASCADE;
DROP TABLE IF EXISTS technique_to_belt CASCADE;
DROP TABLE IF EXISTS error_log CASCADE;
DROP TABLE IF EXISTS media CASCADE;
DROP SEQUENCE IF EXISTS serial;

CREATE SEQUENCE serial START WITH 1 INCREMENT BY 1;

-- TODO: Lägg till dessa till alla CREATE TABLE (vet inte om det finns bättre lösning)
-- ENCODING 'UTF8'
-- LC_COLLATE = 'sv-SE'
-- LC_CTYPE = 'sv-SE'


--
-- Name: tag; Type: TABLE; Schema: public; Owner: psql
--
CREATE TABLE tag(
       tag_id INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
       name VARCHAR(255) UNIQUE
);
ALTER TABLE tag OWNER TO psql;

--
-- Name: technique; Type: TABLE; Schema: public; Owner: psql
--
CREATE TABLE technique(
       technique_id INT DEFAULT nextval('serial') PRIMARY KEY,
       name VARCHAR(255) UNIQUE,
       description TEXT
);
ALTER TABLE technique OWNER TO psql;

--
-- Name: user_table; Type: TABLE; Schema: public; Owner: psql
--
CREATE TABLE user_table(
       user_id INT NOT NULL GENERATED ALWAYS AS IDENTITY UNIQUE,
       username VARCHAR(255) PRIMARY KEY,
       password VARCHAR(255) NOT NULL,
       user_role INT NOT NULL
);
ALTER TABLE user_table OWNER TO psql;

--
-- Name: exercise; Type: TABLE; Schema: public; Owner: psql
--
CREATE TABLE exercise(
       exercise_id INT DEFAULT nextval('serial') PRIMARY KEY,
       name VARCHAR(255) UNIQUE,
       description TEXT,
       duration INT
);
ALTER TABLE exercise OWNER TO psql;

--
-- Name: workout; Type: TABLE; Schema: public; Owner: psql
--
CREATE TABLE workout(
       workout_id INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
       workout_name CHARACTER VARYING(50) NOT NULL,
       workout_desc TEXT,
       workout_duration INT NOT NULL,
       workout_created DATE NOT NULL,
       workout_changed DATE NOT NULL,
       workout_date TIMESTAMP NOT NULL,
       workout_hidden BOOLEAN NOT NULL,
       workout_author INT NOT NULL,
       CONSTRAINT workout_fk_user_table FOREIGN KEY (workout_author)
        REFERENCES user_table(user_id)
);
ALTER TABLE workout OWNER TO psql;

--
-- Name: user_workout (Mapping table); Type: TABLE; Schema: public; Owner: psql
--
CREATE TABLE user_workout(
       uw_id INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
       workout_id INT NOT NULL,
       user_id INT NOT NULL,
       CONSTRAINT fk_workout_uw FOREIGN KEY (workout_id)
        REFERENCES workout(workout_id) ON DELETE CASCADE,
       CONSTRAINT fk_user_uw FOREIGN KEY (user_id)
        REFERENCES user_table(user_id) ON DELETE CASCADE
);
ALTER TABLE user_workout OWNER TO psql;

--
-- Name: activity; Type: TABLE; Schema: public; Owner: psql
--
CREATE TABLE activity(
       activity_id INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
       workout_id INT NOT NULL,
       exercise_id INT,
       technique_id INT,
       category_name VARCHAR(255),
       category_order INT NOT NULL,
       activity_name VARCHAR(255) NOT NULL,
       activity_desc TEXT,
       activity_duration INT NOT NULL,
       activity_order INT NOT NULL,
       CONSTRAINT fk_exercise_activity FOREIGN KEY (exercise_id)
        REFERENCES exercise(exercise_id),
       CONSTRAINT fk_technique_activity FOREIGN KEY (technique_id)
        REFERENCES technique(technique_id),
       CONSTRAINT fk_workout_activity FOREIGN KEY (workout_id)
        REFERENCES workout(workout_id) ON DELETE CASCADE
);
ALTER TABLE activity OWNER TO psql;

--
-- Name: exercise_tag (Mapping table); Type: TABLE; Schema: public; Owner: psql
--
CREATE TABLE IF NOT EXISTS exercise_tag (
       exertag_id SERIAL PRIMARY KEY,
       ex_id INT NOT NULL,
       tag_id INT NOT NULL,
       CONSTRAINT et_fk_exercise FOREIGN KEY (ex_id)
        REFERENCES exercise(exercise_id) ON DELETE CASCADE,
       CONSTRAINT et_fk_tag FOREIGN KEY (tag_id)
        REFERENCES tag(tag_id) ON DELETE CASCADE,
       UNIQUE (ex_id, tag_id)
);

--
-- Name: technique_tag (Mapping table); Type: TABLE; Schema: public; Owner: psql
--
CREATE TABLE IF NOT EXISTS technique_tag (
       techtag_id SERIAL PRIMARY KEY,
       tech_id INT NOT NULL,
       tag_id INT NOT NULL,
       CONSTRAINT tt_fk_technique FOREIGN KEY (tech_id)
        REFERENCES technique(technique_id) ON DELETE CASCADE,
       CONSTRAINT tt_fk_tag_tech FOREIGN KEY (tag_id)
        REFERENCES tag(tag_id) ON DELETE CASCADE,
       UNIQUE (tech_id, tag_id)
);

--
-- Name: workout_tag (Mapping table); Type: TABLE; Schema: public; Owner: psql
--
CREATE TABLE workout_tag(
       worktag_id INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
       work_id INT NOT NULL,
       tag_id INT NOT NULL,
       CONSTRAINT wt_fk_workout FOREIGN KEY(work_id)
        REFERENCES workout(workout_id) ON DELETE CASCADE,
       CONSTRAINT wt_fk_tag FOREIGN KEY(tag_id)
        REFERENCES tag(tag_Id) ON DELETE CASCADE,
       UNIQUE (work_id, tag_id)
);
ALTER TABLE workout_tag OWNER TO psql;

--
-- Name: workout_favorite; Type: TABLE; Schema: public; Owner: psql
--
CREATE TABLE workout_favorite(
       workout_id INT
        REFERENCES workout(workout_id) ON DELETE CASCADE,
       user_id INT
        REFERENCES user_table(user_id) ON DELETE CASCADE,
       PRIMARY KEY (user_id, workout_id)
);
ALTER TABLE workout_favorite OWNER TO psql;

--
-- Name: plan; Type: TABLE; Schema: public; Owner: psql
--
CREATE TABLE plan (plan_id INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
       name VARCHAR NOT NULL,
       color VARCHAR NOT NULL,
       user_id INT NOT NULL,
       CONSTRAINT plan_fk_user_id FOREIGN KEY (user_id)
        REFERENCES user_table(user_id)
);
ALTER TABLE plan OWNER TO psql;

--
-- Name: session; Type: TABLE; Schema: public; Owner: psql
--
CREATE TABLE session (session_id INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
       text VARCHAR,
       workout_id INT,
       plan_id INT NOT NULL,
       date DATE NOT NULL,
       time TIME,
       CONSTRAINT session_fk_workout_id FOREIGN KEY (workout_id)
        REFERENCES workout(workout_id) ON DELETE SET NULL,
       CONSTRAINT session_fk_plan_id FOREIGN KEY (plan_id)
        REFERENCES plan(plan_id) ON DELETE CASCADE
);
ALTER TABLE session OWNER TO psql;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: psql
--
CREATE TABLE comments(
       comment_id INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
       comment_text TEXT NOT NULL,
       user_id INT NOT NULL,
       created DATE NOT NULL,
       workout_id INT CHECK (workout_id IS NULL OR
        (workout_id IS NOT NULL and exercise_id IS NULL)),
       exercise_id INT CHECK (exercise_id IS NULL OR
        (exercise_id IS NOT NULL and workout_id IS NULL)),
       CONSTRAINT comment_fk_workout_id FOREIGN KEY(workout_id)
        REFERENCES workout(workout_id) ON DELETE CASCADE,
       CONSTRAINT comment_fk_user_id FOREIGN KEY(user_id)
        REFERENCES user_table(user_id),
       CONSTRAINT comment_fk_exercise_id FOREIGN KEY(exercise_id)
        REFERENCES exercise(exercise_id) ON DELETE CASCADE
);
ALTER TABLE comments OWNER TO psql;

--
-- Name: user_settings; Type: TABLE; Schema: public; Owner: psql
--
CREATE TABLE user_settings(user_id INT CHECK (user_id IS NOT NULL),
       CONSTRAINT fk_user_id FOREIGN KEY (user_id)
        REFERENCES user_table(user_id) ON DELETE CASCADE
);
ALTER TABLE user_settings OWNER TO psql;

--
-- Name: user_to_plan (Mapping table); Type: TABLE; Schema: public; Owner: psql
--
CREATE TABLE user_to_plan (
       user_id INT CHECK ( user_id IS NOT NULL),
       plan_id INT CHECK ( plan_id IS NOT NULL),
       CONSTRAINT u2p_fk_user_id FOREIGN KEY (user_id)
        REFERENCES user_table(user_id) ON DELETE CASCADE,
       CONSTRAINT u2p_fk_plan_id FOREIGN KEY (plan_id)
        REFERENCES plan(plan_id) ON DELETE CASCADE
);
ALTER TABLE user_to_plan OWNER TO psql;

--
-- Name: workout_reviewType: TABLE; Schema: public; Owner: psql
--
CREATE TABLE workout_review(
       review_id INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
       workout_id INT CHECK(workout_id IS NOT NULL),
       user_id INT CHECK(user_id IS NOT NULL),
       rating INT CHECK(rating IS NOT NULL),
       positive_comment TEXT,
       negative_comment TEXT,
       review_date TIMESTAMP NOT NULL,
       CONSTRAINT wr_fk_workout_id FOREIGN KEY(workout_id)
        REFERENCES workout(workout_id) ON DELETE CASCADE,
       CONSTRAINT wr_fk_user_id FOREIGN KEY (user_id)
        REFERENCES user_table(user_id) ON DELETE CASCADE
);
ALTER TABLE workout_review OWNER TO psql;

--
-- Name: belt; Type: TABLE; Schema: public; Owner: psql
--
CREATE TABLE belt (
       belt_id INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
       belt_name TEXT NOT NULL,
       belt_color TEXT NOT NULL,
       is_child BOOLEAN NOT NULL
);
ALTER TABLE belt OWNER TO psql;

--
-- Name: plan_to_belt (Mapping table); Type: TABLE; Schema: public; Owner: psql
--
CREATE TABLE plan_to_belt (
       belt_id INT CHECK ( belt_id IS NOT NULL),
       plan_id INT CHECK ( plan_id IS NOT NULL),
       UNIQUE (belt_id, plan_id),
       CONSTRAINT fk_belt_id FOREIGN KEY (belt_id)
        REFERENCES belt(belt_id) ON DELETE CASCADE,
       CONSTRAINT fk_plan_id FOREIGN KEY (plan_id)
        REFERENCES plan(plan_id) ON DELETE CASCADE
);
ALTER TABLE plan_to_belt OWNER TO psql;

--
-- Name: technique_to_belt (Mapping table); Type: TABLE; Schema: public; Owner: psql
--
CREATE TABLE technique_to_belt (
       belt_id INT CHECK ( belt_id IS NOT NULL),
       technique_id INT CHECK ( technique_id IS NOT NULL),
       UNIQUE (belt_id, technique_id),
       CONSTRAINT fk_belt_id FOREIGN KEY (belt_id)
        REFERENCES belt(belt_id) ON DELETE CASCADE,
       CONSTRAINT fk_technique_id FOREIGN KEY (technique_id)
        REFERENCES technique(technique_id) ON DELETE CASCADE
);
ALTER TABLE technique_to_belt OWNER TO psql;

-- Logging tables; Type: TABLE; Schema: public; Owner: psql
CREATE TABLE error_log (
       log_id SERIAL PRIMARY KEY,
       error_message TEXT NOT NULL,
       info_message TEXT  NOT NULL
);
ALTER TABLE error_log OWNER TO psql;

--
-- Name: media; Type: TABLE; Schema: public; Owner: psql
--
CREATE TABLE media (
       media_id INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
       movement_id INT NOT NULL,
       url TEXT NOT NULL,
       local_storage BOOLEAN NOT NULL,
       image BOOLEAN NOT NULL,
       description TEXT
);
ALTER TABLE media OWNER TO psql;

--
-- Inserts
--



--
-- CONVERT USERS FROM JSON -- BEGINNING
--


--
-- INSERTS FOR USERS
--

INSERT INTO user_table (username, password, user_role) VALUES ('admin', '1000:b7fdda8fd62b8bb1b602d39f3b4175ab:2793a42fdc4552496d82ad442794cd2aa246945a5958173104b44f194feddfe59e47871825b76240728125ab4b96cb8ad3ba54496762230990dbcef47d4b6461', 0);


--
-- CONVERT BELTS FROM JSON BEGINNING
--


--
-- INSERTS FOR BELT COLORS
--

INSERT INTO belt (belt_name, belt_color, is_child) VALUES ('Vitt', 'FCFCFC', False);
INSERT INTO belt (belt_name, belt_color, is_child) VALUES ('Vitt', 'BD3B41', True);
INSERT INTO belt (belt_name, belt_color, is_child) VALUES ('Gult', 'EDD70D', False);
INSERT INTO belt (belt_name, belt_color, is_child) VALUES ('Gult', 'EDD70D', True);
INSERT INTO belt (belt_name, belt_color, is_child) VALUES ('Orange', 'ED930D', False);
INSERT INTO belt (belt_name, belt_color, is_child) VALUES ('Orange', 'ED930D', True);
INSERT INTO belt (belt_name, belt_color, is_child) VALUES ('Grönt', '00BE08', False);
INSERT INTO belt (belt_name, belt_color, is_child) VALUES ('Grönt', '00BE08', True);
INSERT INTO belt (belt_name, belt_color, is_child) VALUES ('Blått', '0DB7ED', False);
INSERT INTO belt (belt_name, belt_color, is_child) VALUES ('Blått', '0DB7ED', True);
INSERT INTO belt (belt_name, belt_color, is_child) VALUES ('Brunt', 'BB6500', False);
INSERT INTO belt (belt_name, belt_color, is_child) VALUES ('Brunt', 'BB6500', True);
INSERT INTO belt (belt_name, belt_color, is_child) VALUES ('1_Dan', '000000', False);
INSERT INTO belt (belt_name, belt_color, is_child) VALUES ('2_Dan', '000000', False);
INSERT INTO belt (belt_name, belt_color, is_child) VALUES ('3_Dan', '000000', False);
INSERT INTO belt (belt_name, belt_color, is_child) VALUES ('4_Dan', '000000', False);



--
-- CONVERT TAGS FROM JSON -- BEGINNING
--


--
-- INSERTS FOR TAGS
--

INSERT INTO tag (name) VALUES ('Brunt');
INSERT INTO tag (name) VALUES ('Atemi Waza');
INSERT INTO tag (name) VALUES ('Kihon Waza');
INSERT INTO tag (name) VALUES ('Kansetsu Waza');
INSERT INTO tag (name) VALUES ('Nage Waza');
INSERT INTO tag (name) VALUES ('Katame Waza');
INSERT INTO tag (name) VALUES ('Kata');
INSERT INTO tag (name) VALUES ('Randori');
INSERT INTO tag (name) VALUES ('Jigo Waza');
INSERT INTO tag (name) VALUES ('Renraku Waza');
INSERT INTO tag (name) VALUES ('Svart');
INSERT INTO tag (name) VALUES ('1 Dan');
INSERT INTO tag (name) VALUES ('Naga Waza');
INSERT INTO tag (name) VALUES ('2 Dan');
INSERT INTO tag (name) VALUES ('3 Dan');
INSERT INTO tag (name) VALUES ('Gult');
INSERT INTO tag (name) VALUES ('Tachi Waza');
INSERT INTO tag (name) VALUES ('Taisabaki Waza');
INSERT INTO tag (name) VALUES ('Ukemi Waza');
INSERT INTO tag (name) VALUES ('Uke Waza');
INSERT INTO tag (name) VALUES ('Orange');
INSERT INTO tag (name) VALUES ('Grönt');
INSERT INTO tag (name) VALUES ('Blått');
INSERT INTO tag (name) VALUES ('Judo');
INSERT INTO tag (name) VALUES ('Throws');
INSERT INTO tag (name) VALUES ('Footwork');
INSERT INTO tag (name) VALUES ('Uppvärmning');
INSERT INTO tag (name) VALUES ('Cardio');
INSERT INTO tag (name) VALUES ('Calisthenics');


--
-- CONVERT TECHNIQUES FROM JSON -- BEGINNING
--


--
-- INSERTS FOR TECHNIQUES
--

INSERT INTO technique (name, description) VALUES ('Empi uchi, jodan och chudan (1 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Uraken uchi, jodan (1 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Yoko geri chudan (1 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Waki gatame, mot diagonalt grepp, ude osage gatame (1 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('hiji gatame, gripa, ude hishigi hiza gatame', '');
INSERT INTO technique (name, description) VALUES ('Seoi nage, mot grepp i ärmen, ude hishigi hiza gatame (1 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Uki otoshi, mot grepp i ärmen, ude henkan gatame (1 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Ude hiza osae gatame (1 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Kata osae (1 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Nige no kata (1 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Randori mot en motståndare (1 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Randori mot en motståndare som angriper liggande (1 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Grepp i håret med två händer och knästöt, Gedan juji uke, waki gatame, kata osae', '');
INSERT INTO technique (name, description) VALUES ('Försök till stryptag, Uki otoshi, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Stryptag med armen med drag, Uki otoshi, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Kravattgrepp med neddrag, Frigöring, ude henkan gatame (1 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Grepp i kragen med höger hand och svingslag, Jodan uchi uke, ude gatame, kata osae', '');
INSERT INTO technique (name, description) VALUES ('Grepp i kragen med vänster hand och svingslag, Jodan uchi uke, o soto otoshi, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Grepp i håret mot liggande, Frigöring, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Stryptag mot liggande, mellan benen, Juji gatame, shiho nage gatame', '');
INSERT INTO technique (name, description) VALUES ('Vända liggande, Vända runt, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Slag mot liggande sittande på magen, Uchi uke, frigöring, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Svingslag, Ju jodan uchi uke, uki otoshi, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Svingslag, backhand, Ju morote jodan uke, waki gatame, ude osae gatame', '');
INSERT INTO technique (name, description) VALUES ('Påkslag mot huvudet, Ju jodan uchi uke, seoi nage, ude hishigi hiza gatame', '');
INSERT INTO technique (name, description) VALUES ('Påkslag mot huvudet, backhand, Ju morote jodan uke, hiji gatame, hara osae', '');
INSERT INTO technique (name, description) VALUES ('Knivhot mot halsen och grepp, Grepp, waki gatame, ude hiza osae gatame', '');
INSERT INTO technique (name, description) VALUES ('Knivhugg mot bröstet uppifrån, Grepp, kote gaeshi, ude hishigi hiza gatame', '');
INSERT INTO technique (name, description) VALUES ('Pistolhot framifrån, Grepp, kin geri', '');
INSERT INTO technique (name, description) VALUES ('Två motståndare, grepp i kläderna med svingslag, Jodan uchi uke, yoko geri, kin geri, kote gaeshi, taktisk nedläggning', '');
INSERT INTO technique (name, description) VALUES ('Grepp i håret med två händer och knästöt, Gedan juji uke, waki gatame - Koet gaeshi, kote gatame', '');
INSERT INTO technique (name, description) VALUES ('Stryptag med armen med drag O soto otoshi - Kuzure ude garami, kote gaeshi, kote gaeshi gatame', '');
INSERT INTO technique (name, description) VALUES ('Svingslag och svingslag, Morote jodan uke - Morote jodan uke, o soto osae, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Rakt slag mot huvudet, Jodan soto uke, chudan tski - Hiza geri', '');
INSERT INTO technique (name, description) VALUES ('Påkslag mot huvudet, backhand, Ju morote jodan uke, hiji gatame, hara osae - Ushiro osae', '');
INSERT INTO technique (name, description) VALUES ('Påkslag mot huvudet, forehand och backhand, Tsuri ashi - ju jodan uchi uke, irimi nage, ude hishigi hiza gatame', '');
INSERT INTO technique (name, description) VALUES ('Haito uchi, jodan (1 Dan)', '');
INSERT INTO technique (name, description) VALUES ('Shuto uchi, jodan, höger och vänster sida (1 Dan)', '');
INSERT INTO technique (name, description) VALUES ('Ude hishigi, gripa (1 Dan)', '');
INSERT INTO technique (name, description) VALUES ('Kuzure kote gaeshi gatame, gripa (1 Dan)', '');
INSERT INTO technique (name, description) VALUES ('Ude garami, gripa, kote gatame (1 Dan)', '');
INSERT INTO technique (name, description) VALUES ('Harai goshi, mot grepp i ärmen, ude hishigi hiza gatame (1 Dan)', '');
INSERT INTO technique (name, description) VALUES ('Sukui nage, mot grepp i ärmen, ude hishigi hiza gatame (1 Dan)', '');
INSERT INTO technique (name, description) VALUES ('Ju-jutsu kai no kat, serie 1 (1 Dan)', '');
INSERT INTO technique (name, description) VALUES ('Randori mot en motståndare som angriper med slag och spark (1 Dan)', '');
INSERT INTO technique (name, description) VALUES ('Randori mot en motståndare (1 Dan)', '');
INSERT INTO technique (name, description) VALUES ('Grepp i håret bakifrån med neddrag, Shiho nage, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Försök till stryptag från sidan, Harai goshi, ude hishigi hiza gatame', '');
INSERT INTO technique (name, description) VALUES ('Stryptag bakifrån, Sukui nage ude hishigi hiza gatame', '');
INSERT INTO technique (name, description) VALUES ('Stryptag med armen med neddrag, Ura makikomi, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Kravattgrepp med neddrag, Frigöring, ude henkan gatame (1Dan svart)', '');
INSERT INTO technique (name, description) VALUES ('Dubbelnelson med nedbrytning, Mae ukemi, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Grepp i en ärm från sidan, Ude hishigi, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Försök till höftkast, O soto osae, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Grepp i kragen med neddrag, Hiza kansetsu waza', '');
INSERT INTO technique (name, description) VALUES ('Försök till livtag, över armarna, Uki otoshi, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Vända liggande, Vänd runt, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Grepp i kläderna och svingslag mot liggande, Uchi uke, frigöring, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Spark mot liggande mot grenen, Hiza kansetsu waza', '');
INSERT INTO technique (name, description) VALUES ('Försök till knuff, Irimi nage, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Rakt slag mot huvudet, Jodan soto uke, sukui nage', '');
INSERT INTO technique (name, description) VALUES ('Påkslag mot huvudet, Ju jodan uchi uke, uki otoshi, ude hishigi hiza gatame', '');
INSERT INTO technique (name, description) VALUES ('Knivhugg mot magen med grepp om nacken, Gedan juji uke, ude osae, ude hiza osae gatame', '');
INSERT INTO technique (name, description) VALUES ('Knivskärning, forehand, Tsuri ashi, irimi nage, ude hishigi hiza gatame', '');
INSERT INTO technique (name, description) VALUES ('Knivhugg mot bröstet från sidan, backhand, Grepp ude garami, ude hishigi hiza gatame', '');
INSERT INTO technique (name, description) VALUES ('Pistolhot bakifrån, Grepp, kin geri', '');
INSERT INTO technique (name, description) VALUES ('Försök till knuff, Irimi nage - O soto osae, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Svingslag, Ju morote jodan uke, hiki otoshi', '');
INSERT INTO technique (name, description) VALUES ('Påkslag mot huvudet, backhand och forehnad, Tsuri ashi - O soto osae, ude hishigi hiza gatame', '');
INSERT INTO technique (name, description) VALUES ('Knivhugg mot magen med grepp om nacken, Gedan juji uke, ude osae - Ude garami, ude hiza osae gatame', '');
INSERT INTO technique (name, description) VALUES ('Gripa stående, Ude hishigi - Kuzure kote gaeshi gatame', '');
INSERT INTO technique (name, description) VALUES ('Gripa stående, Hiji gatame - Ude garami, kote gatame', '');
INSERT INTO technique (name, description) VALUES ('Ushiro geri, chudan (2 Dan)', '');
INSERT INTO technique (name, description) VALUES ('Kuzure ude guruma, gripa (2 Dan)', '');
INSERT INTO technique (name, description) VALUES ('Okuri ude gatame, gripa (2 Dan)', '');
INSERT INTO technique (name, description) VALUES ('Ju-jutsu Kai no kata serie 1 och 2 (2 Dan)', '');
INSERT INTO technique (name, description) VALUES ('Randori mot två motståndare (2 Dan)', '');
INSERT INTO technique (name, description) VALUES ('Randori mot en motståndare som angriper liggande (2 Dan)', '');
INSERT INTO technique (name, description) VALUES ('Stryptag framifrån, Tsuri komi, tai otoshi, ude hishigi hiza gatame', '');
INSERT INTO technique (name, description) VALUES ('Stryptag framifrån, Te guruma, kote gatame', '');
INSERT INTO technique (name, description) VALUES ('Stryptag med armen neddrag, Hiza kansetsu waza', '');
INSERT INTO technique (name, description) VALUES ('Kravattgrepp från sidan, Tani otoshi, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Grepp om nacken och knästöt, Gedan juji uke, irimi nage, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Grepp i kläderna, O soto gari, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Försök till höftkast, O goshi, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Grepp i en ärm och svingslag, Jodan uchi uke, kuzure ude guruma', '');
INSERT INTO technique (name, description) VALUES ('Försök till livtag över armarna från sidan, Harai goshi, ude hishigi hiza gatame', '');
INSERT INTO technique (name, description) VALUES ('Nedtryckning från sidan, Frigöring, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Försök till knuff, Uki otoshi, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Svingslag, Morote jodan uke hiza geri, tai guruma, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Cirkulär spark mot sidan, Gedan uchi uke, o uchi otoshi', '');
INSERT INTO technique (name, description) VALUES ('Påkslag mot benen, San ren uke, o soto osae, ude hishigi hiza gatame', '');
INSERT INTO technique (name, description) VALUES ('Knivhot mot halsen bakifrån, höger arm, Kuzure ude osae, ude hiza osae gatame', '');
INSERT INTO technique (name, description) VALUES ('Knivhot mot halsen bakifrån, vänster arm, Kuzure ude garami, kote gaeshi', '');
INSERT INTO technique (name, description) VALUES ('Knivhot mot halsen sittande mellan benen, Hiza gatame', '');
INSERT INTO technique (name, description) VALUES ('Försök till pistolhot, Grepp, shotei uchi, kin geri, o soto osae', '');
INSERT INTO technique (name, description) VALUES ('Ingripa mot slag mot liggande, Nedläggning ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Ingripa mot armstrypning, Irimi nage, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Två motståndare, knivhot framifrån och svingslag, Grepp, shotei uchi, kin geri, o soto osae', '');
INSERT INTO technique (name, description) VALUES ('Stryptag bakifrån och knästöt, Frigöring - Gedan juji uke, irimi nage, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Rakt slag mot huvudet, Jodan soto uke, gedan mawashi, geri gyaku tski', '');
INSERT INTO technique (name, description) VALUES ('Knivskärning, forehand och backhand, Tsuri ashi - Ju jodan uchi uke, irimi nage, ude hishigi hiza gatame', '');
INSERT INTO technique (name, description) VALUES ('Knivskärning, nackhand och forehand, Tsuri ashi - Grepp, hiza geri, kuzure uda osae, ude hiza osae gatame', '');
INSERT INTO technique (name, description) VALUES ('Gripa stående, Hiji gatame - Okura ude gatame', '');
INSERT INTO technique (name, description) VALUES ('Gripa stående, Kuzure ude guruma - Hiji gatame', '');
INSERT INTO technique (name, description) VALUES ('Gripa stående, Kuzure kote gaeshi gatame - Okuri ude gatame', '');
INSERT INTO technique (name, description) VALUES ('Buki no kata (3 Dan)', '');
INSERT INTO technique (name, description) VALUES ('Randori mot två motståndare (3 Dan)', '');
INSERT INTO technique (name, description) VALUES ('Randori mot en motståndare som angriper med påk (3 Dan)', '');
INSERT INTO technique (name, description) VALUES ('Försök till stryptag, Kata guruma, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Kravattgrepp med neddrag, Yoko guruma, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Grepp i kläderna med tryck, Tomoe nage, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Försök till fotsvep, Ko soto gari, ude hishigi hiza gatame', '');
INSERT INTO technique (name, description) VALUES ('Lågt livtag framifrån med tryck, Sumi gaeshi, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Livtag undet armarna framifrån med upplyft, Tate hishigi, o soto osae, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Livtag under armarna bakifrån med upplyft, Hiza kansetsu waza', '');
INSERT INTO technique (name, description) VALUES ('Försök till grepp om båda benen, Tai guruma, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Grepp om ena benet framifrån med lyft, Sumi gaeshi, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Stryptag mot liggande, ovanför huvudet, Juji gatame, shiho nage gatame', '');
INSERT INTO technique (name, description) VALUES ('Cirkulär spark mot sidan, Gedan uchi uke, uchi mata', '');
INSERT INTO technique (name, description) VALUES ('Påkslag mot huvudet med tvåhandsgrepp, Irimi nage, ude hishigi hiza gatame', '');
INSERT INTO technique (name, description) VALUES ('Påkstöt mot magen, Grepp, kote gaeshi, ude hishigi hiza gatame', '');
INSERT INTO technique (name, description) VALUES ('Knivhot från sidan, Hiza geri, ude gatame, ude hishigi hiza gatame', '');
INSERT INTO technique (name, description) VALUES ('Knivhugg mot magen, underifrån, Grepp, kote gaeshi, ude hishigi hiza gatame', '');
INSERT INTO technique (name, description) VALUES ('Knivhugg mot liggande, sittande på magen, Juji uke, ude osae, ude hiza osae gatame', '');
INSERT INTO technique (name, description) VALUES ('Ingripa mot grepp i kläderna och svingslag, Irimi nage, ude hishigi hiza gatame', '');
INSERT INTO technique (name, description) VALUES ('Ingripande mot knivhot mot liggande, sittande på magen, Nedläggning, ude hiza osae gatame', '');
INSERT INTO technique (name, description) VALUES ('Två motståndare, stryptag mot liggande, Frigöring, kakato geri', '');
INSERT INTO technique (name, description) VALUES ('Två motståndare, svingslag och svingslag, Morote jodan uke, hiza geri, tai guruma', '');
INSERT INTO technique (name, description) VALUES ('Två motståndare, påkslag forehand, backhand och svingslag, Ju jodan uchi uke, irimi nage, påkslag', '');
INSERT INTO technique (name, description) VALUES ('Stryptag framifrån och kravattgrepp, Kota gaeshi - Tani otoshi, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Hot mot liggande och svingslag, Ju jodan uchi uke - Uki otoshi', '');
INSERT INTO technique (name, description) VALUES ('Påkslag mot huvudet, forehand och backhand, Blockering med påk, påkslag', '');
INSERT INTO technique (name, description) VALUES ('Påkslag med huvudet med tvåhandsgrepp, Irimi nage - O soto osae, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Knivskärning, forehand och backhand, Tsuri ashi - Blockering med påk, påkslag', '');
INSERT INTO technique (name, description) VALUES ('Rak spark mot magen, Blockering med påk - Gripa med påk', '');
INSERT INTO technique (name, description) VALUES ('Gripa liggande, Vända liggande - Kuzure kote gaeshi gatame', '');
INSERT INTO technique (name, description) VALUES ('Kamae, neutral (5 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Kamae, beredd (5 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Kamae, gard (5 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Ayumi ashi (5 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Tsuri ashi (5 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Taisabaki, kort, höger och vänster (5 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Taisabaki, lång, höger och vänster (5 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Uppgång bakåt (5 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Ushiro ukemi med dämpning (5 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Ju morote jodan uke, mot svingslag (5 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Jodan uchi uke, mot rakt slag (5 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Gedan uchi uke, mot cirkulärt slag (5 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Gedan juji uke, mot knästöt och rak spark (5 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Shotei uchi, jodan och chudan (5 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Me uchi, insidan och utsidan (5 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Gedan geri (5 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Ude osae, mot grepp i ärmen, ude osae gatame (5 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Ude osae gatame (5 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Ude henkan gatame (5 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Randori mot en motståndare (5 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Grepp i två handleder framifrån, Frigöring', '');
INSERT INTO technique (name, description) VALUES ('Grepp i två handleder bakifrån, Frigöring', '');
INSERT INTO technique (name, description) VALUES ('Grepp i håret framifrån, Ude osae, ude osae gatame', '');
INSERT INTO technique (name, description) VALUES ('Grepp i håret bakifrån, Tettsui uchi, ude osae, ude osae gatame', '');
INSERT INTO technique (name, description) VALUES ('Stryptag framifrån, Frigöring', '');
INSERT INTO technique (name, description) VALUES ('Stryptag bakifrån, Frigöring', '');
INSERT INTO technique (name, description) VALUES ('Stryptag med armen, Kuzure ude osae, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Försök till kravattgrepp från sidan, Frigöring', '');
INSERT INTO technique (name, description) VALUES ('Grepp om nacken och knästöt, Gedan juji uke, frigöring', '');
INSERT INTO technique (name, description) VALUES ('Grepp i kläderna med tryck, Ude osae, ude osae gatame', '');
INSERT INTO technique (name, description) VALUES ('Grepp i kläderna och svingslag, Jodan uchi uke, ude osae, ude osae gatame', '');
INSERT INTO technique (name, description) VALUES ('Livtag under armarna framifrån, Tate hishigi, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Livtag under armarna bakifrån, Fumikomi, ude osae, ude osae gatame', '');
INSERT INTO technique (name, description) VALUES ('Stryptag mot liggande sittande bredvid, Frigöring, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Hot mot liggande, Uppgång bakåt', '');
INSERT INTO technique (name, description) VALUES ('Hotfullt närmande framifrån, Hejda med tryck', '');
INSERT INTO technique (name, description) VALUES ('Svingslag, backhand, Ju morote jodan uke, ude osae, ude osae gatame', '');
INSERT INTO technique (name, description) VALUES ('Påkslag mot huvudet, Ju morote jodan uke', '');
INSERT INTO technique (name, description) VALUES ('Påkslag mot huvudet, bakhand, Ju morote jodan uke', '');
INSERT INTO technique (name, description) VALUES ('Grepp i två handleder framifrån och svingslag, Frigöring - Ju morote jodan uke', '');
INSERT INTO technique (name, description) VALUES ('Stryptag framifrån och svingslag, backhand, Frigöring - Ju morote jodan uke, ude osae, ude osae gatame', '');
INSERT INTO technique (name, description) VALUES ('Mae ukemi (4 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Ushiro ukemi (4 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Morote jodan uke, mot svingslag (4 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Chudan soto uke, mot rakt slag (4 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Gedan soto uke, mot rak spark (4 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Chudan tski (4 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Kin geri (4 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Kote gaeshi, mot diagonalt grepp, kote gaeshi gatame (4 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('O soto osae, mot grepp i ärmen, ude henkan gatame (4 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('O soto otoshi, mot grepp i ärmen, ude hishigi hiza gatame (4 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Ude hishigi hiza gatame (4 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Kote gaeshi gatame (4 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Randori mot en motståndare (4 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Grepp i två handleder bakifrån, Kote gaeshi, kote gaeshi gatame', '');
INSERT INTO technique (name, description) VALUES ('Stryptag framifrån, O soto otoshi, ude hishigi hiza gatame', '');
INSERT INTO technique (name, description) VALUES ('Stryptag framifrån, Kote gaeshi, kote gaeshi gatame', '');
INSERT INTO technique (name, description) VALUES ('Stryptag framifrån mot vägg, Tsuri komi, taisabaki', '');
INSERT INTO technique (name, description) VALUES ('Stryptag med vänster arm, Kuzure ude garami, kote gaeshi, kote gaeshi gatame', '');
INSERT INTO technique (name, description) VALUES ('Kravattgrepp från sidan, Ushiro osae, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Försök till grepp i kläderna, Chudan soto uke', '');
INSERT INTO technique (name, description) VALUES ('Grepp i kläderna med tryck, Kuzure ude garami, ushiro osae, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Grepp i kläderna med drag, O soto otoshi, ude hishigi hiza gatame', '');
INSERT INTO technique (name, description) VALUES ('Livtag över armarna framifrån, O soto otoshi, ude hishigi hiza gatame', '');
INSERT INTO technique (name, description) VALUES ('Grepp om båda benen framifrån, Tate hishigi, ude hishigi hiza gatame', '');
INSERT INTO technique (name, description) VALUES ('Stryptag mot liggande, mellan benen, Frigöring, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Svingslag, Morote jodan uke, o soto osae, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Svingslag, Ju morote jodan uke, hiki otoshi, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Rak spark mot magen, Gedan soto uke, o soto osae, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Påkslag mot huvudet, Ju morote jodan uke, hiki otoshi, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Påkslag mot huvudet, backhand, Ju morote jodan uke, ude osae, ude osae gatame', '');
INSERT INTO technique (name, description) VALUES ('Knivhot mot halsen, vänster sida, Grepp, kin geri', '');
INSERT INTO technique (name, description) VALUES ('Knivhot mot halsen, höger sida, Grepp, kin geri', '');
INSERT INTO technique (name, description) VALUES ('Stryptag framifrån, o soto otoshi - Kote gaeshi, kote gaeshi gatame', '');
INSERT INTO technique (name, description) VALUES ('Stryptag framifrån mot vägg, Tsuri komi - Ushiro osae, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Svingslag, Ju morote jodan uke, hiki otoshi - O soto osae, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Grepp i två handleder framifrån, Shiho nage, shiho nage gatame', '');
INSERT INTO technique (name, description) VALUES ('Grepp i två handleder underifrån,Kote mawashi, kote mawashi gatame', '');
INSERT INTO technique (name, description) VALUES ('Försök till stryptag, Jodan soto uke', '');
INSERT INTO technique (name, description) VALUES ('Stryptag framifrån, O soto osae, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Stryptag framifrån, Tsuri komi, o goshi, ude hishigi hiza gatame', '');
INSERT INTO technique (name, description) VALUES ('Stryptag bakifrån, O soto otoshi, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Grepp i kläderna med tryck, Kote mawashi, kote mawashi gatame', '');
INSERT INTO technique (name, description) VALUES ('Grepp i kläderna och svingslag, Jodan uchi uke, o soto otoshi, ude henkan gatame ', '');
INSERT INTO technique (name, description) VALUES ('Livtag under armarna bakifrån, Hiza osae', '');
INSERT INTO technique (name, description) VALUES ('Grepp i kläderna och svingslag mot liggande, Uchi uke, hiza kansetsu wasa', '');
INSERT INTO technique (name, description) VALUES ('Svingslag, Ju jodan uchi uke, shiho nage, shiho nage gatame', '');
INSERT INTO technique (name, description) VALUES ('Svingslag, backhand, Ju morote jodan uke, kote gaeshi, kote gaeshi gatame', ' ');
INSERT INTO technique (name, description) VALUES ('Rakt slag mot huvudet, Morote jodan uke, ko soto gari, ude hishigi hiza gatame', '');
INSERT INTO technique (name, description) VALUES ('Rakt slag mot huvudet, Jodan soto uke, o soto osae, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Rak slag mot magen, Gedan uchi uke, ushiro osae, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Påkslag mot huvudet, Ju jodan uchi uke, kote gaeshi, ude hishigi hiza gatame', '');
INSERT INTO technique (name, description) VALUES ('Påksalg mot huvudet, backhand, Ju morote jodan uke, kote gaeshi, ude hishigi hiza gatame', '');
INSERT INTO technique (name, description) VALUES ('Knivhot mot magen, Grepp, kin geri, kote  gaeshi, ude hishigi hiza gatame', '');
INSERT INTO technique (name, description) VALUES ('Två motståndare, grepp i kläderna, Ude osae, taktisk nedläggning', '');
INSERT INTO technique (name, description) VALUES ('Stryptag bakifrån, O soto otoshi - Kote gaeshi gatame', '');
INSERT INTO technique (name, description) VALUES ('Grepp i kläderna och svingslag, Jodan uchi uke, o soto otoshi - Kote mawashi, kote mawashi gatame', '');
INSERT INTO technique (name, description) VALUES ('Påkslag mot huvudet, backhand, Ju morote jodan uke, o soto otoshi - Kin geri, kote gaeshi, ude hishigi hiza gatame', '');
INSERT INTO technique (name, description) VALUES ('mae ukemi med dämpning (3 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Jodan soto uke, mot slag (3 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('San ren uke, mot cirkulär spark (3 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Kizami tski, jodan och chudan (3 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('mae geri, chudan (3 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Kote mawashi, mot grepp i ärmen, kote mawashi gatame (3 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Shihi nage, mot diagonalt grepp, shiho nage gatame (3 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Ko soto gari, mot grepp i ärmen, ude hishigi hiza gatame (3 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('O goshi, mot grepp i ärmen, ude hishigi hiza gatame (3 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('kote mawashi gatame (3 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Shiho nage gatame (3 Kyu)', '');
INSERT INTO technique (name, description) VALUES (' Randori mot en motståndare (3 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Otoshi ukemi (2 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Chudan uchi uke, mot rakt slag (2 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Gyaku tski, chudan (2 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Hiza geri, chudan (2 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Mawashi geri, chudan och gedan (2 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Kote hineri, mot diagonalt grepp, ude henkan gatame (2 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Irimi nage, mot diagonalt grepp, ude henkan gatame (2 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Ko uchi gari, mot grepp i ärmen, ude hishigi hiza gatame (2 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Kote gatame (2 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Randori mot en motståndare (2 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Randori mot en motståndare som angriper med slag och spark (2 Kyu)', '');
INSERT INTO technique (name, description) VALUES ('Stryptag från sidan med tryck, Kote hineri, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Stryptag med armen och en arm på ryggen, O soto otoshi, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Kravattgrepp framifrån, Chudan tski, kote hineri, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Försök till grepp i kläderna, Chudan uchi uke, ko soto gari, kote gatame', '');
INSERT INTO technique (name, description) VALUES ('Grepp i kläderna mot vägg, Tate hishigi, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Livtag över armarna framifrån, O goshi, ude hishigi hiza gatame', '');
INSERT INTO technique (name, description) VALUES ('Livtag över armarna bakifrån, Hiza kansetsu waza', '');
INSERT INTO technique (name, description) VALUES ('Stryptag mot liggande, mellan benen, Frigöring, kakato geri', '');
INSERT INTO technique (name, description) VALUES ('Stryptag med armen mot liggande, Frigöring, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Livtag mot liggande, Tate hishigi, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Spark mot liggande, mot huvudet, Hiza kansetsu waza', '');
INSERT INTO technique (name, description) VALUES ('Rakt slag mot huvudet, Morote jodan uke, ko uchi gari, ude hishigi hiza gatame', '');
INSERT INTO technique (name, description) VALUES ('Svingslag, backhand, Ju jodan uchi uke, irimi nage, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Cirkulär spark mot huvudet, San ren uke, o soto osae, ude henkan gatame', '');
INSERT INTO technique (name, description) VALUES ('Påkslag mot huvudet, backhand, Ju jorda uchi uke, irimi nage, ude hishigi hiza gatame', '');
INSERT INTO technique (name, description) VALUES ('Knivstick mot magen, Grepp, kote gaeshi, ude hishigi hiza gatame', '');
INSERT INTO technique (name, description) VALUES ('Två motståndare, svingslag och grepp i kläderna, Jodan uchi uke, mae geri, kote mawashi, taktisk nedläggning', '');
INSERT INTO technique (name, description) VALUES ('Grepp i håret framifrån, ude osae - Kote mawashi, kote mawashi gatame', '');
INSERT INTO technique (name, description) VALUES ('Stryptag med armen och en arm på ryggen, O soto otoshi - Kuzure ude garami, kote gaeshi, kote gatame', '');
INSERT INTO technique (name, description) VALUES ('Rakt slag mot magen, Chudan uchi uke, gyaku tski - Mawashi geri', '');
INSERT INTO technique (name, description) VALUES ('Påkslag mot huvudet, backhand, Ju jodan uchi uke, irimi nage - Ude osae, ude osae gatame', '');
INSERT INTO technique (name, description) VALUES ('Randori mot två motståndare (4 Dan)', '');
INSERT INTO technique (name, description) VALUES ('Randori mot en motståndare som angriper med kniv(4 Dan)', '');
INSERT INTO technique (name, description) VALUES ('Goshin jutsu no kata (4 Dan)', '');
INSERT INTO technique (name, description) VALUES ('Kime no kata (5 Dan)', '');
INSERT INTO technique (name, description) VALUES ('Randori mot två motståndare (5 Dan)', '');

--
-- INSERTS FOR TECHNIQUES TO BELT
--

INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (11, 1);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (11, 2);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (11, 3);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (11, 4);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (11, 5);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (11, 6);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (11, 7);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (11, 8);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (11, 9);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (11, 10);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (11, 11);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (11, 12);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (11, 13);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (11, 14);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (11, 15);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (11, 16);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (11, 17);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (11, 18);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (11, 19);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (11, 20);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (11, 21);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (11, 22);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (11, 23);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (11, 24);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (11, 25);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (11, 26);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (11, 27);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (11, 28);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (11, 29);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (11, 30);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (11, 31);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (11, 32);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (11, 33);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (11, 34);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (11, 35);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (11, 36);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 37);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 38);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 39);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 40);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 41);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 42);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 43);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 44);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 45);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 46);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 47);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 48);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 49);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 50);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 51);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 52);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 53);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 54);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 55);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 56);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 57);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 58);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 59);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 60);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 61);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 62);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 63);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 64);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 65);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 66);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 67);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 68);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 69);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 70);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 71);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 72);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 73);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 74);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 75);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 76);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 77);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 78);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 79);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 80);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 81);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 82);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 83);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 84);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 85);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 86);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 87);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 88);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 89);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 90);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 91);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 92);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 93);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 94);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 95);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 96);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 97);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 98);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 99);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 100);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 101);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 102);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 103);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 104);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 105);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 106);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 107);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 108);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 109);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 110);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 111);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 112);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 113);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 114);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 115);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 116);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 117);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 118);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 119);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 120);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 121);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 122);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 123);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 124);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 125);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 126);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 127);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 128);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 129);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 130);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 131);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 132);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 133);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 134);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 135);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 136);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 137);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (3, 138);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (3, 139);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (3, 140);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (3, 141);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (3, 142);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (3, 143);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (3, 144);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (3, 145);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (3, 146);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (3, 147);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (3, 148);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (3, 149);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (3, 150);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (3, 151);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (3, 152);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (3, 153);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (3, 154);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (3, 155);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (3, 156);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (3, 157);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (3, 158);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (3, 159);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (3, 160);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (3, 161);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (3, 162);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (3, 163);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (3, 164);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (3, 165);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (3, 166);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (3, 167);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (3, 168);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (3, 169);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (3, 170);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (3, 171);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (3, 172);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (3, 173);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (3, 174);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (3, 175);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (3, 176);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (3, 177);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (3, 178);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (5, 179);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (5, 180);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (5, 181);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (5, 182);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (5, 183);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (5, 184);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (5, 185);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (5, 186);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (5, 187);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (5, 188);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (5, 189);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (5, 190);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (5, 191);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (5, 192);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (5, 193);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (5, 194);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (5, 195);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (5, 196);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (5, 197);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (5, 198);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (5, 199);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (5, 200);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (5, 201);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (5, 202);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (5, 203);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (5, 204);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (5, 205);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (5, 206);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (5, 207);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (5, 208);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (5, 209);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (5, 210);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (5, 211);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (5, 212);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (5, 213);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (7, 214);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (7, 215);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (7, 216);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (7, 217);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (7, 218);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (7, 219);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (7, 220);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (7, 221);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (7, 222);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (7, 223);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (7, 224);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (7, 225);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (7, 226);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (7, 227);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (7, 228);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (7, 229);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (7, 230);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (7, 231);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (7, 232);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (7, 233);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (7, 234);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (7, 235);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (7, 236);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (7, 237);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (7, 238);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (7, 239);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (7, 240);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (7, 241);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (7, 242);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (7, 243);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (7, 244);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (7, 245);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (7, 246);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (7, 247);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (9, 248);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (9, 249);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (9, 250);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (9, 251);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (9, 252);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (9, 253);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (9, 254);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (9, 255);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (9, 256);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (9, 257);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (9, 258);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (9, 259);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (9, 260);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (9, 261);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (9, 262);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (9, 263);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (9, 264);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (9, 265);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (9, 266);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (9, 267);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (9, 268);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (9, 269);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (9, 270);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (9, 271);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (9, 272);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (9, 273);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (9, 274);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (9, 275);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (9, 276);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (9, 277);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (9, 278);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (9, 279);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 280);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 281);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 282);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 283);
INSERT INTO technique_to_belt (belt_id, technique_id) VALUES (13, 284);
--
-- INSERTS FOR TECHNIQUES TAG
--

INSERT INTO technique_tag (tech_id, tag_id) VALUES (1, 1);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (1, 2);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (1, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (2, 1);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (2, 2);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (2, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (3, 1);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (3, 2);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (3, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (4, 1);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (4, 4);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (4, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (5, 1);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (5, 4);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (5, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (6, 1);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (6, 5);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (6, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (7, 1);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (7, 5);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (7, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (8, 1);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (8, 6);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (8, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (9, 1);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (9, 6);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (9, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (10, 1);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (10, 7);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (11, 1);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (11, 8);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (12, 1);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (12, 8);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (13, 1);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (13, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (14, 1);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (14, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (15, 1);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (15, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (16, 1);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (16, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (17, 1);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (17, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (18, 1);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (18, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (19, 1);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (19, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (20, 1);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (20, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (21, 1);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (21, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (22, 1);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (22, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (23, 1);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (23, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (24, 1);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (24, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (25, 1);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (25, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (26, 1);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (26, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (27, 1);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (27, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (28, 1);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (28, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (29, 1);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (29, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (30, 1);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (30, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (31, 1);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (31, 10);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (32, 1);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (32, 10);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (33, 1);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (33, 10);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (34, 1);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (34, 10);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (35, 1);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (35, 10);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (36, 1);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (36, 10);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (37, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (37, 12);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (37, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (37, 2);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (38, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (38, 12);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (38, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (38, 2);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (39, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (39, 12);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (39, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (39, 4);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (40, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (40, 12);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (40, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (40, 4);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (41, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (41, 12);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (41, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (41, 4);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (42, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (42, 12);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (42, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (42, 13);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (43, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (43, 12);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (43, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (43, 13);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (44, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (44, 12);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (44, 7);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (45, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (45, 12);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (45, 8);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (46, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (46, 12);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (46, 8);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (47, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (47, 12);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (47, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (48, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (48, 12);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (48, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (49, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (49, 12);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (49, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (50, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (50, 12);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (50, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (51, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (51, 12);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (51, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (52, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (52, 12);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (52, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (53, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (53, 12);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (53, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (54, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (54, 12);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (54, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (55, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (55, 12);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (55, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (56, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (56, 12);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (56, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (57, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (57, 12);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (57, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (58, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (58, 12);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (58, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (59, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (59, 12);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (59, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (60, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (60, 12);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (60, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (61, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (61, 12);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (61, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (62, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (62, 12);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (62, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (63, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (63, 12);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (63, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (64, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (64, 12);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (64, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (65, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (65, 12);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (65, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (66, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (66, 12);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (66, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (67, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (67, 12);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (67, 10);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (68, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (68, 12);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (68, 10);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (69, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (69, 12);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (69, 10);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (70, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (70, 12);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (70, 10);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (71, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (71, 12);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (71, 10);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (72, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (72, 12);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (72, 10);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (73, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (73, 14);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (73, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (73, 2);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (74, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (74, 14);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (74, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (74, 4);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (75, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (75, 14);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (75, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (75, 4);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (76, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (76, 14);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (76, 7);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (77, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (77, 14);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (77, 8);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (78, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (78, 14);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (78, 8);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (79, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (79, 14);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (79, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (80, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (80, 14);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (80, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (81, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (81, 14);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (81, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (82, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (82, 14);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (82, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (83, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (83, 14);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (83, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (84, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (84, 14);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (84, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (85, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (85, 14);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (85, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (86, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (86, 14);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (86, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (87, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (87, 14);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (87, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (88, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (88, 14);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (88, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (89, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (89, 14);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (89, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (90, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (90, 14);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (90, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (91, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (91, 14);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (91, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (92, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (92, 14);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (92, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (93, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (93, 14);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (93, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (94, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (94, 14);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (94, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (95, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (95, 14);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (95, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (96, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (96, 14);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (96, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (97, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (97, 14);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (97, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (98, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (98, 14);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (98, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (99, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (99, 14);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (99, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (100, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (100, 14);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (100, 10);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (101, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (101, 14);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (101, 10);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (102, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (102, 14);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (102, 10);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (103, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (103, 14);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (103, 10);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (104, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (104, 14);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (104, 10);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (105, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (105, 14);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (105, 10);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (106, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (106, 14);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (106, 10);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (107, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (107, 15);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (107, 7);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (108, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (108, 15);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (108, 8);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (109, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (109, 15);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (109, 8);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (110, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (110, 15);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (110, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (111, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (111, 15);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (111, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (112, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (112, 15);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (112, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (113, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (113, 15);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (113, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (114, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (114, 15);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (114, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (115, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (115, 15);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (115, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (116, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (116, 15);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (116, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (117, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (117, 15);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (117, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (118, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (118, 15);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (118, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (119, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (119, 15);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (119, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (120, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (120, 15);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (120, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (121, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (121, 15);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (121, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (122, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (122, 15);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (122, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (123, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (123, 15);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (123, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (124, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (124, 15);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (124, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (125, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (125, 15);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (125, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (126, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (126, 15);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (126, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (127, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (127, 15);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (127, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (128, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (128, 15);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (128, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (129, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (129, 15);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (129, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (130, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (130, 15);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (130, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (131, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (131, 15);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (131, 10);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (132, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (132, 15);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (132, 10);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (133, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (133, 15);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (133, 10);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (134, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (134, 15);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (134, 10);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (135, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (135, 15);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (135, 10);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (136, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (136, 15);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (136, 10);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (137, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (137, 15);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (137, 10);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (138, 16);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (138, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (138, 17);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (139, 16);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (139, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (139, 17);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (140, 16);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (140, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (140, 17);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (141, 16);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (141, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (141, 18);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (142, 16);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (142, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (142, 18);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (143, 16);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (143, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (143, 18);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (144, 16);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (144, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (144, 18);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (145, 16);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (145, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (145, 18);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (146, 16);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (146, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (146, 19);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (147, 16);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (147, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (147, 20);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (148, 16);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (148, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (148, 20);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (149, 16);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (149, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (149, 20);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (150, 16);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (150, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (150, 20);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (151, 16);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (151, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (151, 2);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (152, 16);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (152, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (152, 2);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (153, 16);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (153, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (153, 2);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (154, 16);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (154, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (154, 4);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (155, 16);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (155, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (155, 6);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (156, 16);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (156, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (156, 6);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (157, 16);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (157, 8);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (158, 16);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (158, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (159, 16);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (159, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (160, 16);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (160, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (161, 16);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (161, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (162, 16);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (162, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (163, 16);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (163, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (164, 16);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (164, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (165, 16);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (165, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (166, 16);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (166, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (167, 16);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (167, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (168, 16);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (168, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (169, 16);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (169, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (170, 16);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (170, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (171, 16);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (171, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (172, 16);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (172, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (173, 16);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (173, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (174, 16);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (174, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (175, 16);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (175, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (176, 16);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (176, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (177, 16);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (177, 10);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (178, 16);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (178, 10);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (179, 21);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (179, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (179, 19);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (180, 21);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (180, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (180, 19);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (181, 21);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (181, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (181, 20);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (182, 21);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (182, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (182, 20);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (183, 21);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (183, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (183, 20);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (184, 21);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (184, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (184, 2);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (185, 21);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (185, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (185, 2);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (186, 21);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (186, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (186, 4);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (187, 21);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (187, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (187, 4);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (188, 21);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (188, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (188, 5);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (189, 21);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (189, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (189, 6);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (190, 21);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (190, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (190, 6);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (191, 21);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (191, 8);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (192, 21);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (192, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (193, 21);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (193, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (194, 21);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (194, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (195, 21);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (195, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (196, 21);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (196, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (197, 21);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (197, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (198, 21);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (198, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (199, 21);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (199, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (200, 21);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (200, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (201, 21);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (201, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (202, 21);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (202, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (203, 21);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (203, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (204, 21);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (204, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (205, 21);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (205, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (206, 21);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (206, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (207, 21);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (207, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (208, 21);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (208, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (209, 21);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (209, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (210, 21);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (210, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (211, 21);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (211, 10);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (212, 21);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (212, 10);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (213, 21);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (213, 10);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (214, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (214, 22);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (215, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (215, 22);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (216, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (216, 22);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (217, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (217, 22);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (218, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (218, 22);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (219, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (219, 22);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (220, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (220, 22);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (221, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (221, 22);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (222, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (222, 22);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (223, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (223, 22);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (224, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (224, 22);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (225, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (225, 22);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (226, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (226, 22);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (227, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (227, 22);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (228, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (228, 22);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (229, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (229, 22);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (230, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (230, 22);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (231, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (231, 22);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (232, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (232, 22);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (233, 10);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (233, 22);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (234, 10);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (234, 22);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (235, 10);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (235, 22);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (236, 22);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (236, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (236, 19);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (237, 22);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (237, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (237, 20);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (238, 22);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (238, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (238, 20);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (239, 22);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (239, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (239, 2);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (240, 22);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (240, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (240, 2);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (241, 22);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (241, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (241, 4);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (242, 22);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (242, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (242, 4);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (243, 22);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (243, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (243, 5);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (244, 22);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (244, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (244, 5);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (245, 22);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (245, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (245, 6);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (246, 22);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (246, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (246, 6);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (247, 22);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (247, 8);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (248, 23);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (248, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (248, 19);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (249, 23);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (249, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (249, 20);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (250, 23);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (250, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (250, 2);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (251, 23);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (251, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (251, 2);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (252, 23);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (252, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (252, 2);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (253, 23);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (253, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (253, 4);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (254, 23);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (254, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (254, 4);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (255, 23);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (255, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (255, 5);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (256, 23);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (256, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (256, 6);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (257, 23);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (257, 8);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (258, 23);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (258, 8);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (259, 23);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (259, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (260, 23);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (260, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (261, 23);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (261, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (262, 23);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (262, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (263, 23);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (263, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (264, 23);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (264, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (265, 23);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (265, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (266, 23);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (266, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (267, 23);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (267, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (268, 23);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (268, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (269, 23);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (269, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (270, 23);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (270, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (271, 23);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (271, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (272, 23);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (272, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (273, 23);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (273, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (274, 23);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (274, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (275, 23);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (275, 9);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (276, 23);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (276, 10);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (277, 23);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (277, 10);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (278, 23);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (278, 10);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (279, 23);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (279, 10);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (280, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (280, 8);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (281, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (281, 8);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (282, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (282, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (282, 7);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (283, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (283, 3);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (283, 7);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (284, 11);
INSERT INTO technique_tag (tech_id, tag_id) VALUES (284, 8);


--
-- CONVERT WORKOUTS FROM JSON BEGINNING
--


--
-- INSERTS FOR WORKOUTS
--

INSERT INTO workout (workout_name, workout_desc, workout_duration, workout_created, workout_changed, workout_date, workout_hidden, workout_author) VALUES ('Basic Judo Throws', 'This Judo workout focuses on practicing basic throws such as the hip throw, shoulder throw, and foot sweep. It includes both solo and partner drills to improve technique and timing.', 90, '2023-04-29', '2023-05-02', '2023-04-30', False, 1);
INSERT INTO workout (workout_name, workout_desc, workout_duration, workout_created, workout_changed, workout_date, workout_hidden, workout_author) VALUES ('Judo Randori', 'In this Judo workout, you will participate in randori, which is a form of sparring. The focus is on applying techniques learned in class in a live situation. The workout includes both standing and ground techniques.', 76, '2023-04-30', '2023-05-02', '2023-05-01', False, 1);
INSERT INTO workout (workout_name, workout_desc, workout_duration, workout_created, workout_changed, workout_date, workout_hidden, workout_author) VALUES ('Judo Footwork Drills', 'This Judo workout focuses on footwork drills to improve balance and movement. The drills include various shuffles, steps, and pivots to help develop better footwork on the mat.', 45, '2023-05-01', '2023-05-03', '2023-05-02', False, 1);

--
-- INSERTS FOR WORKOUTS TAG
--

INSERT INTO workout_tag (work_id, tag_id) VALUES(1, 24);
INSERT INTO workout_tag (work_id, tag_id) VALUES(1, 25);
INSERT INTO workout_tag (work_id, tag_id) VALUES(2, 24);
INSERT INTO workout_tag (work_id, tag_id) VALUES(3, 24);
INSERT INTO workout_tag (work_id, tag_id) VALUES(3, 26);

--
-- INSERTS FOR WORKOUT FAVOURITES
--

INSERT INTO workout_favorite (workout_id, user_id) VALUES (1, 1);
INSERT INTO workout_favorite (workout_id, user_id) VALUES (3, 1);


--
-- CONVERT EXERCISES FROM JSON -- BEGINNING
--


--
-- INSERTS FOR EXERCISE
--

INSERT INTO exercise (name, description, duration) VALUES ('Springa', 'Placera ena foten framför den andra och upprepa!', 10);
INSERT INTO exercise (name, description, duration) VALUES ('Burpees', 'Börja ståendes, gör en armhävning, hoppa upp och klappa händerna över huvudet!', 30);
INSERT INTO exercise (name, description, duration) VALUES ('Jumping Jacks', 'Hoppa upp och brett isär benen samtidigt som du tar armarna upp ovanför huvudet, hoppa sedan tillbaka till startpositionen!', 20);
INSERT INTO exercise (name, description, duration) VALUES ('Squats', 'Stå med fötterna axelbrett isär och gå ner i en knäböj tills låren är parallella med golvet, res dig upp igen!', 15);

--
-- INSERTS FOR EXERCISE TAG
--

INSERT INTO exercise_tag (ex_id, tag_id) VALUES (285, 27);
INSERT INTO exercise_tag (ex_id, tag_id) VALUES (285, 28);
INSERT INTO exercise_tag (ex_id, tag_id) VALUES (286, 27);
INSERT INTO exercise_tag (ex_id, tag_id) VALUES (286, 28);
INSERT INTO exercise_tag (ex_id, tag_id) VALUES (287, 27);
INSERT INTO exercise_tag (ex_id, tag_id) VALUES (287, 28);
INSERT INTO exercise_tag (ex_id, tag_id) VALUES (287, 29);
INSERT INTO exercise_tag (ex_id, tag_id) VALUES (288, 29);
INSERT INTO exercise_tag (ex_id, tag_id) VALUES (288, 28);


--
-- CONVERT PLANS FROM JSON -- BEGINNING
--


--
-- INSERTS FOR PLANS
--

INSERT INTO plan (name, color, user_id) VALUES ('Grönt bälte träning', '', 1);
INSERT INTO plan (name, color, user_id) VALUES ('Orange och Gult bälte träning', '', 1);
INSERT INTO plan (name, color, user_id) VALUES ('Svart bälte träning', '', 1);
INSERT INTO plan (name, color, user_id) VALUES ('Gult bälte träning', '', 1);
INSERT INTO plan (name, color, user_id) VALUES ('Brunt bälte träning', '', 1);

--
-- INSERTS FOR PLANS TO BELT
--

INSERT INTO plan_to_belt (belt_id, plan_id) VALUES (7, 1);
INSERT INTO plan_to_belt (belt_id, plan_id) VALUES (9, 2);
INSERT INTO plan_to_belt (belt_id, plan_id) VALUES (5, 2);
INSERT INTO plan_to_belt (belt_id, plan_id) VALUES (13, 3);
INSERT INTO plan_to_belt (belt_id, plan_id) VALUES (3, 4);
INSERT INTO plan_to_belt (belt_id, plan_id) VALUES (11, 5);


--
-- CONVERT WORKOUT REVIEWS FROM JSON BEGINNING
--


--
-- INSERTS FOR WORKOUTS REVIEWS
--

INSERT INTO workout_review (workout_id, user_id, rating, positive_comment, negative_comment, review_date) VALUES (1, 1, 5, 'Det var hög närvaro', 'Inget gick dåligt!', '2023-04-30');
INSERT INTO workout_review (workout_id, user_id, rating, positive_comment, negative_comment, review_date) VALUES (3, 1, 2, 'Inget gick bra :/', 'Alla bara va sämst idag...', '2023-05-03');


--
-- CONVERT WORKOUTS FROM JSON BEGINNING
--


--
-- INSERTS FOR ACTIVITIES
--

INSERT INTO activity (workout_id, exercise_id, technique_id, category_name, category_order, activity_name, activity_desc, activity_duration, activity_order) VALUES (1, 285, null, 'Uppvärmning', 1, 'Uppvärmning Springa', 'Springa i 10 minuter', 10, 1);
INSERT INTO activity (workout_id, exercise_id, technique_id, category_name, category_order, activity_name, activity_desc, activity_duration, activity_order) VALUES (1, 286, null, 'Uppvärmning', 1, 'Uppvärmning Burpees', 'Burpees i 5 minuter', 5, 2);
INSERT INTO activity (workout_id, exercise_id, technique_id, category_name, category_order, activity_name, activity_desc, activity_duration, activity_order) VALUES (1, null, 7, 'Träning', 2, 'Empi uchi träning', 'Empi uchi i 15 minuter', 15, 1);
INSERT INTO activity (workout_id, exercise_id, technique_id, category_name, category_order, activity_name, activity_desc, activity_duration, activity_order) VALUES (1, null, 8, 'Träning', 2, 'Waki gatame träning', 'Waki gatame i 5 minuter', 5, 2);
INSERT INTO activity (workout_id, exercise_id, technique_id, category_name, category_order, activity_name, activity_desc, activity_duration, activity_order) VALUES (1, null, 8, 'Träning', 2, 'Waki gatame träning', 'Waki gatame i 7 minuter', 7, 3);
INSERT INTO activity (workout_id, exercise_id, technique_id, category_name, category_order, activity_name, activity_desc, activity_duration, activity_order) VALUES (1, null, 8, 'Avslut', 3, 'Waki gatame träning', 'Avsluta med Waki gatame i 15 minuter', 15, 4);
INSERT INTO activity (workout_id, exercise_id, technique_id, category_name, category_order, activity_name, activity_desc, activity_duration, activity_order) VALUES (2, 286, null, 'Uppvärmning', 1, 'Uppvärmning Burpees', 'Burpees i 5 minuter', 5, 1);
INSERT INTO activity (workout_id, exercise_id, technique_id, category_name, category_order, activity_name, activity_desc, activity_duration, activity_order) VALUES (2, 287, null, 'Uppvärmning', 1, 'Uppvärmning Jumping Jacks', 'Jumping Jacks i 15 minuter', 15, 2);
INSERT INTO activity (workout_id, exercise_id, technique_id, category_name, category_order, activity_name, activity_desc, activity_duration, activity_order) VALUES (2, null, 8, 'Träning', 2, 'Empi uchi träning', 'Empi uchi i 15 minuter', 15, 1);
INSERT INTO activity (workout_id, exercise_id, technique_id, category_name, category_order, activity_name, activity_desc, activity_duration, activity_order) VALUES (2, null, 6, 'Träning', 2, 'Waki gatame träning', 'Waki gatame i 5 minuter', 5, 2);
INSERT INTO activity (workout_id, exercise_id, technique_id, category_name, category_order, activity_name, activity_desc, activity_duration, activity_order) VALUES (2, null, 6, 'Träning', 2, 'Waki gatame träning', 'Waki gatame i 7 minuter', 7, 3);
INSERT INTO activity (workout_id, exercise_id, technique_id, category_name, category_order, activity_name, activity_desc, activity_duration, activity_order) VALUES (2, null, 6, 'Avslut', 3, 'Waki gatame träning', 'Avsluta med Waki gatame i 15 minuter', 15, 4);
INSERT INTO activity (workout_id, exercise_id, technique_id, category_name, category_order, activity_name, activity_desc, activity_duration, activity_order) VALUES (3, null, null, 'Träning', 1, 'Empi uchi träning', 'Empi uchi i 15 minuter', 15, 1);
INSERT INTO activity (workout_id, exercise_id, technique_id, category_name, category_order, activity_name, activity_desc, activity_duration, activity_order) VALUES (3, null, 2, 'Träning', 1, 'Waki gatame träning', 'Waki gatame i 5 minuter', 5, 2);
INSERT INTO activity (workout_id, exercise_id, technique_id, category_name, category_order, activity_name, activity_desc, activity_duration, activity_order) VALUES (3, null, 2, 'Träning', 1, 'Waki gatame träning', 'Waki gatame i 7 minuter', 7, 3);
INSERT INTO activity (workout_id, exercise_id, technique_id, category_name, category_order, activity_name, activity_desc, activity_duration, activity_order) VALUES (3, null, 2, 'Avslut', 2, 'Waki gatame träning', 'Avsluta med Waki gatame i 15 minuter', 15, 4);


--
-- CONVERT SESSIONS FROM JSON -- BEGINNING
--


--
-- INSERTS FOR SESSION
--

INSERT INTO session (text, workout_id, plan_id, date, time) VALUES ('Junior Grönt Bälte Träning', 2, 1, '2023-04-01', '12:00');
INSERT INTO session (text, workout_id, plan_id, date, time) VALUES ('Intermediate Judo träning', 3, 2, '2023-04-02', '14:00');
INSERT INTO session (text, workout_id, plan_id, date, time) VALUES ('Beginner Judo träning', 3, 1, '2023-04-03', '10:00');
INSERT INTO session (text, workout_id, plan_id, date, time) VALUES ('Black Belt Judo träning', 2, 3, '2023-04-04', '16:00');
INSERT INTO session (text, workout_id, plan_id, date, time) VALUES ('Senior Judo träning', 3, 3, '2023-04-05', '18:00');
INSERT INTO session (text, workout_id, plan_id, date, time) VALUES ('Advanced Judo träning', 2, 3, '2023-04-06', '08:00');
INSERT INTO session (text, workout_id, plan_id, date, time) VALUES ('Junior Judo träning', 1, 1, '2023-04-07', '20:00');
INSERT INTO session (text, workout_id, plan_id, date, time) VALUES ('Judo Fitness träning', 1, 2, '2023-04-08', '06:00');
INSERT INTO session (text, workout_id, plan_id, date, time) VALUES ('Judo Techniques Practice', 3, 1, '2023-04-09', '16:00');
INSERT INTO session (text, workout_id, plan_id, date, time) VALUES ('Judo Kata Practice', 2, 2, '2023-04-10', '08:00');
INSERT INTO session (text, workout_id, plan_id, date, time) VALUES ('Judo Fitness träning', 1, 4, '2023-04-08', '06:00');
INSERT INTO session (text, workout_id, plan_id, date, time) VALUES ('Judo teknik övningar', 3, 4, '2023-04-09', '16:00');
INSERT INTO session (text, workout_id, plan_id, date, time) VALUES ('Judo Kata övning', 2, 4, '2023-04-10', '08:00');
INSERT INTO session (text, workout_id, plan_id, date, time) VALUES ('Judo Fitness träning', 1, 5, '2023-04-08', '06:00');
INSERT INTO session (text, workout_id, plan_id, date, time) VALUES ('Judo teknik övningar', 3, 5, '2023-04-09', '16:00');
INSERT INTO session (text, workout_id, plan_id, date, time) VALUES ('Judo Kata övning', 2, 5, '2023-04-10', '08:00');
INSERT INTO session (text, workout_id, plan_id, date, time) VALUES ('Judo Fitness träning', 1, 3, '2023-04-08', '06:00');
INSERT INTO session (text, workout_id, plan_id, date, time) VALUES ('Judo teknik övningar', 3, 3, '2023-04-09', '16:00');
INSERT INTO session (text, workout_id, plan_id, date, time) VALUES ('Judo Kata övning', 2, 3, '2023-04-10', '08:00');

--
-- Triggers
--
CREATE OR REPLACE FUNCTION remove_user_references() RETURNS TRIGGER AS $$
       BEGIN
              DELETE FROM workout WHERE workout_hidden = TRUE AND workout_author = OLD.user_id;
              UPDATE workout SET workout_author = 1 WHERE workout_author = OLD.user_id;
              UPDATE plan SET user_id = 1 WHERE user_id = OLD.user_id;
              UPDATE comments SET user_id = 1 WHERE user_id = OLD.user_id;
              RETURN OLD;
       END;
       $$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION no_duplicate_category() RETURNS TRIGGER AS $$
       BEGIN
	     IF EXISTS (SELECT * FROM activity as A WHERE A.workout_id = NEW.workout_id AND A.category_order = NEW.category_order AND A.category_name <> NEW.category_name) THEN 
		RAISE EXCEPTION 'Cannot have two categories with the same order in the same workout!';
	     ELSE 
		RETURN NEW;
	     END IF;	
       END;
       $$ LANGUAGE 'plpgsql';

CREATE TRIGGER check_order BEFORE INSERT ON activity FOR EACH ROW EXECUTE PROCEDURE no_duplicate_category();


CREATE TRIGGER remove_user BEFORE DELETE ON user_table FOR EACH ROW EXECUTE PROCEDURE remove_user_references();
