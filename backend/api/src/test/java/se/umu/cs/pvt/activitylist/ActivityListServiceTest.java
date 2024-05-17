package se.umu.cs.pvt.activitylist;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;

import se.umu.cs.pvt.activitylist.Dtos.ActivityListShortDTO;
import se.umu.cs.pvt.user.JWTUtil;
import se.umu.cs.pvt.workout.UserShort;
import se.umu.cs.pvt.workout.UserShortRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Test class for ActivityListService
 * 
 * @author Team Tomato, updated 2024-05-17
 * @since 2024-05-16
 * @version 1.1
 */
public class ActivityListServiceTest {

    @Mock
    private ActivityListRepository activityListRepository;

    @Mock
    private UserShortRepository userShortRepository;

    @Mock
    private JWTUtil jwtUtil;

    @InjectMocks
    private ActivityListService activityListService;

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

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetAllActivityLists_AdminRole() {
        adminMockSetUp();

        ActivityList activityList1 = new ActivityList();
        activityList1.setId(1L);
        activityList1.setName("List 1");
        activityList1.setAuthor(2L);
        ActivityList activityList2 = new ActivityList();
        activityList2.setId(2L);
        activityList2.setName("List 2");
        activityList2.setAuthor(1L);
        List<ActivityList> activityLists = new ArrayList<>();
        activityLists.add(activityList1);
        activityLists.add(activityList2);

        when(activityListRepository.findAll()).thenReturn(activityLists);
        UserShort userShort = new UserShort("ADMIN", 1L);
        Optional<UserShort> optionalUserShort = Optional.of(userShort);

        when(userShortRepository.findById(any())).thenReturn(optionalUserShort);

        List<ActivityListShortDTO> result = activityListService.getAllActivityLists(
                null, null, token);

        assertEquals(2, result.size());
        assertEquals("List 1", result.get(0).getName());
        assertEquals("List 2", result.get(1).getName());
    }

    @Test
    public void testGetAllHiddenActivityLists_AdminRole() {
        adminMockSetUp();

        ActivityList activityList1 = new ActivityList();
        activityList1.setId(1L);
        activityList1.setName("List 1");
        activityList1.setAuthor(2L);
        activityList1.setHidden(false);
        ActivityList activityList2 = new ActivityList();
        activityList2.setId(2L);
        activityList2.setName("List 2");
        activityList2.setAuthor(1L);
        activityList2.setHidden(true);

        List<ActivityList> activityLists = new ArrayList<>();
        activityLists.add(activityList1);
        activityLists.add(activityList2);

        when(activityListRepository.findAll()).thenReturn(activityLists);
        UserShort userShort = new UserShort("ADMIN", 1L);
        Optional<UserShort> optionalUserShort = Optional.of(userShort);

        when(userShortRepository.findById(any())).thenReturn(optionalUserShort);

        List<ActivityListShortDTO> result = activityListService.getAllActivityLists(
                true, null, token);

        assertEquals(1, result.size());
        assertEquals("List 2", result.get(0).getName());
    }

    @Test
    public void testGetAllHiddenActivityListsWhereAuthorIsAdmin_AdminRole() {
        adminMockSetUp();

        ActivityList activityList1 = new ActivityList();
        activityList1.setId(1L);
        activityList1.setName("List 1");
        activityList1.setAuthor(2L);
        activityList1.setHidden(true);
        ActivityList activityList2 = new ActivityList();
        activityList2.setId(2L);
        activityList2.setName("List 2");
        activityList2.setAuthor(1L);
        activityList2.setHidden(true);

        List<ActivityList> activityLists = new ArrayList<>();
        activityLists.add(activityList1);
        activityLists.add(activityList2);

        when(activityListRepository.findAll()).thenReturn(activityLists);
        UserShort userShort = new UserShort("ADMIN", 1L);
        Optional<UserShort> optionalUserShort = Optional.of(userShort);

        when(userShortRepository.findById(any())).thenReturn(optionalUserShort);

        List<ActivityListShortDTO> result = activityListService.getAllActivityLists(
                true, true, token);

        assertEquals(1, result.size());
        assertEquals("List 2", result.get(0).getName());
    }

    @Test
    public void testGetAllActivityLists_AuthorRole() {
        userMockSetup(2L);

        ActivityList activityList1 = new ActivityList();
        activityList1.setId(1L);
        activityList1.setName("List 1");
        activityList1.setAuthor(2L);
        List<ActivityList> activityLists = new ArrayList<>();
        activityLists.add(activityList1);

        when(activityListRepository.findAllByUserId(2L)).thenReturn(activityLists);
        UserShort userShort = new UserShort("USER", 2L);
        Optional<UserShort> optionalUserShort = Optional.of(userShort);

        when(userShortRepository.findById(any())).thenReturn(optionalUserShort);
        List<ActivityListShortDTO> result = activityListService.getAllActivityLists(
                null, true, token);

        assertEquals(1, result.size());
        assertEquals("List 1", result.get(0).getName());
    }

    @Test
    public void testGetAllActivityListsWithHiddenTrue_UserRole() {
        userMockSetup(2L);

        ActivityList activityList1 = new ActivityList();
        activityList1.setId(1L);
        activityList1.setName("List 1");
        activityList1.setHidden(true);
        ActivityList activityList2 = new ActivityList();
        activityList2.setId(2L);
        activityList2.setName("List 2");
        activityList2.setHidden(false);
        List<ActivityList> activityLists = new ArrayList<>();
        activityLists.add(activityList1);
        activityLists.add(activityList2);

        UserShort userShort = new UserShort("USER", 2L);
        Optional<UserShort> optionalUserShort = Optional.of(userShort);

        when(userShortRepository.findById(any())).thenReturn(optionalUserShort);

        when(activityListRepository.findAllByUserId(anyLong())).thenReturn(activityLists);

        List<ActivityListShortDTO> result = activityListService.getAllActivityLists(
                true, null, token);
        assertEquals(1, result.size());
        assertEquals("List 1", result.get(0).getName());

    }

    @Test
    public void testShouldReturnActivityListWhenIsAuthorAndHidden_UserRole() {
        userMockSetup(2L);

        ActivityList activityList1 = new ActivityList();
        activityList1.setId(1L);
        activityList1.setName("List 1");
        activityList1.setHidden(true);
        activityList1.setAuthor(2L);
        List<ActivityList> activityLists = new ArrayList<>();
        activityLists.add(activityList1);

        UserShort userShort = new UserShort("USER", 2L);
        Optional<UserShort> optionalUserShort = Optional.of(userShort);

        when(userShortRepository.findById(any())).thenReturn(optionalUserShort);

        when(activityListRepository.findAllByUserId(2L)).thenReturn(activityLists);

        List<ActivityListShortDTO> result = activityListService.getAllActivityLists(
                true, null, token);
        assertEquals(1, result.size());
        assertEquals("List 1", result.get(0).getName());
    }

    @Test
    public void testShouldReturnEmptyListWhenNoListsAreHidden_UserRole() {
        userMockSetup(2L);

        ActivityList activityList1 = new ActivityList();
        activityList1.setId(1L);
        activityList1.setName("List 1");
        activityList1.setHidden(false);
        ActivityList activityList2 = new ActivityList();
        activityList2.setId(2L);
        activityList2.setName("List 2");
        activityList2.setHidden(false);
        List<ActivityList> activityLists = new ArrayList<>();
        activityLists.add(activityList1);
        activityLists.add(activityList2);

        UserShort userShort = new UserShort("USER", 2L);
        Optional<UserShort> optionalUserShort = Optional.of(userShort);

        when(userShortRepository.findById(any())).thenReturn(optionalUserShort);

        when(activityListRepository.findAllByUserId(anyLong())).thenReturn(activityLists);

        List<ActivityListShortDTO> result = activityListService.getAllActivityLists(
                true, null, token);
        assertEquals(0, result.size());

    }

    @Test
    public void testConvertToActivityListShortDTO() {
        UserShortRepository userShortRepository = mock(UserShortRepository.class);

        ActivityList activityList = new ActivityList();
        activityList.setId(1L);
        activityList.setName("Test list");
        activityList.setAuthor(2L);
        activityList.setHidden(false);

        UserShort author = new UserShort("Author", 2L);

        when(userShortRepository.findById(activityList.getAuthor())).thenReturn(Optional.of(author));

        ActivityListService activityListService = new ActivityListService(userShortRepository, null, null);

        ActivityListShortDTO result = activityListService.convertToActivityListShortDTO(activityList, 3L);

        assertEquals(activityList.getId(), result.getId());
        assertEquals(activityList.getName(), result.getName());
        assertEquals(activityList.getActivityEntries().size(), result.getSize());
        assertEquals("Author", result.getAuthor().getUsername());
        assertEquals(false, result.getIsShared());

        verify(userShortRepository, times(1)).findById(activityList.getAuthor());
    }

    @Test
    public void testRemoveActivityList_ActivityListNotFound() {
        userMockSetup(2L);
        ActivityListRepository activityListRepository = mock(ActivityListRepository.class);

        when(activityListRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> activityListService.removeActivityList(1L, token));

        verify(activityListRepository, never()).delete(any());
    }

}