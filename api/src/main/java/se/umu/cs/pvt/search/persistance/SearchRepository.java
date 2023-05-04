package se.umu.cs.pvt.search.persistance;

import org.springframework.stereotype.Repository;
import se.umu.cs.pvt.search.interfaces.*;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

/**
 * Repository for Searching.
 *
 * @author Minotaur (James Eriksson)
 */

@Repository
public class SearchRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public List<WorkoutDBResult> getWorkoutsFromCustomQuery(String query){
        return entityManager.createNativeQuery(query, WorkoutDBResult.class).getResultList();
    }

    public List<ExerciseDBResult> getExercisesFromCustomQuery(String query){
        return entityManager.createNativeQuery(query, ExerciseDBResult.class).getResultList();
    }

    public List<TechniqueDBResult> getTechniquesFromCustomQuery(String query){
        return entityManager.createNativeQuery(query, TechniqueDBResult.class).getResultList();
    }

	public List<TagDBResult> getTagSuggestionsFromCustomQuery(String query){
		return entityManager.createNativeQuery(query, TagDBResult.class).getResultList();
	}

    public List<PlanDBResult> getPlansFromCustomQuery(String query) {
        return entityManager.createNativeQuery(query, PlanDBResult.class).getResultList();
    }
}
