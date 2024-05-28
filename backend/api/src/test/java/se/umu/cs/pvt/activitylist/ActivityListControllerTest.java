package se.umu.cs.pvt.activitylist;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import org.springframework.http.MediaType;

import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import se.umu.cs.pvt.activitylist.Dtos.*;
import se.umu.cs.pvt.user.JWTUtil;
import se.umu.cs.pvt.user.User;
import se.umu.cs.pvt.workout.UserShort;
import se.umu.cs.pvt.workout.UserShortRepository;

/**
 * Test class for ActivityListController
 * 
 * @author Team Tomato, updated 2024-05-16, updated 2024-05-27
 * @since 2024-05-08
 * @version 1.0
 */
@WebMvcTest(controllers = ActivityListController.class)
@ExtendWith(MockitoExtension.class)
public class ActivityListControllerTest {
    @MockBean
    private ActivityListRepository listRepository;

    @MockBean
    private ActivityListService listService;

    @MockBean
    private UserShortRepository userShortRepository;

    @MockBean
    private JWTUtil jwtUtil;

    @Autowired
    private ActivityListController listController;

    @Autowired
    private MockMvc mockMvc;

    private final LocalDate testDate = LocalDate.of(2024, 4, 3);

    private ActivityList list = new ActivityList(1L, 1L, "test", "king", false, testDate);

    ObjectMapper objectMapper = new ObjectMapper();

    private static User admin;
    private static User nonAdmin;

    private String token = "testtoken123";
    private DecodedJWT mockJwt;
    private Claim mockClaim;

    public void adminMockSetUp() {
        mockJwt = Mockito.mock(DecodedJWT.class);
        mockClaim = Mockito.mock(Claim.class);
        when(mockClaim.asLong()).thenReturn(1L);
        when(mockJwt.getClaim("userId")).thenReturn(mockClaim);
        when(jwtUtil.validateToken(token)).thenReturn(mockJwt);
    }

    public void userMockSetup(Long userId) {
        mockJwt = Mockito.mock(DecodedJWT.class);
        mockClaim = Mockito.mock(Claim.class);
        when(mockClaim.asLong()).thenReturn(userId);
        when(mockJwt.getClaim("userId")).thenReturn(mockClaim);
        when(jwtUtil.validateToken(token)).thenReturn(mockJwt);
    }

    @BeforeAll
    public static void userSetUp() throws Exception {
        admin = new User("author", "password123");
        admin.setUserId(1L);

        nonAdmin = new User("nonAuthor", "password123");
        nonAdmin.setUserId(2L);
    }

    @AfterEach
    public void tearDown() {
        token = null;
        mockJwt = null;
        mockClaim = null;
    }

    @Test
    public void sanityCheck() {
        assertThat(listController).isNotNull();
    }

    @Test
    public void shouldSucceedAddingList() throws Exception {
        when(listRepository.findByName("xx")).thenReturn(null);
        String jsonContent = "{\"id\":1,\"author\":1,\"name\":\"xx\",\"desc\":\"king\",\"hidden\":true,\"date\":[2024,5,3],\"userId\":2}";
        mockMvc.perform(post("/api/activitylists/add").contentType(MediaType.APPLICATION_JSON).content(jsonContent)
                .header("token", token)).andExpect(status().isCreated());
    }

    @Test
    public void shouldSucceedRemoveList() throws Exception {
        when(listRepository.findById(Mockito.any())).thenReturn(Optional.of(list));
        String jsonContent = "{\"author\": 1, \"name\": \"xx\", \"desc\":\"hej\", \"hidden\": true, \"date\" : \"[2024,5,3]\", \"userId\": 2}";
        mockMvc.perform(delete("/api/activitylists/remove").contentType(MediaType.APPLICATION_JSON).content(jsonContent)
                .param("id", "1").header("token", token)).andExpect(status().isOk());
    }

    @Test
    public void shouldReturn403WhenTryingToRemoveAListCreatedByAnotherUser() throws Exception {
        doThrow(ForbiddenException.class)
                .when(listService)
                .removeActivityList(eq(1L), eq(token)); // Assuming the list id is 1L

        mockMvc.perform(delete("/api/activitylists/remove").header("token", token).param("id", "1"))
                .andExpect(status().isForbidden());
    }

    @Test
    public void shouldSucceedUpdatingActivityList() throws Exception {
        when(listRepository.findById(Mockito.any())).thenReturn(Optional.of(list));
        String jsonContent = "{\"id\":1,\"name\":\"xx\",\"desc\":\"king\",\"hidden\":true,\"date\":[2024,5,3]}";
        mockMvc.perform(put("/api/activitylists/edit").contentType(MediaType.APPLICATION_JSON).content(jsonContent)
                .header("token", token))
                .andExpect(status().isOk());
    }

}
