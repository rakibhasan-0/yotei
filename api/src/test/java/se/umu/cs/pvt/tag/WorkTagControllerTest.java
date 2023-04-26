/**
 * The tests for the Workout Tag part of the Tag API.
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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doAnswer;

/**
 * @author  Phoenix (25-04-2023)
 */
@ExtendWith(MockitoExtension.class)
public class WorkTagControllerTest {
    
    private WorkoutTagController workController;
    private ArrayList<WorkoutTag> workoutTags;

    @Mock
    private WorkoutTagRepository workRepository = Mockito.mock(WorkoutTagRepository.class);
    private TagRepository tagRepository = Mockito.mock(TagRepository.class);


    @BeforeEach
    void init() {
        workController = new WorkoutTagController(workRepository, tagRepository);
        workoutTags = new ArrayList<>();
    }

    @Test
    void shouldSucceedWhenAddingWorkTag() {
        Tag regularTag = new Tag((long) 1, "blå");
        WorkoutTag workTag = new WorkoutTag(1L, regularTag);

        // save is a function called in the JPA repository when a workout tag is added via the controller
        Mockito.when(workRepository.save((WorkoutTag)Mockito.any())).thenAnswer(invocation -> {
            workoutTags.add((WorkoutTag)invocation.getArguments()[0]);
            return null;
        });

        // this line should not post anything since the tag is only posted if there exists a regular tag with the correct id in the Tag table.
        assertEquals(new ResponseEntity<>(workTag, HttpStatus.BAD_REQUEST), workController.postWorkoutTagPair(workTag, regularTag.getId()));
        assertTrue(workoutTags.isEmpty());

        // we redefine the findById method (that is called in WorkoutTagController) to return a tag and try posting again
        Mockito.when(tagRepository.findById(regularTag.getId())).thenReturn(Optional.of(regularTag));


        workController.postWorkoutTagPair(workTag, regularTag.getId());
        assertFalse(workoutTags.isEmpty());
    }
    
    @Test
    void shouldSucceedWhenGettingWorkoutByTag() {
        final long WORKOUT_ONE = 1;
        final long WORKOUT_TWO = 2;

        Tag regularTag = new Tag(1L, "blå");
        WorkoutTag workTag1 = new WorkoutTag(WORKOUT_ONE, regularTag);
        WorkoutTag workTag2 = new WorkoutTag(WORKOUT_TWO, regularTag);

        workoutTags.add(workTag1);
        workoutTags.add(workTag2);

        // findAllProjectedByTagId is the function called in the JPA repository when a search for workouts with a specific tag is initiated
        Mockito.when(workRepository.findAllByTagId(anyLong())).thenAnswer(invocation -> {
            ArrayList<Long> workIds = new ArrayList<>();
            for(WorkoutTag w : workoutTags) {
                if(w.getTag() == invocation.getArguments()[0]) {
                    workIds.add(w.getWorkId());
                }
            }
            return workIds;
        });

        // needed for finding the regular tag
        Mockito.when(tagRepository.findById(regularTag.getId())).thenReturn(Optional.of(regularTag));

        // check that exactly two elements have been added when getting with the regular tags id, the correct Http status code with a random id
        assertEquals(2, workController.getWorkoutByTag(regularTag.getId()).getBody().size());
        assertEquals(new ResponseEntity<>(HttpStatus.BAD_REQUEST), workController.getWorkoutByTag((long) 32));  
    }

    @Test
    void shouldSucceedWhenGettingTagByWorkout() {
        final long WORKOUT_ONE = 3;
        final long WORKOUT_TWO = 4;

        Tag regularTag1 = new Tag(1L, "blå");
        Tag regularTag2 = new Tag(2L, "instant killing technique");
        WorkoutTag workTag1 = new WorkoutTag(WORKOUT_ONE, regularTag1);
        WorkoutTag workTag2 = new WorkoutTag(WORKOUT_ONE, regularTag2);
        WorkoutTag workTag3 = new WorkoutTag(WORKOUT_TWO, regularTag1);

        workoutTags.add(workTag1);
        workoutTags.add(workTag2);
        workoutTags.add(workTag3);

        // findById is used to check if there are any tags to fetch at all
        Mockito.when(workRepository.findByWorkId(anyLong())).thenAnswer(invocation -> {
            for(WorkoutTag w : workoutTags) {
                if(w.getWorkId() == invocation.getArguments()[0]) {
                    return workoutTags;
                }
            }
            return null;
        });

        // check that the different WORKOUTs have the correct amount of tags and a Http status code is returned when trying to fetch with non existing workout id.
        assertEquals(1, workController.getTagByWorkout(WORKOUT_ONE).getBody().get(0).getTag());
        assertEquals(2, workController.getTagByWorkout(WORKOUT_ONE).getBody().get(1).getTag());
        assertEquals(1, workController.getTagByWorkout(WORKOUT_TWO).getBody().get(0).getTag());
        assertEquals(new ResponseEntity<>(HttpStatus.BAD_REQUEST), workController.getTagByWorkout(32L));
    }


    @Test
    void shouldSucceedWhenRemovingWorkoutTag() {
        // simulate that we have added three elements to the database
        final int ADDED_WORKOUTTAGS = 1000;
        Tag regularTag = new Tag((long) 1, "blå");
        ArrayList<Long> workoutIds = new ArrayList<>();

        for(Long i = 0L; i < ADDED_WORKOUTTAGS ; i++) {
            workoutTags.add(new WorkoutTag(i, regularTag));
            workoutIds.add(i);
        }
        assertEquals(ADDED_WORKOUTTAGS, workoutTags.size());
   
        // needed for finding the regular tag
        Mockito.when(tagRepository.findById(regularTag.getId())).thenReturn(Optional.of(regularTag));
        
        // We have to search for the WorkoutTag first to see if it exists
        Mockito.when(workRepository.findByWorkIdAndTagId(anyLong(), anyLong())).thenAnswer(invocation -> {
            for (WorkoutTag w : workoutTags) {
                if(w.getWorkId() == invocation.getArguments()[0] && w.getTag() == invocation.getArguments()[1]) {
                    return w;
                }
            }

            return null;
        });

        // redefinition of the delete function
        doAnswer(new Answer<Void>(){
            public Void answer(InvocationOnMock invocation) {
                if(workoutIds.contains(invocation.getArguments()[0])) {
                    // find the position of the workoutpair
                    int indexToRemove = workoutIds.indexOf(invocation.getArguments()[0]);
                    workoutIds.remove(indexToRemove);
                    workoutTags.remove(indexToRemove);
                }
                
                return null;
            }
        }).when(workRepository).deleteByWorkIdAndTagId(anyLong(), anyLong());
 
        // remove everything
        for(int i = 0 ; i < ADDED_WORKOUTTAGS ; i++) {
            workController.deleteWorkoutTagPair(workoutTags.get(0), regularTag.getId());
            assertEquals(ADDED_WORKOUTTAGS - (i +1), workoutTags.size());
        }
        assertEquals(0, workoutTags.size()); 

        // should return null when attempting to remove a workoutTag that does not exist
        assertEquals(new ResponseEntity<>(HttpStatus.BAD_REQUEST), workController.deleteWorkoutTagPair(new WorkoutTag(32L, regularTag), regularTag.getId()));
    }

    @Test
    void shouldSucceedWhenGettingTagRelations() {
        final long WORKOUT_ONE = 3;
        final long WORKOUT_TWO = 4;

        ArrayList<Tag> tags = new ArrayList<>();
        Tag regularTag1 = new Tag((long) 1, "blå");
        Tag regularTag2 = new Tag((long) 2, "instant killing technique");
        WorkoutTag workTag1 = new WorkoutTag(WORKOUT_ONE, regularTag1);
        WorkoutTag workTag2 = new WorkoutTag(WORKOUT_ONE, regularTag2);
        WorkoutTag workTag3 = new WorkoutTag(WORKOUT_TWO, regularTag1);
        
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
        
        // Answer with matching WorkoutTag id when projection method is called on repository.
        Mockito.when(workRepository.findAllByTagId(anyLong())).thenAnswer(invocation -> {
            ArrayList<WorkoutTag> workIds = new ArrayList<>();
            WorkoutTag temp;
            for (WorkoutTag workTag : workoutTags) {
                if (workTag.getTag() == invocation.getArguments()[0]) {
                    workIds.add(workTag);
                }
            }
            return workIds;
            
        });
        
        // Test if relations are empty in the beginning.
        assertEquals(new ResponseEntity<>(HttpStatus.NO_CONTENT), workController.getWorkoutsByTags());
        
        // Add some WorkoutTag relations.                
        workoutTags.add(workTag1);
        workoutTags.add(workTag2);
        workoutTags.add(workTag3);

        
        // Create map relation
        HashMap<Long, ArrayList<Long>> relationHashMap = new HashMap<>();
        ArrayList<Long> workoutIds = new ArrayList<>();
        workoutIds.add(workTag1.getWorkId());
        workoutIds.add(workTag3.getWorkId());
        
        relationHashMap.put(regularTag1.getId(), workoutIds);

        ArrayList<Long> workoutIds2 = new ArrayList<>();
        workoutIds2.add(workTag2.getWorkId());

        relationHashMap.put(regularTag2.getId(), workoutIds2);
        
        // Test if relation is correct.
        assertEquals(new ResponseEntity<>(relationHashMap, HttpStatus.OK), workController.getWorkoutsByTags());

        // Test removing a relation.
        workoutTags.remove(2);
        workoutIds.remove(1);

        assertEquals(new ResponseEntity<>(relationHashMap, HttpStatus.OK), workController.getWorkoutsByTags());

    }
}