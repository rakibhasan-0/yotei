/**
 * The tests for the Technique Tag part of the Tag API.
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
import static org.mockito.Mockito.doAnswer;


/**
 * @author  Phoenix (25-04-2023)
 */
@ExtendWith(MockitoExtension.class)
public class TechTagControllerTest {
    
    private TechniqueTagController techController;
    private ArrayList<TechniqueTag> techniqueTags;

    @Mock
    private final TechniqueTagRepository techRepository = Mockito.mock(TechniqueTagRepository.class);
    private final TagRepository tagRepository = Mockito.mock(TagRepository.class);


    @BeforeEach
    void init() {
        techController = new TechniqueTagController(techRepository, tagRepository);
        techniqueTags = new ArrayList<>();
    }

    @Test
    void shouldSucceedWhenAddingTechniqueTag() {
        Tag regularTag = new Tag((long) 1, "blå");
        TechniqueTag techTag = new TechniqueTag((long) 1);
        techTag.setTag(regularTag);

        // save is a function called in the JPA repository when a technique tag is added via the controller
        Mockito.when(techRepository.save((TechniqueTag)Mockito.any())).thenAnswer(invocation -> {
            techniqueTags.add((TechniqueTag)invocation.getArguments()[0]);
            return null;
        });

        // this line should not post anything since the tag is only posted if there exists a regular tag with the correct id in the Tag table.
        assertEquals(new ResponseEntity<>(techTag, HttpStatus.BAD_REQUEST), techController.postTechniqueTagPair(techTag, regularTag.getId()));
        assertTrue(techniqueTags.isEmpty());

        // we redefine the findById method (that is called in techniqueTagController) to return a tag and try posting again
        Mockito.when(tagRepository.findById(regularTag.getId())).thenReturn(Optional.of(regularTag));

        techController.postTechniqueTagPair(techTag, regularTag.getId());
        assertFalse(techniqueTags.isEmpty());
    }

    @Test
    void shouldSucceedWhenGettingTechniqueByTag() {
        final long TECHNIQUE_ONE = 1;
        final long TECHNIQUE_TWO = 2;

        Tag regularTag = new Tag((long) 1, "blå");
        TechniqueTag techTag1 = new TechniqueTag(TECHNIQUE_ONE);
        TechniqueTag techTag2 = new TechniqueTag(TECHNIQUE_TWO);
        techTag1.setTag(regularTag);
        techTag2.setTag(regularTag);

        techniqueTags.add(techTag1);
        techniqueTags.add(techTag2);


        // findAllProjectedByTagId is the function called in the JPA repository when a search for techniques with a specific tag is initiated
        Mockito.when(techRepository.findAllProjectedByTagId(anyLong())).thenAnswer(invocation -> {
            ArrayList<Long> techIds = new ArrayList<>();
            for(TechniqueTag w : techniqueTags) {
                if(w.getTag() == invocation.getArguments()[0]) {
                    techIds.add(w.getTechId());
                }
            }
            return techIds;
        });


        // needed for finding the regular tag
        Mockito.when(tagRepository.findById(regularTag.getId())).thenReturn(Optional.of(regularTag));

        // check that exactly two elements have been added when getting with the regular tags id, the correct Http status code with a random id
        assertEquals(2, techController.getTechniqueByTag(regularTag.getId()).getBody().size());
        assertEquals(new ResponseEntity<>(HttpStatus.BAD_REQUEST), techController.getTechniqueByTag((long) 32));  
    }

    @Test
    void shouldSucceedWhenGettingTagByTechnique() {
        final long TECHNIQUE_ONE = 3;
        final long TECHNIQUE_TWO = 4;

        Tag regularTag1 = new Tag((long) 1, "blå");
        Tag regularTag2 = new Tag((long) 2, "instant killing technique");
        TechniqueTag techTag1 = new TechniqueTag(TECHNIQUE_ONE);
        TechniqueTag techTag2 = new TechniqueTag(TECHNIQUE_ONE);
        TechniqueTag techTag3 = new TechniqueTag(TECHNIQUE_TWO);
        techTag1.setTag(regularTag1);
        techTag2.setTag(regularTag2);
        techTag3.setTag(regularTag1);

        techniqueTags.add(techTag1);
        techniqueTags.add(techTag2);
        techniqueTags.add(techTag3);

        // findById is used to check if there are any tags to fetch at all
        Mockito.when(techRepository.findByTechId(anyLong())).thenAnswer(invocation -> {
            for(TechniqueTag w : techniqueTags) {
                if(w.getTechId() == invocation.getArguments()[0]) {
                    return techniqueTags;
                }
            }
            return null;
        });

        // findAllProjectedBytechId is the function called in the JPA repository when a search for tags related to a technique is made.
        Mockito.when(techRepository.findAllProjectedByTechId(anyLong())).thenAnswer(invocation -> {
            ArrayList<TechniqueTagShortId> tagIds = new ArrayList<>();
            for(TechniqueTag w : techniqueTags) {
                if(w.getTechId() == invocation.getArguments()[0]) {
                    tagIds.add(new TechniqueTagShortId() {
                        @Override
                        public Tag getTag() {
                            return w.getTagObject();
                        }
                    });
                }
            }
            return tagIds;
        });

        // check that the different TECHNIQUES have the correct amount of tags and a Http status code is returned when trying to fetch with non existing technique id.
        assertEquals(2, Objects.requireNonNull(techController.getTagByTechnique(TECHNIQUE_ONE).getBody()).size());
        assertEquals(1, Objects.requireNonNull(techController.getTagByTechnique(TECHNIQUE_TWO).getBody()).size());
        assertEquals(new ResponseEntity<>(HttpStatus.BAD_REQUEST), techController.getTagByTechnique((long) 32));
    }

    @Test
    void shouldSucceedWhenRemovingTechniqueTag() {
        // simulate that we have added thousand elements to the database
        final int ADDED_techniqueTAGS = 1000;
        Tag regularTag = new Tag((long) 1, "blå");
        ArrayList<Long> techniqueIds = new ArrayList<>();

        for(int i = 0; i < ADDED_techniqueTAGS ; i++) {
            techniqueTags.add(new TechniqueTag((long) i));
            techniqueTags.get(i).setTag(regularTag);
            techniqueIds.add((long) i);
        }
        assertEquals(ADDED_techniqueTAGS, techniqueTags.size());
       
        // needed for finding the regular tag
        Mockito.when(tagRepository.findById(regularTag.getId())).thenReturn(Optional.of(regularTag));
        
        // We have to search for the techniqueTag first to see if it exists
        Mockito.when(techRepository.findByTechIdAndTagId(anyLong(), anyLong())).thenAnswer(invocation -> {
            for (TechniqueTag w : techniqueTags) {
                if(w.getTechId() == invocation.getArguments()[0] && w.getTag() == invocation.getArguments()[1]) {
                    return w;
                }
            }

            return null;
        });

        // redefinition of the delete function
        doAnswer(new Answer<Void>(){
            public Void answer(InvocationOnMock invocation) {
                if(techniqueIds.contains(invocation.getArguments()[0])) {
                    // find the position of the techniquepair
                    int indexToRemove = techniqueIds.indexOf(invocation.getArguments()[0]);
                    techniqueIds.remove(indexToRemove);
                    techniqueTags.remove(indexToRemove);
                }
                
                return null;
            }
        }).when(techRepository).deleteByTechIdAndTagId(anyLong(), anyLong());

        // remove everything
        for(int i = 0 ; i < ADDED_techniqueTAGS ; i++) {
            techController.deleteTechniqueTagPair(techniqueTags.get(0), regularTag.getId());
            assertEquals(ADDED_techniqueTAGS - (i +1), techniqueTags.size());
        }

        assertEquals(0, techniqueTags.size()); 

        // should return null when attempting to remove a techniqueTag that does not exist
        assertEquals(new ResponseEntity<>(HttpStatus.BAD_REQUEST), techController.deleteTechniqueTagPair(new TechniqueTag((long) 32), regularTag.getId()));   
    }    
    @Test
    void shouldSucceedWhenGettingTagRelations() {
        final long TECHNIQUE_ONE = 3;
        final long TECHNIQUE_TWO = 4;

        ArrayList<Tag> tags = new ArrayList<>();
        Tag regularTag1 = new Tag((long) 1, "blå");
        Tag regularTag2 = new Tag((long) 2, "instant killing technique");
        TechniqueTag techTag1 = new TechniqueTag(TECHNIQUE_ONE);
        TechniqueTag techTag2 = new TechniqueTag(TECHNIQUE_ONE);
        TechniqueTag techTag3 = new TechniqueTag(TECHNIQUE_TWO);
        techTag1.setTag(regularTag1);
        techTag2.setTag(regularTag2);
        techTag3.setTag(regularTag1);

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
        
        // Answer with matching TechniqueTag ids when projection method is called on repository.
        Mockito.when(techRepository.findAllProjectedByTagId(anyLong())).thenAnswer(invocation -> {
            ArrayList<TechniqueTagShort> techIds = new ArrayList<>();
            TechniqueTagShort temp;
            for (TechniqueTag techTag : techniqueTags) {
                if (techTag.getTag() == invocation.getArguments()[0]) {
                    Map<String, Object> sourceMap = Map.of("techId", techTag.getTechId());
                    temp = factory.createProjection(TechniqueTagShort.class, sourceMap);
                    techIds.add(temp);
                }
            }
            return techIds;
            
        });
        
        // Test if relations are empty in the beginning.
        assertEquals(new ResponseEntity<>(HttpStatus.NO_CONTENT), techController.getTechniquesByTags());
        
        // Add some TechniqueTag relations.                
        techniqueTags.add(techTag1);
        techniqueTags.add(techTag2);
        techniqueTags.add(techTag3);

        
        // Create map relation
        HashMap<Long, ArrayList<Long>> relationHashMap = new HashMap<>();
        ArrayList<Long> techIds = new ArrayList<>();
        techIds.add(techTag1.getTechId());
        techIds.add(techTag3.getTechId());
        
        relationHashMap.put(regularTag1.getId(), techIds);

        ArrayList<Long> techIds2 = new ArrayList<>();
        techIds2.add(techTag2.getTechId());

        relationHashMap.put(regularTag2.getId(), techIds2);
        
        // Test if relation is correct.
        assertEquals(new ResponseEntity<>(relationHashMap, HttpStatus.OK), techController.getTechniquesByTags());

        // Test removing a relation.
        techniqueTags.remove(2);
        techIds.remove(1);

        assertEquals(new ResponseEntity<>(relationHashMap, HttpStatus.OK), techController.getTechniquesByTags());

    }
}