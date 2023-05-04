package se.umu.cs.pvt.search.persistance;

import org.springframework.stereotype.Repository;
import se.umu.cs.pvt.search.interfaces.ExerciseDBResult;
import se.umu.cs.pvt.search.interfaces.TagDBResult;
import se.umu.cs.pvt.search.interfaces.TechniqueDBResult;
import se.umu.cs.pvt.search.interfaces.WorkoutDBResult;

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

	public List<TagDBResult> getTagSuggestionsFRomCustomQuery(String query){
		return entityManager.createNativeQuery(query, TechniqueDBResult.class).getResultList();
	}
}
