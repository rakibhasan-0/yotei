package se.umu.cs.pvt.activitylist;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Optional;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.databind.ObjectMapper;

import se.umu.cs.pvt.exercise.Exercise;
import se.umu.cs.pvt.exercise.ExerciseRepository;
import se.umu.cs.pvt.technique.Technique;
import se.umu.cs.pvt.technique.TechniqueRepository;
import se.umu.cs.pvt.user.JWTUtil;

@WebMvcTest(controllers = ActivityListEntryController.class)
@ExtendWith(MockitoExtension.class)
public class ActivityListEntryControllerTest {
    @MockBean
    private ActivityListEntryRepository listEntryRepository;

    @MockBean
    private ActivityListRepository listRepository;

    @MockBean
    private ExerciseRepository exerciseRepository;

    @MockBean
    private TechniqueRepository techniqueRepository;

    @MockBean
    private JWTUtil jwtUtil;

    @Autowired
    private MockMvc mockMvc;

    private final LocalDate testDate = LocalDate.of(2024, 4, 3);
    private ActivityList list = new ActivityList(1L, 1L, "test", "king", false, testDate);

    private String token = "testtoken123";
    private DecodedJWT mockJwt;
    private Claim mockClaim;

    public void userMockSetup(Long userId) {
        mockJwt = Mockito.mock(DecodedJWT.class);
        mockClaim = Mockito.mock(Claim.class);
        when(mockClaim.asLong()).thenReturn(userId);
        when(mockClaim.asString()).thenReturn("USER");
        when(mockJwt.getClaim("userId")).thenReturn(mockClaim);
        when(mockJwt.getClaim("role")).thenReturn(mockClaim);
        when(jwtUtil.validateToken(token)).thenReturn(mockJwt);
    }

    @Test
    public void shouldSucceedReturningAllEntriesFromAList() throws Exception {
        userMockSetup(1L);
        when(listRepository.findById(Mockito.any())).thenReturn(Optional.of(list));
        List<ActivityListEntry> entries = new ArrayList<>();
        ActivityListEntry entry1 = new ActivityListEntry(1L, 1L, null, 30L);
        ActivityListEntry entry2 = new ActivityListEntry(2L, 1L, 10L, null);
        entries.add(entry1);
        entries.add(entry2);
        Technique technique = new Technique(30L, "Grymteknik", "uuuuh");
        Exercise exercise = new Exercise(30L, "wow", "moo", 20);
        when(exerciseRepository.findById(Mockito.any())).thenReturn(Optional.of(exercise));
        when(techniqueRepository.findById(Mockito.any())).thenReturn(Optional.of(technique));
        when(listEntryRepository.findAllByActivityListId(Mockito.any())).thenReturn(entries);

        mockMvc.perform(get("/api/activitylistentry/all/1").header("token", token))
                .andExpect(status().isOk())
                .andDo(print());
    }

    @Test
    public void shouldSucceedAddingEntryToList() throws Exception {
        userMockSetup(1L);
        when(listRepository.findById(Mockito.any())).thenReturn(Optional.of(list));
        String jsonContent = "{\"listId\":1, \"exerciseId\":20, \"techniqueId\":null}";

        mockMvc.perform(post("/api/activitylistentry/add").contentType(MediaType.APPLICATION_JSON).content(jsonContent)
                .header("token", token))
                .andExpect(status().isOk())
                .andDo(print());
    }

    @Test
    public void shouldSucceedRemovingEntryFromList() throws Exception {
        userMockSetup(1L);
        ActivityListEntry entry = new ActivityListEntry(1L, 1L, 20L, null);
        when(listEntryRepository.findById(Mockito.any())).thenReturn(Optional.of(entry));
        when(listRepository.findById(Mockito.any())).thenReturn(Optional.of(list));

        mockMvc.perform(delete("/api/activitylistentry/remove").contentType(MediaType.APPLICATION_JSON)
                .header("id", "1").header("token", token))
                .andExpect(status().isOk())
                .andDo(print());
    }

    @Test
    public void shouldSucceedAtAddingEntryToMultipleLists() throws Exception {
        userMockSetup(1L);

        String jsonContent = "{\"listId\":4, \"exerciseId\":20, \"techniqueId\":null}";

        ObjectMapper mapper = new ObjectMapper();
        ActivityListEntry entry = mapper.readValue(jsonContent, ActivityListEntry.class);

        ActivityList list1 = new ActivityList(4L, 1L, "boom", "baam", null, testDate);
        ActivityList list2 = new ActivityList(5L, 1L, "dang", "baam", null, testDate);
        ActivityList list3 = new ActivityList(6L, 1L, "doom", "baam", null, testDate);
        when(listRepository.findById(entry.getListId())).thenReturn(Optional.of(list1));
        when(listRepository.findById(4L)).thenReturn(Optional.of(list1));
        when(listRepository.findById(5L)).thenReturn(Optional.of(list2));
        when(listRepository.findById(6L)).thenReturn(Optional.of(list3));

        mockMvc.perform(post("/api/activitylistentry/multiAdd").contentType(MediaType.APPLICATION_JSON)
                .content(jsonContent).header("ids", "5,6").header("token", token))
                .andExpect(status().isOk())
                .andDo(print());

    }

}
