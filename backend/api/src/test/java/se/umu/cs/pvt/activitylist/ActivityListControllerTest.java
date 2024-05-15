package se.umu.cs.pvt.activitylist;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
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
import se.umu.cs.pvt.user.User.Role;
import se.umu.cs.pvt.workout.UserShort;

@WebMvcTest(controllers = ActivityListController.class)
@ExtendWith(MockitoExtension.class)
public class ActivityListControllerTest {
    @MockBean
    private ActivityListRepository listRepository;

    @MockBean
    private ActivityListService listService;

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
        when(mockClaim.asString()).thenReturn("ADMIN");
        when(mockJwt.getClaim("userId")).thenReturn(mockClaim);
        when(mockJwt.getClaim("role")).thenReturn(mockClaim);
        when(jwtUtil.validateToken(token)).thenReturn(mockJwt);
    }

    public void userMockSetup(Long userId) {
        mockJwt = Mockito.mock(DecodedJWT.class);
        mockClaim = Mockito.mock(Claim.class);
        when(mockClaim.asLong()).thenReturn(userId);
        when(mockClaim.asString()).thenReturn("USER");
        when(mockJwt.getClaim("userId")).thenReturn(mockClaim);
        when(mockJwt.getClaim("role")).thenReturn(mockClaim);
        when(jwtUtil.validateToken(token)).thenReturn(mockJwt);
    }

    @BeforeAll
    public static void userSetUp() throws Exception {
        admin = new User("author", "password123");
        admin.setUserRole(Role.ADMIN);
        admin.setUserId(1L);

        nonAdmin = new User("nonAuthor", "password123");
        nonAdmin.setUserRole(Role.USER);
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
        adminMockSetUp();
        mockMvc.perform(post("/api/activitylists/add").contentType(MediaType.APPLICATION_JSON).content(jsonContent)
                .header("token", token)).andExpect(status().isCreated());
    }

    @Test
    public void shouldReturn403WhenTryingToCreateAListForAnotherUser() throws Exception {
        userMockSetup(3L);
        String jsonContent = "{\"id\":2,\"author\":2,\"name\":\"xx\",\"desc\":\"queen\",\"hidden\":true,\"date\":[2024,5,7],\"userId\":2}";
        mockMvc.perform(post("/api/activitylists/add").contentType(MediaType.APPLICATION_JSON).content(jsonContent)
                .header("token", token)).andExpect(status().isForbidden());
    }

    @Test
    public void shouldSucceedRemoveList() throws Exception {
        when(listRepository.findById(Mockito.any())).thenReturn(Optional.of(list));
        String jsonContent = "{\"author\": 1, \"name\": \"xx\", \"desc\":\"hej\", \"hidden\": true, \"date\" : \"[2024,5,3]\", \"userId\": 2}";
        adminMockSetUp();
        mockMvc.perform(delete("/api/activitylists/remove").contentType(MediaType.APPLICATION_JSON).content(jsonContent)
                .param("id", "1").header("token", token)).andExpect(status().isOk());
    }

    @Test
    public void shouldReturn403WhenTryingToRemoveAListCreatedByAnotherUser() throws Exception {
        when(listRepository.findById(Mockito.any())).thenReturn(Optional.of(list));
        userMockSetup(2L);
        mockMvc.perform(delete("/api/activitylists/remove").header("token", token).param("id", "1"))
                .andExpect(status().isForbidden());
    }

    @Test
    public void shouldSucceedUpdatingActivityList() throws Exception {
        when(listRepository.findById(Mockito.any())).thenReturn(Optional.of(list));
        userMockSetup(1L);
        String jsonContent = "{\"id\":1,\"author\":1,\"name\":\"xx\",\"desc\":\"king\",\"hidden\":true,\"date\":[2024,5,3]}";
        mockMvc.perform(post("/api/activitylists/edit").contentType(MediaType.APPLICATION_JSON).content(jsonContent)
                .header("token", token))
                .andExpect(status().isOk());
    }

    @Test
    public void shouldReturn403WhenTryingToEditAListCreatedByAnotherUser() throws Exception {
        when(listRepository.findById(Mockito.any())).thenReturn(Optional.of(list));
        userMockSetup(2L);
        String jsonContent = "{\"id\":1,\"author\":1,\"name\":\"xx\",\"desc\":\"king\",\"hidden\":true,\"date\":[2024,5,3]}";

        mockMvc.perform(post("/api/activitylists/edit").contentType(MediaType.APPLICATION_JSON).content(jsonContent)
                .header("token", token))
                .andExpect(status().isForbidden());
    }

    @Test
    public void shouldSucceedAtGettingAllListsWhenUserIsAuthor() throws Exception {
        userMockSetup(1L);
        List<ActivityListDTO> dtos = new ArrayList<>();
        List<ActivityList> lists = new ArrayList<>();
        ActivityList testList = new ActivityList(2L, 1L, "List name", "description", false, testDate);
        ActivityListDTO dto = new ActivityListDTO(testList);
        dtos.add(dto);
        lists.add(testList);

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        when(listRepository.findAllByAuthor(Mockito.any())).thenReturn(lists);

        mockMvc.perform(get("/api/activitylists/userlists").header("token", token))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(dtos)));
    }

    @Test
    public void shouldReturn204WhenTryingToGetListsWhenUserIsAuthorButNonExists() throws Exception {
        userMockSetup(2L);
        when(listRepository.findAllByAuthor(Mockito.any())).thenReturn(new ArrayList<>());

        mockMvc.perform(get("/api/activitylists/userlists").header("token", token)).andExpect(status().isNoContent());
    }

    @Test
    public void shouldReturnAllAccessibleLists() throws Exception {

        List<ActivityListShortDTO> activityLists = new ArrayList<>();
        UserShortDTO userShortDTO = new UserShortDTO(new UserShort("USER", 3L));
        ActivityListShortDTO testListDTO = new ActivityListShortDTO(1L, "Test list", 5, userShortDTO, false);

        activityLists.add(testListDTO);
        when(listService.getAllAccessibleActivityListsDTO(mockJwt, null, null)).thenReturn(activityLists);
        mockMvc.perform(get("/api/activitylists/").header("token", token)).andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(activityLists)));
    }

}
