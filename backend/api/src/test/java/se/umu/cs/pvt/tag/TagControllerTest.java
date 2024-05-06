package se.umu.cs.pvt.tag;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.stubbing.Answer;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doAnswer;

/**
 * The tests for the Tag part of the Tag API.
 * @Author Team 5 Verona
 * @Author Phoenix (25-04-2023)
 * @Author Team 3 (Durian)
 * @since 2024-05-02
 */
@ExtendWith(MockitoExtension.class)
class TagControllerTest {

    private TagController tagController;
    private ArrayList<Tag> tags;

    @Mock
    private final TagRepository tagRepository = Mockito.mock(TagRepository.class);

    @BeforeEach
    void init() {
        tagController = new TagController(tagRepository);
        tags = new ArrayList<>();

        Mockito.lenient().when(tagRepository.findAll()).thenReturn(tags);
    }

    @Test
    void shouldSucceedWhenFindingAllTags() {
        tags.add(new Tag((long) 1, "blå"));
        tags.add(new Tag((long) 2, "svart"));
        tags.add(new Tag((long) 3, "benövning"));
        tags.add(new Tag((long) 4, "nybörjare"));

        assertEquals(new ResponseEntity<>(tags, HttpStatus.OK), tagController.getTags());
    }

    @Test
    void shouldSucceedWhenAddingTag() {
        Tag tag = new Tag((long) 1, "blå");

        // Saves a tag in the database (mock)
        Mockito.when(tagRepository.save(Mockito.any())).thenAnswer(invocation -> {
            tags.add((Tag) invocation.getArguments()[0]);
            return null;
        });

        tagController.postTag(tag);
        assertFalse(tagRepository.findAll().isEmpty());
        assertEquals(tag, tagRepository.findAll().get(0));
    }

    @Test
    void shouldSucceedWhenWhenRemovingTag() {
        final int ADDED_TAGS = 1000;
        ArrayList<Long> tagIds = new ArrayList<>();

        for (int i = 0; i < ADDED_TAGS; i++) {
            tags.add(new Tag((long) i, String.valueOf(i)));
            tagIds.add((long) i);
        }
        assertEquals(ADDED_TAGS, tags.size());

        Mockito.when(tagRepository.findById(anyLong())).thenReturn(Optional.of(tags.get(0)));

        doAnswer(new Answer<Void>() {
            public Void answer(InvocationOnMock invocation) {
                if (tagIds.contains(invocation.getArguments()[0])) {
                    int indexToRemove = tagIds.indexOf(invocation.getArguments()[0]);
                    tagIds.remove(indexToRemove);
                    tags.remove(indexToRemove);
                }
                return null;
            }
        }).when(tagRepository).deleteById(anyLong());

        for (int i = 0; i < ADDED_TAGS; i++) {
            tagController.removeTag(tags.get(0).getId());
            assertEquals(ADDED_TAGS - (i + 1), tags.size());
        }
        assertEquals(0, tagRepository.findAll().size());
    }

    @Test
    void shouldSucceedWhenUpdatingTag() {
        Tag firstTag = new Tag(1L, "firstTag");
        
        when(tagRepository.findById(firstTag.getId())).thenReturn(Optional.of(firstTag));
    
        Tag updatedTag = new Tag(1L, "updatedTag");
    
        ResponseEntity<TagResponse> responseEntity = tagController.updateTag(firstTag.getId(), updatedTag);
        
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertNotNull(responseEntity.getBody());
        assertEquals(firstTag.getId(), responseEntity.getBody().getTagId());
        assertEquals(updatedTag.getName().toLowerCase(), responseEntity.getBody().getTagName().toLowerCase());
    }    
}
