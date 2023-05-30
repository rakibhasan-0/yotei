/**
 * The tests for the exercise Tag part of the Tag API.
 * @Author Team 5 Verona
 */
package se.umu.cs.pvt.tag;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.stubbing.Answer;
import org.springframework.data.projection.ProjectionFactory;
import org.springframework.data.projection.SpelAwareProxyProjectionFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doAnswer;

/**
 * @author  Phoenix (25-04-2023)
 */

@ExtendWith(MockitoExtension.class)
public class ExerTagControllerTest {
    
    private ExerciseTagController exerController;
    private ArrayList<ExerciseTag> exerciseTags;
    private ArrayList<Tag> tagList;

    @Mock
    private final ExerciseTagRepository exerRepository = Mockito.mock(ExerciseTagRepository.class);
    private final TagRepository tagRepository = Mockito.mock(TagRepository.class);


    @BeforeEach
    void init() {
        exerController = new ExerciseTagController(exerRepository, tagRepository);
        exerciseTags = new ArrayList<>();
        tagList = new ArrayList<>();
    }

    @Test
    void shouldAddExerTag() {
        Tag regularTag = new Tag((long) 1, "blå");
        ExerciseTag exerTag = new ExerciseTag((long) 1);
        exerTag.setTag(regularTag);

        // save is a function called in the JPA repository when a exercise tag is added via the controller
        Mockito.when(exerRepository.save(Mockito.any())).thenAnswer(invocation -> {
            exerciseTags.add((ExerciseTag)invocation.getArguments()[0]);
            return null;
        });

        // this line should not post anything since the tag is only posted if there exists a regular tag with the correct id in the Tag table.
        assertEquals(new ResponseEntity<>(exerTag, HttpStatus.BAD_REQUEST), exerController.postExerciseTagPair(exerTag, regularTag.getId()));
        assertTrue(exerciseTags.isEmpty());

        // we redefine the findById method (that is called in exerciseTagController) to return a tag and try posting again
        Mockito.when(tagRepository.findById(regularTag.getId())).thenReturn(Optional.of(regularTag));

        exerController.postExerciseTagPair(exerTag, regularTag.getId());
        assertFalse(exerciseTags.isEmpty());
    }

    @Test
    void shouldGetTagsFromExercise() {
        final long EXERCISE_ONE = 3;
        final long EXERCISE_TWO = 4;

        Tag regularTag1 = new Tag((long) 1, "blå");
        Tag regularTag2 = new Tag((long) 2, "instant killing exercise");
        ExerciseTag exerTag1 = new ExerciseTag(EXERCISE_ONE);
        ExerciseTag exerTag2 = new ExerciseTag(EXERCISE_ONE);
        ExerciseTag exerTag3 = new ExerciseTag(EXERCISE_TWO);
        exerTag1.setTag(regularTag1);
        exerTag2.setTag(regularTag2);
        exerTag3.setTag(regularTag1);

        exerciseTags.add(exerTag1);
        exerciseTags.add(exerTag2);
        exerciseTags.add(exerTag3);

        // findById is used to check if there are any tags to fetch at all
        Mockito.when(exerRepository.findByExerciseId(anyLong())).thenAnswer(invocation -> {
            for(ExerciseTag w : exerciseTags) {
                if(w.getExerciseId() == invocation.getArguments()[0]) {
                    return exerciseTags;
                }
            }
            return null;
        });

        // findAllProjectedByExerId is the function called in the JPA repository when a search for tags related to a exercise is made.
        Mockito.when(exerRepository.findAllProjectedByExerciseId(anyLong())).thenAnswer(invocation -> {
            ArrayList<ExerciseTagShortId> tagIds = new ArrayList<>();
            for(ExerciseTag w : exerciseTags) {
                if(w.getExerciseId() == invocation.getArguments()[0]) {
                    tagIds.add(new ExerciseTagShortId() {
                        @Override
                        public Tag getTag() {
                            return w.getTagObject();
                        }
                    });
                }
            }
            return tagIds;
        });

        // check that the different exercises have the correct amount of tags and a Http status code is returned when trying to fetch with non existing exercise id.
        assertEquals(2, exerController.getTagByExercises(EXERCISE_ONE).getBody().size());
        assertEquals(1, exerController.getTagByExercises(EXERCISE_TWO).getBody().size());
        assertEquals(new ResponseEntity<>(HttpStatus.BAD_REQUEST), exerController.getTagByExercises((long) 32));
    }

    @Test
    void shouldRemoveExerciseTags() {
        // simulate that we have added thousand elements to the database
        final int ADDED_exerciseTAGS = 1000;
        Tag regularTag = new Tag((long) 1, "blå");
        ArrayList<Long> exerciseIds = new ArrayList<>();

        for(int i = 0; i < ADDED_exerciseTAGS ; i++) {
            exerciseTags.add(new ExerciseTag((long) i));
            exerciseTags.get(i).setTag(regularTag);
            exerciseIds.add((long) i);
        }
        assertEquals(ADDED_exerciseTAGS, exerciseTags.size());
       
        // needed for finding the regular tag
        Mockito.when(tagRepository.findById(regularTag.getId())).thenReturn(Optional.of(regularTag));
        
        // We have to search for the exerciseTag first to see if it exists
        Mockito.when(exerRepository.findByExerciseIdAndTagId(anyLong(), anyLong())).thenAnswer(invocation -> {
            for (ExerciseTag w : exerciseTags) {
                if(w.getExerciseId() == invocation.getArguments()[0] && w.getTag() == invocation.getArguments()[1]) {
                    return w;
                }
            }

            return null;
        });

        // redefinition of the delete function
        doAnswer((Answer<Void>) invocation -> {
            if(exerciseIds.contains(invocation.getArguments()[0])) {
                // find the position of the exercisepair
                int indexToRemove = exerciseIds.indexOf(invocation.getArguments()[0]);
                exerciseIds.remove(indexToRemove);
                exerciseTags.remove(indexToRemove);
            }

            return null;
        }).when(exerRepository).deleteByExerciseIdAndTagId(anyLong(), anyLong());

        // remove everything
        for(int i = 0 ; i < ADDED_exerciseTAGS ; i++) {
            exerController.deleteExerciseTagPair(exerciseTags.get(0), regularTag.getId());
            assertEquals(ADDED_exerciseTAGS - (i +1), exerciseTags.size());
        }

        assertEquals(0, exerciseTags.size()); 

        // should return null when attempting to remove a ExerciseTag that does not exist
        assertEquals(new ResponseEntity<>(HttpStatus.BAD_REQUEST), exerController.deleteExerciseTagPair(new ExerciseTag((long) 32), regularTag.getId()));   
    }
}