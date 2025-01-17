--
-- Init Yotei DB
--

-- "Konstant" för admin roll
CREATE
OR REPLACE FUNCTION admin_role_id() RETURNS INT AS $$ BEGIN RETURN 1;

END;

$$ LANGUAGE 'plpgsql' IMMUTABLE PARALLEL SAFE;

-- "Konstant" för admin rättighet
CREATE
OR REPLACE FUNCTION admin_permission_id() RETURNS INT AS $$ BEGIN RETURN 1;

END;

$$ LANGUAGE 'plpgsql' IMMUTABLE PARALLEL SAFE;

-- "Konstant" för editor roll
CREATE
OR REPLACE FUNCTION editor_role_id() RETURNS INT AS $$ BEGIN RETURN 2;

END;

$$ LANGUAGE 'plpgsql' IMMUTABLE PARALLEL SAFE;

-- "Konstant" för user roll
CREATE
OR REPLACE FUNCTION user_role_id() RETURNS INT AS $$ BEGIN RETURN 0;

END;

$$ LANGUAGE 'plpgsql' IMMUTABLE PARALLEL SAFE;

-- Inställningar (justera gärna :-))
SET statement_timeout = 0;

SET lock_timeout = 0;

SET idle_in_transaction_session_timeout = 0;

SET client_encoding = 'UTF8';

SET standard_conforming_strings = on;

SELECT pg_catalog.set_config ('search_path', '', false);

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

DROP TABLE IF EXISTS examination_grading CASCADE;

DROP TABLE IF EXISTS examination_examinee CASCADE;

DROP TABLE IF EXISTS examination_examinee_pair CASCADE;

DROP TABLE IF EXISTS examination_result CASCADE;

DROP TABLE IF EXISTS examination_comment CASCADE;

DROP TABLE IF EXISTS grading_protocol CASCADE;

DROP TABLE IF EXISTS activity CASCADE;

DROP TABLE IF EXISTS tag CASCADE;

DROP TABLE IF EXISTS user_workout CASCADE;

DROP TABLE IF EXISTS workout CASCADE;

DROP TABLE IF EXISTS technique CASCADE;

DROP TABLE IF EXISTS techniques_url CASCADE;

DROP TABLE IF EXISTS exercise CASCADE;

DROP TABLE IF EXISTS user_table CASCADE;

DROP TABLE IF EXISTS user_to_permission CASCADE;

DROP TABLE IF EXISTS role CASCADE;

DROP TABLE IF EXISTS permission CASCADE;

DROP TABLE IF EXISTS role_to_permission CASCADE;

DROP TABLE IF EXISTS comments CASCADE;

DROP TABLE IF EXISTS plan CASCADE;

DROP TABLE IF EXISTS session_review_activity;

DROP TABLE IF EXISTS session CASCADE;

DROP TABLE IF EXISTS workout_favorite CASCADE;

DROP TABLE IF EXISTS workout_review CASCADE;

DROP TABLE IF EXISTS technique_review CASCADE;

DROP TABLE IF EXISTS user_settings CASCADE;

DROP TABLE IF EXISTS user_to_plan CASCADE;

DROP TABLE IF EXISTS belt CASCADE;

DROP TABLE IF EXISTS plan_to_belt CASCADE;

DROP TABLE IF EXISTS technique_to_belt CASCADE;

DROP TABLE IF EXISTS error_log CASCADE;

DROP TABLE IF EXISTS media CASCADE;

DROP TABLE IF EXISTS session_review;

DROP TABLE IF EXISTS grading_protocol;

DROP TABLE IF EXISTS grading_protocol_category;

DROP TABLE IF EXISTS technique_chain CASCADE;

DROP TABLE IF EXISTS edges CASCADE;

DROP TABLE IF EXISTS weave_representation;

DROP TABLE IF EXISTS node CASCADE;

DROP TABLE IF EXISTS technique_weave CASCADE;

DROP TABLE IF EXISTS in_chain;

DROP SEQUENCE IF EXISTS belt_succession;

DROP SEQUENCE IF EXISTS serial;

DROP SEQUENCE IF EXISTS serialEx;

-- We start exercies from ID 1 to allow easier changes to the init-scripts
CREATE SEQUENCE serial START WITH 1 INCREMENT BY 1;

CREATE SEQUENCE serialEx START WITH 1000 INCREMENT BY 1;

-- TODO: Lägg till dessa till alla CREATE TABLE (vet inte om det finns bättre lösning)
-- ENCODING 'UTF8'
-- LC_COLLATE = 'sv-SE'
-- LC_CTYPE = 'sv-SE'
--
-- Name: tag; Type: TABLE; Schema: public; Owner: psql
--
CREATE TABLE tag (
    tag_id INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) UNIQUE
);

ALTER TABLE tag OWNER TO psql;

--
-- Name: technique; Type: TABLE; Schema: public; Owner: psql
--
CREATE TABLE technique (
    technique_id INT DEFAULT nextval ('serial') PRIMARY KEY,
    name VARCHAR(255) UNIQUE,
    description TEXT
);

ALTER TABLE technique OWNER TO psql;

--
-- Name: role; Type: TABLE; Schema: public; Owner: psql
--
CREATE TABLE role (
    role_id INT NOT NULL GENERATED ALWAYS AS IDENTITY UNIQUE,
    role_name VARCHAR(255) NOT NULL UNIQUE
);

ALTER TABLE role OWNER TO psql;

--
-- Name: user_table; Type: TABLE; Schema: public; Owner: psql
--
CREATE TABLE user_table (
    user_id INT NOT NULL GENERATED ALWAYS AS IDENTITY UNIQUE,
    username VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    role_id INT,
    CONSTRAINT ur_fk_role FOREIGN KEY (role_id) REFERENCES role (role_id) ON DELETE CASCADE
);

ALTER TABLE user_table OWNER TO psql;

--
-- Name: permission; Type: TABLE; Schema: public; Owner: psql
--
CREATE TABLE permission (
    permission_id INT NOT NULL GENERATED ALWAYS AS IDENTITY UNIQUE,
    permission_name VARCHAR(255) NOT NULL UNIQUE,
    permission_desc VARCHAR(255)
);

ALTER TABLE permission OWNER TO psql;

--
-- Name: user_to_permission (Mapping table); Type: TABLE; Schema: public; Owner: psql
--

CREATE TABLE user_to_permission (
    pair_id INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT NOT NULL,
    permission_id INT NOT NULL,
    CONSTRAINT up_fk_user_table FOREIGN KEY (user_id) REFERENCES user_table (user_id) ON DELETE CASCADE,
    CONSTRAINT up_fk_permission FOREIGN KEY (permission_id) REFERENCES permission (permission_id) ON DELETE CASCADE,
    UNIQUE (user_id, permission_id)
);

ALTER TABLE user_to_permission OWNER TO psql;
-- Name: role_to_permission; Type: TABLE; Schema: public; Owner: psql
--
CREATE TABLE IF NOT EXISTS role_to_permission (
    rp_id SERIAL PRIMARY KEY,
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    CONSTRAINT rp_fk_role FOREIGN KEY (role_id) REFERENCES role (role_id) ON DELETE CASCADE,
    CONSTRAINT rp_fk_permission FOREIGN KEY (permission_id) REFERENCES permission (permission_id) ON DELETE CASCADE,
    UNIQUE (role_id, permission_id)
);

ALTER TABLE role_to_permission OWNER TO psql;

--
-- Name: exercise; Type: TABLE; Schema: public; Owner: psql
--
CREATE TABLE exercise (
    exercise_id INT DEFAULT nextval ('serialEx') PRIMARY KEY,
    name VARCHAR(255) UNIQUE,
    description TEXT,
    duration INT
);

ALTER TABLE exercise OWNER TO psql;

--
-- Name: workout; Type: TABLE; Schema: public; Owner: psql
--
CREATE TABLE workout (
    workout_id INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    workout_name CHARACTER VARYING(180) NOT NULL,
    workout_desc TEXT,
    workout_duration INT NOT NULL,
    workout_created DATE NOT NULL,
    workout_changed DATE NOT NULL,
    workout_date TIMESTAMP NOT NULL,
    workout_hidden BOOLEAN NOT NULL,
    workout_author INT NOT NULL,
    CONSTRAINT workout_fk_user_table FOREIGN KEY (workout_author) REFERENCES user_table (user_id)
);

ALTER TABLE workout OWNER TO psql;

--
-- Name: user_workout (Mapping table); Type: TABLE; Schema: public; Owner: psql
--
CREATE TABLE user_workout (
    uw_id INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    workout_id INT NOT NULL,
    user_id INT NOT NULL,
    CONSTRAINT fk_workout_uw FOREIGN KEY (workout_id) REFERENCES workout (workout_id) ON DELETE CASCADE,
    CONSTRAINT fk_user_uw FOREIGN KEY (user_id) REFERENCES user_table (user_id) ON DELETE CASCADE
);

ALTER TABLE user_workout OWNER TO psql;

--
-- Name: activity; Type: TABLE; Schema: public; Owner: psql
--
CREATE TABLE activity (
    activity_id INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    workout_id INT,
    exercise_id INT,
    technique_id INT,
    category_name VARCHAR(255),
    category_order INT NOT NULL,
    activity_name VARCHAR(255) NOT NULL,
    activity_desc TEXT,
    activity_duration INT NOT NULL,
    activity_order INT NOT NULL,
    CONSTRAINT fk_exercise_activity FOREIGN KEY (exercise_id) REFERENCES exercise (exercise_id),
    CONSTRAINT fk_technique_activity FOREIGN KEY (technique_id) REFERENCES technique (technique_id),
    CONSTRAINT fk_workout_activity FOREIGN KEY (workout_id) REFERENCES workout (workout_id) ON DELETE CASCADE
);

ALTER TABLE activity OWNER TO psql;

---- Name: exercise_tag (Mapping table); Type: TABLE; Schema: public; Owner: psql

--
CREATE TABLE IF NOT EXISTS exercise_tag (
    exertag_id SERIAL PRIMARY KEY,
    ex_id INT NOT NULL,
    tag_id INT NOT NULL,
    CONSTRAINT et_fk_exercise FOREIGN KEY (ex_id) REFERENCES exercise (exercise_id) ON DELETE CASCADE,
    CONSTRAINT et_fk_tag FOREIGN KEY (tag_id) REFERENCES tag (tag_id) ON DELETE CASCADE,
    UNIQUE (ex_id, tag_id)
);

--
-- Name: technique_tag (Mapping table); Type: TABLE; Schema: public; Owner: psql
--
CREATE TABLE IF NOT EXISTS technique_tag (
    techtag_id SERIAL PRIMARY KEY,
    tech_id INT NOT NULL,
    tag_id INT NOT NULL,
    CONSTRAINT tt_fk_technique FOREIGN KEY (tech_id) REFERENCES technique (technique_id) ON DELETE CASCADE,
    CONSTRAINT tt_fk_tag_tech FOREIGN KEY (tag_id) REFERENCES tag (tag_id) ON DELETE CASCADE,
    UNIQUE (tech_id, tag_id)
);

--
-- Name: workout_tag (Mapping table); Type: TABLE; Schema: public; Owner: psql
--
CREATE TABLE workout_tag (
    worktag_id INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    work_id INT NOT NULL,
    tag_id INT NOT NULL,
    CONSTRAINT wt_fk_workout FOREIGN KEY (work_id) REFERENCES workout (workout_id) ON DELETE CASCADE,
    CONSTRAINT wt_fk_tag FOREIGN KEY (tag_id) REFERENCES tag (tag_Id) ON DELETE CASCADE,
    UNIQUE (work_id, tag_id)
);

ALTER TABLE workout_tag OWNER TO psql;

--
-- Name: workout_favorite; Type: TABLE; Schema: public; Owner: psql
--
CREATE TABLE workout_favorite (
    workout_id INT REFERENCES workout (workout_id) ON DELETE CASCADE,
    user_id INT REFERENCES user_table (user_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, workout_id)
);

ALTER TABLE workout_favorite OWNER TO psql;

--
-- Name: plan; Type: TABLE; Schema: public; Owner: psql
--
CREATE TABLE plan (
    plan_id INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(180) NOT NULL UNIQUE,
    user_id INT NOT NULL,
    CONSTRAINT plan_fk_user_id FOREIGN KEY (user_id) REFERENCES user_table (user_id)
);

ALTER TABLE plan OWNER TO psql;

--
-- Name: session; Type: TABLE; Schema: public; Owner: psql
--
CREATE TABLE session (
    session_id INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    text VARCHAR,
    workout_id INT,
    plan_id INT NOT NULL,
    date DATE NOT NULL,
    time TIME,
    CONSTRAINT session_fk_workout_id FOREIGN KEY (workout_id) REFERENCES workout (workout_id) ON DELETE SET NULL,
    CONSTRAINT session_fk_plan_id FOREIGN KEY (plan_id) REFERENCES plan (plan_id) ON DELETE CASCADE
);

ALTER TABLE session OWNER TO psql;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: psql
--
CREATE TABLE comments (
    comment_id INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    comment_text TEXT NOT NULL,
    user_id INT NOT NULL,
    created DATE NOT NULL,
    workout_id INT CHECK (
        workout_id IS NULL
        OR (
            workout_id IS NOT NULL
            and exercise_id IS NULL
        )
    ),
    exercise_id INT CHECK (
        exercise_id IS NULL
        OR (
            exercise_id IS NOT NULL
            and workout_id IS NULL
        )
    ),
    CONSTRAINT comment_fk_workout_id FOREIGN KEY (workout_id) REFERENCES workout (workout_id) ON DELETE CASCADE,
    CONSTRAINT comment_fk_user_id FOREIGN KEY (user_id) REFERENCES user_table (user_id),
    CONSTRAINT comment_fk_exercise_id FOREIGN KEY (exercise_id) REFERENCES exercise (exercise_id) ON DELETE CASCADE
);

ALTER TABLE comments OWNER TO psql;

--
-- Name: user_settings; Type: TABLE; Schema: public; Owner: psql
--
CREATE TABLE user_settings (
    user_id INT CHECK (user_id IS NOT NULL),
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES user_table (user_id) ON DELETE CASCADE
);

ALTER TABLE user_settings OWNER TO psql;

--
-- Name: user_to_plan (Mapping table); Type: TABLE; Schema: public; Owner: psql
--
CREATE TABLE user_to_plan (
    user_id INT CHECK (user_id IS NOT NULL),
    plan_id INT CHECK (plan_id IS NOT NULL),
    CONSTRAINT u2p_fk_user_id FOREIGN KEY (user_id) REFERENCES user_table (user_id) ON DELETE CASCADE,
    CONSTRAINT u2p_fk_plan_id FOREIGN KEY (plan_id) REFERENCES plan (plan_id) ON DELETE CASCADE
);

ALTER TABLE user_to_plan OWNER TO psql;

--
-- Name: workout_reviewType: TABLE; Schema: public; Owner: psql
--
CREATE TABLE workout_review (
    review_id INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    workout_id INT CHECK (workout_id IS NOT NULL),
    user_id INT CHECK (user_id IS NOT NULL),
    rating INT CHECK (rating IS NOT NULL),
    positive_comment TEXT,
    negative_comment TEXT,
    review_date TIMESTAMP NOT NULL,
    CONSTRAINT wr_fk_workout_id FOREIGN KEY (workout_id) REFERENCES workout (workout_id) ON DELETE CASCADE,
    CONSTRAINT wr_fk_user_id FOREIGN KEY (user_id) REFERENCES user_table (user_id) ON DELETE CASCADE
);

CREATE TABLE session_review (
    review_id INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    session_id INT CHECK (session_id IS NOT NULL),
    user_id INT CHECK (user_id IS NOT NULL),
    rating INT CHECK (rating IS NOT NULL),
    positive_comment TEXT,
    negative_comment TEXT,
    review_date TIMESTAMP NOT NULL,
    CONSTRAINT wr_fk_session_id FOREIGN KEY (session_id) REFERENCES session (session_id) ON DELETE CASCADE,
    CONSTRAINT wr_fk_user_id FOREIGN KEY (user_id) REFERENCES user_table (user_id) ON DELETE CASCADE
);

ALTER TABLE session_review OWNER TO psql;

CREATE TABLE session_review_activity (
    session_review_activity_id INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    session_review_id INT CHECK (session_review_id IS NOT NULL),
    activity_id INT CHECK (activity_id IS NOT NULL),
    CONSTRAINT wr_fk_session_review_id FOREIGN KEY (session_review_id) REFERENCES session_review (review_id) ON DELETE CASCADE,
    CONSTRAINT wr_fk_activity_id FOREIGN KEY (activity_id) REFERENCES activity (activity_id) ON DELETE CASCADE
);

ALTER TABLE session_review_activity OWNER TO psql;

ALTER TABLE workout_review OWNER TO psql;

--
-- Name: technique_reviewType: TABLE; Schema: public; Owner: psql
--
CREATE TABLE technique_review (
    review_id INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    technique_id INT CHECK (technique_id IS NOT NULL),
    user_id INT CHECK (user_id IS NOT NULL),
    rating INT CHECK (rating IS NOT NULL),
    positive_comment TEXT,
    negative_comment TEXT,
    review_date TIMESTAMP NOT NULL,
    CONSTRAINT tr_fk_technique_id FOREIGN KEY (technique_id) REFERENCES technique (technique_id) ON DELETE CASCADE,
    CONSTRAINT tr_fk_user_id FOREIGN KEY (user_id) REFERENCES user_table (user_id) ON DELETE CASCADE
);

ALTER TABLE technique_review OWNER TO psql;
--
-- Name: belt; Type: TABLE; Schema: public; Owner: psql
--
CREATE TABLE belt (
    belt_id INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    belt_name TEXT NOT NULL,
    belt_color TEXT NOT NULL,
    is_child BOOLEAN NOT NULL,
    is_inverted BOOLEAN NOT NULL
);

ALTER TABLE belt OWNER TO psql;

--
-- Name: plan_to_belt (Mapping table); Type: TABLE; Schema: public; Owner: psql
--
CREATE TABLE plan_to_belt (
    belt_id INT CHECK (belt_id IS NOT NULL),
    plan_id INT CHECK (plan_id IS NOT NULL),
    UNIQUE (belt_id, plan_id),
    CONSTRAINT fk_belt_id FOREIGN KEY (belt_id) REFERENCES belt (belt_id) ON DELETE CASCADE,
    CONSTRAINT fk_plan_id FOREIGN KEY (plan_id) REFERENCES plan (plan_id) ON DELETE CASCADE
);

ALTER TABLE plan_to_belt OWNER TO psql;

--
-- Name: technique_to_belt (Mapping table); Type: TABLE; Schema: public; Owner: psql
--
CREATE TABLE technique_to_belt (
    belt_id INT CHECK (belt_id IS NOT NULL),
    technique_id INT CHECK (technique_id IS NOT NULL),
    UNIQUE (belt_id, technique_id),
    CONSTRAINT fk_belt_id FOREIGN KEY (belt_id) REFERENCES belt (belt_id) ON DELETE CASCADE,
    CONSTRAINT fk_technique_id FOREIGN KEY (technique_id) REFERENCES technique (technique_id) ON DELETE CASCADE
);

ALTER TABLE technique_to_belt OWNER TO psql;

-- Logging tables; Type: TABLE; Schema: public; Owner: psql
CREATE TABLE error_log (
    log_id SERIAL PRIMARY KEY,
    error_message TEXT NOT NULL,
    info_message TEXT NOT NULL,
    error_date_time TIMESTAMP NOT NULL
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

CREATE TABLE IF NOT EXISTS examination_grading (
    grading_id SERIAL PRIMARY KEY,
    creator_id INT NOT NULL,
    belt_id INT NOT NULL,
    step INT NOT NULL,
    technique_step_num INT NOT NULL,
    created_at DATE NOT NULL,
    title VARCHAR(255) NOT NULL,
    CONSTRAINT grading_fk_belt FOREIGN KEY (belt_id) REFERENCES belt (belt_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS examination_examinee (
    examinee_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    grading_id INT NOT NULL,
    CONSTRAINT examinee_fk_grading FOREIGN KEY (grading_id) REFERENCES examination_grading (grading_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS examination_examinee_pair (
    examinee_pair_id SERIAL PRIMARY KEY,
    examinee_1_id INT NOT NULL,
    examinee_2_id INT,
    CONSTRAINT examinee_pair_fk_examinee_1 FOREIGN KEY (examinee_1_id) REFERENCES examination_examinee (examinee_id) ON DELETE CASCADE,
    CONSTRAINT examinee_pair_fk_examinee_2 FOREIGN KEY (examinee_2_id) REFERENCES examination_examinee (examinee_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS examination_result (
    result_id SERIAL PRIMARY KEY,
    examinee_id INT NOT NULL,
    technique_name VARCHAR(255) NOT NULL, -- Should be string with technique_name in grading protocol
    pass BOOLEAN,
    CONSTRAINT examinee_id_fk FOREIGN KEY (examinee_id) REFERENCES examination_examinee (examinee_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS examination_comment (
    comment_id SERIAL PRIMARY KEY,
    grading_id INT NOT NULL,
    examinee_id INT,
    examinee_pair_id INT,
    technique_name VARCHAR(255),
    comment VARCHAR(255),
    CONSTRAINT examinee_id_fk FOREIGN KEY (examinee_id) REFERENCES examination_examinee (examinee_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS examination_protocol (
    belt_id INT PRIMARY KEY,
    belt_color TEXT NOT NULL,
    examination_protocol JSON NOT NULL,
    CONSTRAINT fk_belt_id FOREIGN KEY (belt_id) REFERENCES belt (belt_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS activity_list (
    id SERIAL PRIMARY KEY,
    author INT,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    private bool,
    created_date DATE NOT NULL,
    CONSTRAINT al_author_fk FOREIGN KEY (author) REFERENCES user_table (user_id)
);

ALTER TABLE activity_list OWNER to psql;

CREATE TABLE IF NOT EXISTS activity_list_entry (
    list_entry_id SERIAL PRIMARY KEY,
    list_id INT NOT NULL,
    exercise_id INT,
    technique_id INT,
    duration INT,
    CONSTRAINT ale_list_id_fk FOREIGN KEY (list_id) REFERENCES activity_list (id) ON DELETE CASCADE
);

ALTER TABLE activity_list_entry OWNER to psql;

CREATE TABLE IF NOT EXISTS user_to_activity_list (
    user_id INT CHECK (user_id IS NOT NULL),
    list_id INT CHECK (list_id IS NOT NULL),
    CONSTRAINT user_id_fk FOREIGN KEY (user_id) REFERENCES user_table (user_id) ON DELETE CASCADE,
    CONSTRAINT list_id_fk FOREIGN KEY (list_id) REFERENCES activity_list (id) ON DELETE CASCADE
);

ALTER TABLE user_to_activity_list OWNER to psql;

--
-- Name: grading_protocol; Type: TABLE; Schema: public; Owner: psql
--
CREATE TABLE grading_protocol (
    protocol_id INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    belt_id INT NOT NULL,
    protocol_code VARCHAR(255),
    protocol_name VARCHAR(255),
    CONSTRAINT fk_belt_grading_protocol FOREIGN KEY (belt_id) REFERENCES belt (belt_id) ON DELETE CASCADE
);

ALTER TABLE grading_protocol OWNER TO psql;

--
-- Name: grading_protocol_category; Type: TABLE; Schema: public; Owner: psql
--
CREATE TABLE grading_protocol_category (
    category_id INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    protocol_id INT NOT NULL,
    category_name VARCHAR(255),
    category_order INT NOT NULL,
    CONSTRAINT fk_grading_protocol_grading_protocol_category FOREIGN KEY (protocol_id) REFERENCES grading_protocol (protocol_id) ON DELETE CASCADE
);

ALTER TABLE grading_protocol_category OWNER TO psql;

--
-- Name: technique_to_grading_protocol_category; Type: TABLE; Schema: public; Owner: psql
--
CREATE TABLE grading_protocol_technique (
    id SERIAL PRIMARY KEY,
    technique_id INT NOT NULL,
    protocol_category_id INT NOT NULL,
    technique_order INT NOT NULL,
    CONSTRAINT fk_gpt_technique FOREIGN KEY (technique_id) REFERENCES technique (technique_id) ON DELETE CASCADE,
    CONSTRAINT fk_gpt_category FOREIGN KEY (protocol_category_id) REFERENCES grading_protocol_category (category_id) ON DELETE CASCADE
);

ALTER TABLE grading_protocol_technique OWNER TO psql;

CREATE TABLE belt_succession (
    belt_id INT NOT NULL,
    next_belt_id INT NOT NULL,
    CONSTRAINT belt_id_fk FOREIGN KEY (belt_id) REFERENCES belt (belt_id) ON DELETE CASCADE,
    CONSTRAINT next_belt_id_fk FOREIGN KEY (next_belt_id) REFERENCES belt (belt_id) ON DELETE CASCADE
);

ALTER TABLE user_to_activity_list OWNER to psql;

--TODOO: Dubbelkolla om technique_chain, node and technique_weave are correct and that no orphans is created.
CREATE TABLE technique_weave (
    id SERIAL PRIMARY KEY,
    name VARCHAR(180),
    description VARCHAR(800)
);

ALTER TABLE technique_weave OWNER TO psql;

CREATE TABLE technique_chain (
    id SERIAL PRIMARY KEY,
    name VARCHAR(180),
    description VARCHAR(800),
    parent_weave_id INT,
    CONSTRAINT rm_p_weave FOREIGN KEY (parent_weave_id) REFERENCES technique_weave (id) ON DELETE CASCADE
);

ALTER TABLE technique_chain OWNER TO psql;

CREATE TABLE node (
    id SERIAL PRIMARY KEY,
    parent_weave INT,
    in_chain INT,
    name VARCHAR(180),
    description VARCHAR(800),
    technique INT,
    attack BOOLEAN NOT NULL,
    participant INT NOT NULL,
    CONSTRAINT rm_parent_weave FOREIGN KEY (parent_weave) REFERENCES technique_weave (id) ON DELETE CASCADE
);

ALTER TABLE node OWNER TO psql;

CREATE TABLE edges (
    id SERIAL PRIMARY KEY,
    from_node_id INTEGER REFERENCES node (id),
    to_node_id INTEGER REFERENCES node (id),
    FOREIGN KEY (from_node_id) REFERENCES node (id) ON DELETE CASCADE,
    FOREIGN KEY (to_node_id) REFERENCES node (id) ON DELETE CASCADE
);

ALTER TABLE edges OWNER TO psql;

CREATE TABLE weave_representation (
    id SERIAL PRIMARY KEY,
    parent_weave_id INT REFERENCES technique_weave (id),
    node_id INT NOT NULL,
    node_x_pos INT NOT NULL,
    node_y_pos INT NOT NULL,
    CONSTRAINT fk_node FOREIGN KEY (node_id) REFERENCES node (id) ON DELETE CASCADE
);

ALTER TABLE weave_representation OWNER TO psql;

CREATE TABLE in_chain (
    id SERIAL PRIMARY KEY,
    node_id INT NOT NULL,
    chain_id INT NOT NULL,
    pos_in_chain INT NOT NULL
);

ALTER TABLE in_chain OWNER TO psql;
--
-- Default Inserts
-- ** Note that the order of some of these might
-- ** be important because of constraints and/or triggers.
-- ** This part relies on a feature of psql where relative
-- ** sql files are included with '\ir'
--
\ir defaults/roles.sql
\ir defaults/users.sql
\ir defaults/belts.sql 
\ir defaults/tags.sql 
\ir defaults/permissions.sql
\ir defaults/techniques.sql
\ir defaults/workouts.sql
\ir defaults/exercises.sql
\ir defaults/plans.sql
\ir defaults/reviews.sql
\ir defaults/activities.sql
\ir defaults/sessions.sql 
\ir defaults/sessionreviews.sql
\ir defaults/sessionreviewactivities.sql
\ir defaults/activitylists.sql
\ir defaults/examination_protocols.sql
\ir defaults/grading_protocols.sql
\ir defaults/techniqueChain.sql
-- Triggers for user
--
CREATE OR REPLACE FUNCTION remove_user_references() RETURNS TRIGGER AS $$ 
BEGIN
	DELETE FROM
		workout
	WHERE
		workout_hidden = TRUE
		AND workout_author = OLD.user_id;

UPDATE workout
SET
    workout_author = 1
WHERE
    workout_author = OLD.user_id;

UPDATE plan SET user_id = 1 WHERE user_id = OLD.user_id;

UPDATE comments SET user_id = 1 WHERE user_id = OLD.user_id;

RETURN OLD;

END;

$$ LANGUAGE 'plpgsql';

--
-- This is a function used for making sure that there is always one admin present.
-- In the current system however, the original admin user is sort of required due to the function above.
-- Therefore, bring this back if the above function gets fixed. (Should probably change owner to first best admin
-- rather than user_id 1)
--
--CREATE OR REPLACE FUNCTION protect_final_admin_role() RETURNS TRIGGER AS $$ 
--BEGIN 
--	IF OLD.role_id = admin_role_id()
--	AND (
--		SELECT
--			COUNT(user_id)
--		FROM
--			user_table
--		WHERE
--			role_id = admin_role_id()
--	) <= 1 THEN RAISE EXCEPTION 'cannot remove final admin';
--
--	END IF;
--
--	IF TG_OP = 'UPDATE' THEN RETURN NEW;
--
--	ELSE RETURN OLD;
--
--	END IF;
--END;
--$$ LANGUAGE 'plpgsql';
--
--CREATE TRIGGER protect_admin_role BEFORE DELETE OR
--	UPDATE OF role_id ON user_table
--	FOR EACH ROW EXECUTE PROCEDURE protect_final_admin_role();

--
-- This is a temporary function for protecting the original admin user. Read above for more info.
-- It simply prevents anyone from deleting or changing the role of the original admin.
--
CREATE OR REPLACE FUNCTION protect_original_admin() RETURNS TRIGGER AS $$ 
BEGIN 
	IF
		(OLD.user_id = 1
		AND
		(TG_OP = 'DELETE'
		OR 
		OLD.role_id != NEW.role_id))
			THEN RAISE EXCEPTION 'cannot modify original admin';

	ELSEIF
		TG_OP = 'UPDATE' 
			THEN RETURN NEW;

	ELSE RETURN OLD;

	END IF;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER protect_original_admin_user BEFORE DELETE OR UPDATE ON user_table
	FOR EACH ROW EXECUTE PROCEDURE protect_original_admin();

CREATE TRIGGER remove_user BEFORE DELETE ON user_table 
	FOR EACH ROW EXECUTE PROCEDURE remove_user_references();


--
-- Triggers for categories
--
CREATE OR REPLACE FUNCTION no_duplicate_category() RETURNS TRIGGER AS $$ 
BEGIN 
	IF EXISTS (
		SELECT
			*
		FROM
			activity as A
		WHERE
			A.workout_id = NEW.workout_id
			AND A.category_order = NEW.category_order
			AND A.category_name <> NEW.category_name
	) THEN RAISE EXCEPTION 'Cannot have two categories with the same order in the same workout!';

	ELSE RETURN NEW;

	END IF;
END;

$$ LANGUAGE 'plpgsql';

CREATE TRIGGER check_order BEFORE
INSERT
    ON activity FOR EACH ROW
EXECUTE PROCEDURE no_duplicate_category ();

--
-- Triggers for tags
--
CREATE OR REPLACE FUNCTION tag_to_lowercase() RETURNS TRIGGER AS $$ 
BEGIN 
	NEW.name = LOWER(BTRIM(NEW.name));
	RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER insert_tag BEFORE
INSERT
    ON tag FOR EACH ROW
EXECUTE PROCEDURE tag_to_lowercase ();

--
-- Triggers for roles
--
CREATE OR REPLACE FUNCTION protect_admin_role_permission() RETURNS TRIGGER AS $$ 
BEGIN 
	IF OLD.role_id = admin_role_id()
	AND 
	OLD.permission_id = admin_permission_id()
	THEN RAISE EXCEPTION 'cannot revoke admin permissions from admin role';

	END IF;
	RETURN OLD;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER protect_admin_permission BEFORE DELETE ON role_to_permission FOR EACH ROW
EXECUTE PROCEDURE protect_admin_role_permission ();