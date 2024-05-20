package se.umu.cs.pvt.search.persistance;

import org.springframework.stereotype.Repository;
import se.umu.cs.pvt.search.interfaces.*;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

/**
 * Repository for Searching.
 * This class provides methods to retrieve data from the database related to search operations.
 *
 * @author Minotaur (James Eriksson)
 */

@Repository
public class SearchRepository {

    @PersistenceContext
    private EntityManager entityManager;

    /**
     * Retrieves a list of WorkoutDBResult objects based on a custom query.
     *
     * @param query the custom query to execute
     * @return a list of WorkoutDBResult objects
     */
    public List<WorkoutDBResult> getWorkoutsFromCustomQuery(String query){
        return entityManager.createNativeQuery(query, WorkoutDBResult.class).getResultList();
    }

    /**
     * Retrieves a list of ExerciseDBResult objects based on a custom query.
     *
     * @param query the custom query to execute
     * @return a list of ExerciseDBResult objects
     */
    public List<ExerciseDBResult> getExercisesFromCustomQuery(String query){
        return entityManager.createNativeQuery(query, ExerciseDBResult.class).getResultList();
    }

    public List<ActivityListDBResult> getActivityListFromCustomQuery(String query){
        return entityManager.createNativeQuery(query, ActivityListDBResult.class).getResultList();
    }

    /**
     * Retrieves a list of TechniqueDBResult objects based on a custom query.
     *
     * @param query the custom query to execute
     * @return a list of TechniqueDBResult objects
     */
    public List<TechniqueDBResult> getTechniquesFromCustomQuery(String query){
        return entityManager.createNativeQuery(query, TechniqueDBResult.class).getResultList();
    }



    /**
     * Retrieves a list of TagDBResult objects based on a custom query.
     *
     * @param query the custom query to execute
     * @return a list of TagDBResult objects
     */
	public List<TagDBResult> getTagSuggestionsFromCustomQuery(String query){
		return entityManager.createNativeQuery(query, TagDBResult.class).getResultList();
	}

    /**
     * Retrieves a list of PlanDBResult objects based on a custom query.
     *
     * @param query the custom query to execute
     * @return a list of PlanDBResult objects
     */
    public List<PlanDBResult> getPlansFromCustomQuery(String query) {
        return entityManager.createNativeQuery(query, PlanDBResult.class).getResultList();
    }

    /**
     * Retrieves a list of UserDBResult objects based on a custom query.
     *
     * @param query the custom query to execute
     * @return a list of UserDBResult objects
     */
    public List<UserDBResult> getUsersFromCustomQuery(String query) {
        return entityManager.createNativeQuery(query, UserDBResult.class).getResultList();
    }
}
