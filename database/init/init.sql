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
       technique_id INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
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
       exercise_id INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
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
        REFERENCES workout(workout_id),
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
       workout_id INT CHECK (workout_id IS NULL OR
        (workout_id IS NOT NULL and exercise_id IS NULL)),
       exercise_id INT CHECK (exercise_id IS NULL OR
        (exercise_id IS NOT NULL and workout_id IS NULL)),
       CONSTRAINT comment_fk_workout_id FOREIGN KEY(workout_id)
        REFERENCES workout(workout_id) ON DELETE CASCADE,
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
-- Name: techniques_url; Type: TABLE; Schema: public; Owner: psql
--
CREATE TABLE techniques_url (
       media_url TEXT PRIMARY KEY,
       technique_id INT NOT NULL REFERENCES technique(technique_id) ON DELETE CASCADE
);
ALTER TABLE techniques_url OWNER TO psql;

--
-- Inserts
--
INSERT INTO user_table(username, password, user_role)
       VALUES ('admin', '1000:b7fdda8fd62b8bb1b602d39f3b4175ab:2793a42fdc4552496d82ad442794cd2aa246945a5958173104b44f194feddfe59e47871825b76240728125ab4b96cb8ad3ba54496762230990dbcef47d4b6461', 0
);

INSERT INTO tag(name)
       VALUES ('Kihon');

INSERT INTO belt(belt_name, belt_color, is_child)
       VALUES ('Svart', '000000', FALSE);
INSERT INTO belt(belt_name, belt_color, is_child)
       VALUES ('Svart', '000000', TRUE);

INSERT INTO belt(belt_name, belt_color, is_child)
       VALUES ('Brunt', '964B00', FALSE);
INSERT INTO belt(belt_name, belt_color, is_child)
       VALUES ('Brunt', '964B00', TRUE);

INSERT INTO belt(belt_name, belt_color, is_child)
       VALUES ('Blått', '0000FF', FALSE);
INSERT INTO belt(belt_name, belt_color, is_child)
       VALUES ('Blått', '0000FF', TRUE);

INSERT INTO belt(belt_name, belt_color, is_child)
       VALUES ('Grönt', '00FF00', FALSE);
INSERT INTO belt(belt_name, belt_color, is_child)
       VALUES ('Grönt', '00FF00', TRUE);

INSERT INTO belt(belt_name, belt_color, is_child)
       VALUES ('Orange', 'FFA500', FALSE);
INSERT INTO belt(belt_name, belt_color, is_child)
       VALUES ('Orange', 'FFA500', TRUE);

INSERT INTO belt(belt_name, belt_color, is_child)
       VALUES ('Gult', 'FFFF00', FALSE);
INSERT INTO belt(belt_name, belt_color, is_child)
       VALUES ('Gult', 'FFFF00', TRUE);

INSERT INTO belt(belt_name, belt_color, is_child)
       VALUES ('Vitt', 'FFFFFF', FALSE);
INSERT INTO belt(belt_name, belt_color, is_child)
       VALUES ('Vitt', 'FFFFFF', TRUE);

--
-- Trigger
--
CREATE OR REPLACE FUNCTION remove_user_references() RETURNS TRIGGER AS $$
       BEGIN
              DELETE FROM workout WHERE workout_hidden = TRUE AND workout_author = OLD.user_id;
              UPDATE workout SET workout_author = 1 WHERE workout_author = OLD.user_id;
              UPDATE plan SET user_id = 1 WHERE user_id = OLD.user_id;
              RETURN OLD;
       END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER remove_user BEFORE DELETE ON user_table FOR EACH ROW EXECUTE PROCEDURE remove_user_references();
