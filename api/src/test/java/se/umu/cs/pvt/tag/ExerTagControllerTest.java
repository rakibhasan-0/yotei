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



@ExtendWith(MockitoExtension.class)
public class ExerTagControllerTest {
    
    private ExerciseTagController exerController;
    private ArrayList<ExerciseTag> exerciseTags;
    private ArrayList<Tag> tagList;

    @Mock
    private ExerciseTagRepository exerRepository = Mockito.mock(ExerciseTagRepository.class);
    private TagRepository tagRepository = Mockito.mock(TagRepository.class);


    @BeforeEach
    void init() {
        exerController = new ExerciseTagController(exerRepository, tagRepository);
        exerciseTags = new ArrayList<>();
        tagList = new ArrayList<>();
    }

    @Test
    void testAddexerTag() {
        Tag regularTag = new Tag((long) 1, "blå");
        ExerciseTag exerTag = new ExerciseTag((long) 1);
        exerTag.setTag(regularTag);

        // save is a function called in the JPA repository when a exercise tag is added via the controller
        Mockito.when(exerRepository.save((ExerciseTag)Mockito.any())).thenAnswer(invocation -> {
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
    void testGetexerciseByTag() {
        final long exercise_ONE = 1;
        final long exercise_TWO = 2;

        Tag regularTag = new Tag((long) 1, "blå");
        ExerciseTag exerTag1 = new ExerciseTag(exercise_ONE);
        ExerciseTag exerTag2 = new ExerciseTag(exercise_TWO);
        exerTag1.setTag(regularTag);
        exerTag2.setTag(regularTag);

        exerciseTags.add(exerTag1);
        exerciseTags.add(exerTag2);


        // findAllProjectedByTagId is the function called in the JPA repository when a search for exercises with a specific tag is initiated
        Mockito.when(exerRepository.findAllProjectedByTagId(anyLong())).thenAnswer(invocation -> {
            ArrayList<Long> exerIds = new ArrayList<>();
            for(ExerciseTag w : exerciseTags) {
                if(w.getTag() == invocation.getArguments()[0]) {
                    exerIds.add(w.getExerciseId());
                }
            }
            return exerIds;
        });


        // needed for finding the regular tag
        Mockito.when(tagRepository.findById(regularTag.getId())).thenReturn(Optional.of(regularTag));

        // check that exactly two elements have been added when getting with the regular tags id, the correct Http status code with a random id
        assertEquals(2, exerController.getExerciseByTag(regularTag.getId()).getBody().size());
        assertEquals(new ResponseEntity<>(HttpStatus.BAD_REQUEST), exerController.getExerciseByTag((long) 32));  
    }

    @Test
    void testGetTagByexercise() {
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

        // findAllProjectedByexerId is the function called in the JPA repository when a search for tags related to a exercise is made.
        Mockito.when(exerRepository.findAllProjectedByExerciseId(anyLong())).thenAnswer(invocation -> {
            ArrayList<Long> tagIds = new ArrayList<>();
            for(ExerciseTag w : exerciseTags) {
                if(w.getExerciseId() == invocation.getArguments()[0]) {
                    tagIds.add(w.getTag());
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
    void testRemoveexerciseTag() {
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
        doAnswer(new Answer<Void>(){
            public Void answer(InvocationOnMock invocation) {
                if(exerciseIds.contains(invocation.getArguments()[0])) {
                    // find the position of the exercisepair
                    int indexToRemove = exerciseIds.indexOf(invocation.getArguments()[0]);
                    exerciseIds.remove(indexToRemove);
                    exerciseTags.remove(indexToRemove);
                }
                
                return null;
            }
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

    @Test
    void getTagRelations() {
        final long EXERCISE_ONE = 3;
        final long EXERCISE_TWO = 4;

        ArrayList<Tag> tags = new ArrayList<>();
        Tag regularTag1 = new Tag((long) 1, "blå");
        Tag regularTag2 = new Tag((long) 2, "instant killing exercise");
        ExerciseTag exerTag1 = new ExerciseTag(EXERCISE_ONE);
        ExerciseTag exerTag2 = new ExerciseTag(EXERCISE_ONE);
        ExerciseTag exerTag3 = new ExerciseTag(EXERCISE_TWO);
        exerTag1.setTag(regularTag1);
        exerTag2.setTag(regularTag2);
        exerTag3.setTag(regularTag1);
        
        tags.add(regularTag1);
        tags.add(regularTag2);
        
        // Projection factory in order to create projections.
        ProjectionFactory factory = new SpelAwareProxyProjectionFactory(); 
        
        // Return the test list when findAll-method is called on repository.
        Mockito.when(tagRepository.findAll()).thenReturn(tags);
        
        // Mock repository to search for tag in test tag list.
        Mockito.when(tagRepository.findById(anyLong())).thenAnswer(invocation -> {
            for (Tag t : tags) {
                if (t.getId() == invocation.getArguments()[0]) {
                    return Optional.of(t);
                }
            }
            return Optional.empty();
        });
        
        // Answer with matching ExerciseTag ids when projection method is called on repository.
        Mockito.when(exerRepository.findAllProjectedByTagId(anyLong())).thenAnswer(invocation -> {
            ArrayList<ExerciseTagShort> exerIds = new ArrayList<>();
            ExerciseTagShort temp;
            for (ExerciseTag exerciseTag : exerciseTags) {
                if (exerciseTag.getTag() == invocation.getArguments()[0]) {
                    Map<String, Object> sourceMap = Map.of("exerciseId", exerciseTag.getExerciseId());
                    temp = factory.createProjection(ExerciseTagShort.class, sourceMap);
                    exerIds.add(temp);
                }
            }
            return exerIds;
            
        });
        
        // Test if relations are empty in the beginning.
        assertEquals(new ResponseEntity<>(HttpStatus.NO_CONTENT), exerController.getExercisesByTags());
        
        // Add some ExerciseTags relations.                
        exerciseTags.add(exerTag1);
        exerciseTags.add(exerTag2);
        exerciseTags.add(exerTag3);

        
        // Create map relation
        HashMap<Long, ArrayList<Long>> relationHashMap = new HashMap<>();
        ArrayList<Long> exerciseIds = new ArrayList<>();
        exerciseIds.add(exerTag1.getExerciseId());
        exerciseIds.add(exerTag3.getExerciseId());
        
        relationHashMap.put(regularTag1.getId(), exerciseIds);

        ArrayList<Long> exerciseIds2 = new ArrayList<>();
        exerciseIds2.add(exerTag2.getExerciseId());

        relationHashMap.put(regularTag2.getId(), exerciseIds2);
        
        // Test if relation is correct.
        assertEquals(new ResponseEntity<>(relationHashMap, HttpStatus.OK), exerController.getExercisesByTags());

        // Test removing a relation.
        exerciseTags.remove(2);
        exerciseIds.remove(1);

        assertEquals(new ResponseEntity<>(relationHashMap, HttpStatus.OK), exerController.getExercisesByTags());

    }

    @Test
    void testSetExerciseTags() {
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
        
        tagList.add(regularTag1);
        tagList.add(regularTag2);

        // Define what mockito should do when saving data to the repository.
        Mockito.when(exerRepository.save((ExerciseTag)Mockito.any())).thenAnswer(invocation -> {
            exerciseTags.add((ExerciseTag)invocation.getArguments()[0]);
            return null;
        });

        doAnswer(new Answer<Void>() {
           public Void answer(InvocationOnMock invocation) {
                ArrayList<ExerciseTag> tExerciseTags = new ArrayList<>((List<ExerciseTag>)invocation.getArguments()[0]);

                for (ExerciseTag et : tExerciseTags) {
                    exerciseTags.remove(et);
                }
                
                return null;
           }
        }).when(exerRepository).deleteAll(Mockito.anyList());

        Mockito.when(exerRepository.findByExerciseId(anyLong())).thenAnswer(invocation -> {
            ArrayList<ExerciseTag> temp = new ArrayList<>();
            for (ExerciseTag et : exerciseTags) {
                if (et.getExerciseId() == invocation.getArguments()[0]) {
                    temp.add(et);
                }
            }
            return temp;
        });

        Mockito.when(tagRepository.save((Tag)Mockito.any())).thenAnswer(invocation -> {
            tagList.add((Tag)invocation.getArguments()[0]);
            return null;
        });

        Mockito.when(tagRepository.getTagByName(anyString())).thenAnswer(invocation -> {
            for (Tag t : tagList) {
                if (t.getName().equals((String)invocation.getArguments()[0])) {
                    return t;
                }
            }
            return null;
        }); 
       
        // Projection factory in order to create projections.
        ProjectionFactory factory = new SpelAwareProxyProjectionFactory();

        // Answer with matching ExerciseTag ids when projection method is called on repository.
        Mockito.when(exerRepository.findAllProjectedByTagId(anyLong())).thenAnswer(invocation -> {
            ArrayList<ExerciseTagShort> exerIds = new ArrayList<>();
            ExerciseTagShort eTagShort;

            if (exerciseTags.isEmpty()) {
                return null;
            }

            for (ExerciseTag exerciseTag : exerciseTags) {
                if (exerciseTag.getTag() == invocation.getArguments()[0]) {
                    Map<String, Object> sourceMap = Map.of("exerciseId", exerciseTag.getExerciseId());
                    eTagShort = factory.createProjection(ExerciseTagShort.class, sourceMap);
                    exerIds.add(eTagShort);
                }
            }
            return exerIds;
            
        });
        
        // Return the test list when findAll-method is called on repository.
        Mockito.when(tagRepository.findAll()).thenReturn(tagList);
       
        // Test empty ExerciseTag list.
        ArrayList<ExerciseTag> etArray = new ArrayList<>();
        assertEquals(new ResponseEntity<>(HttpStatus.BAD_REQUEST), exerController.setExerciseTags(EXERCISE_ONE, etArray));


        etArray.add(exerTag1);
        etArray.add(exerTag2);

        // Test adding ExerciseTags.
        assertEquals(new ResponseEntity<>(HttpStatus.OK), exerController.setExerciseTags(EXERCISE_ONE, etArray));

        // Add the same some tags to another exercise.
        etArray = new ArrayList<>();
        etArray.add(exerTag3);
        exerController.setExerciseTags(EXERCISE_TWO, etArray);

        // Test removing tags related to an exercise.
        assertEquals(new ResponseEntity<>(HttpStatus.OK), exerController.deleteExerciseTagPair(EXERCISE_ONE));

        // Create a resulting map corresponding etArray.
        HashMap<Long, ArrayList<Long>> relationHashMap = new HashMap<>();
        ArrayList<Long> longs = new ArrayList<>();
        longs.add(exerTag3.getExerciseId());
        relationHashMap.put((long) 1, longs);

        // exerciseTags.add(exerTag1);
        // exerciseTags.add(exerTag2);
        // exerciseTags.add(exerTag3);

        // Test that the remaining relations matches.
        assertEquals(new ResponseEntity<>(relationHashMap, HttpStatus.OK), exerController.getExercisesByTags());

    }
}