package se.umu.cs.pvt.search;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import se.umu.cs.pvt.search.builders.SearchWorkoutDBBuilder;

import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

/**
 * Test class for SearchWorkoutDBBuilder
 *
 * @author Kraken
 * date: 2023-05-17
 */
public class WorkoutDBBuilderTest {
    SearchWorkoutParams params;
    SearchWorkoutDBBuilder builder;

    @BeforeEach
    void init() {
        Map<String, String> urlQuery = new HashMap<>();

        urlQuery.put("name","name of workout");
        urlQuery.put("id", "1337");
        urlQuery.put("from", "2020-10-11");
        urlQuery.put("to", "2021-01-02");
        urlQuery.put("favourite", "true");
        urlQuery.put("tags", "tag1,tag2,tag3");

        params = new SearchWorkoutParams(urlQuery);
        builder = new SearchWorkoutDBBuilder(params);
    }

    @Test
    void isNotNull(){
        assertThat(builder).isNotNull();
    }

    @Test
    void filterAllDefaultParamsTest(){
        builder = new SearchWorkoutDBBuilder(new SearchWorkoutParams(new HashMap<>()));

        String expectedQuery = "SELECT result.workout_name, result.workout_id, result.workout_author, 1=2 AS favourite FROM ( " +
                "SELECT workout_name, workout_id, workout_author FROM workout WHERE workout_hidden = FALSE ) AS result";

        assertThat(builder
                .filterByDate()
                .filterByTags()
                .filterByFavourite()
                .filterByPublic()
                .build()
                .getQuery()
        ).isEqualTo(expectedQuery);
    }

    @Test
    void filterByFavoriteTest() {
        String expectedQuery = "SELECT w.workout_name, w.workout_id, w.workout_author " +
                "FROM workout AS w, workout_favorite AS wf " +
                "WHERE w.workout_id=wf.workout_id AND wf.user_id='" + params.getUser_id() + "'";

        expectedQuery = createJoinFavoriteQuery(expectedQuery);

        assertThat(builder
                .filterByFavourite()
                .build()
                .getQuery()
        ).isEqualTo(expectedQuery);
    }

    @Test
    void filterByPublic() {
        String userId = params.getUser_id();
        String expectedQuery = "SELECT workout_name, workout_id, workout_author FROM workout WHERE " +
            "workout_hidden = FALSE OR workout_author = " + userId +
            " OR " + userId + " IN ( SELECT user_id FROM user_table WHERE user_role = 1 )" +
            " OR " + userId + " IN ( SELECT user_id FROM user_workout WHERE workout_id = workout.workout_id )";


        expectedQuery = createJoinFavoriteQuery(expectedQuery);

        assertThat(builder
                .filterByPublic()
                .build()
                .getQuery()
        ).isEqualTo(expectedQuery);
    }

    @Test
    void filterByThreeTags() {
        String expectedQuery = "SELECT w.workout_name, w.workout_id, w.workout_author " +
                "FROM workout AS w, workout_tag AS wt, tag AS t " +
                "WHERE wt.work_id=w.workout_id AND wt.tag_id=t.tag_id AND LOWER(t.name)=LOWER('tag1')"
                + " INTERSECT "
                + "SELECT w.workout_name, w.workout_id, w.workout_author " +
                "FROM workout AS w, workout_tag AS wt, tag AS t " +
                "WHERE wt.work_id=w.workout_id AND wt.tag_id=t.tag_id AND LOWER(t.name)=LOWER('tag2')"
                + " INTERSECT "
                + "SELECT w.workout_name, w.workout_id, w.workout_author " +
                "FROM workout AS w, workout_tag AS wt, tag AS t " +
                "WHERE wt.work_id=w.workout_id AND wt.tag_id=t.tag_id AND LOWER(t.name)=LOWER('tag3')";

        expectedQuery = createJoinFavoriteQuery(expectedQuery);

        assertThat(builder
                .filterByTags()
                .build()
                .getQuery()
        ).isEqualTo(expectedQuery);
    }

    @Test
    void filterByDate() {
        String expectedQuery = "SELECT workout_name, workout_id, workout_author FROM workout WHERE workout_date>='" + params.getFrom() + "'"
                + " INTERSECT "
                + "SELECT workout_name, workout_id, workout_author FROM workout WHERE workout_date<='" + params.getTo() + "'";

        expectedQuery = createJoinFavoriteQuery(expectedQuery);

        assertThat(builder
                .filterByDate()
                .build()
                .getQuery()
        ).isEqualTo(expectedQuery);
    }

    private String createJoinFavoriteQuery(String query){
        String stringQuery;
        String resultQuery = query;

        if(params.hasUser_id()){
            String user_id = params.getUser_id();

            stringQuery = "SELECT result.workout_name, result.workout_id, result.workout_author, wf.user_id IS NOT NULL AS favourite FROM ( " +
                    resultQuery + " " +
                    ") AS result " +
                    "LEFT JOIN workout_favorite AS wf " +
                    "ON wf.workout_id=result.workout_id AND " + "wf.user_id=" + user_id;
        } else {
            // If no user_id was given we can't join with the workout_favorite table
            stringQuery = "SELECT result.workout_name, result.workout_id, result.workout_author, 1=2 AS favourite FROM ( " +
                    resultQuery + " " +
                    ") AS result";
        }

        return stringQuery;
    }
}
