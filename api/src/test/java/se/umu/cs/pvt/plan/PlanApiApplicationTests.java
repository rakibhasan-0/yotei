package se.umu.cs.pvt.plan;
/**
 * A test-class for the Plan-controller API-methods
 *
 * @author Calzone
 */

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;


@ExtendWith(MockitoExtension.class)
class PlanApiApplicationTests
{

    @Mock
    private final PlanRepository repository = Mockito.mock(PlanRepository.class);
    @Autowired
    private PlanController controller;
    @Test
    void contextLoads() {
        assertThat(controller).isNotNull();
    }

    private final Plan ex1 = new Plan(1L, "namn 1", "#F12F12", 1L);
    private final Plan ex2 = new Plan(2L, "namn 2", "#983229", 2L);
    private final Plan ex3 = new Plan(3L, "namn 3", "#2342A2", 1L);
    ArrayList<Plan> plans;
    @BeforeEach
    void init() {
        controller = new PlanController(repository);
        plans = new ArrayList<>();
        plans.add(ex1);
        plans.add(ex2);
        plans.add(ex3);
    }

    @Test
    void testUpdatingANonExistingPlan() {
        Mockito.when(repository.findById(ex1.getId())).thenReturn(Optional.empty());
        controller.updatePlan(ex1);
        assertEquals(HttpStatus.NOT_FOUND, controller.updatePlan(ex1).getStatusCode());
    }

    @Test
    void testUpdatingWithoutId() {
        Plan invalidPlan = new Plan(null, "name", "#FFFFFF", 1L);
        ResponseEntity<Plan> response = controller.updatePlan(invalidPlan);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void testUpdateWithNullAttributes() {
        Plan invalidPlan = new Plan(1L, "color", null, null);
        ResponseEntity<Plan> response = controller.updatePlan(invalidPlan);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void testUpdateWithInvalidColorCode() {
        Plan invalidPlan = new Plan(1L, "name", "invalid hex code", 1L);
        ResponseEntity<Plan> response = controller.updatePlan(invalidPlan);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void testAddWithInvalidColorCode() {
        Plan invalidPlan = new Plan(null, "name", "invalid hex code", 1L);
        ResponseEntity<Plan> response = controller.postPlan(invalidPlan);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void testAddWithNullAttributes() {
        Plan invalidPlan = new Plan(null, null, null, 1L);
        ResponseEntity<Plan> response = controller.postPlan(invalidPlan);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void updateExistingPlanShouldSucceed() {
        Mockito.when(repository.findById(ex1.getId())).thenReturn(Optional.of(ex1));
        assertEquals(HttpStatus.OK, controller.updatePlan(ex1).getStatusCode());
    }

    @Test
    void getAllOnEmptyTable() {
        ResponseEntity response = controller.getAllPlan();
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void getNonExistingPlanFromUserID() {
        ResponseEntity response = controller.getPlanByUserID(3L);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void addNothingShouldFail() {
        ResponseEntity<Plan> response = controller.postPlan(new Plan());
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void addPlanShouldSucceed() {
        Plan ex4 = new Plan(null, "namn 4", "#123456", 2L);
        ResponseEntity<Plan> response = controller.postPlan(ex4);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
    }

    @Test
    void removeNoneExistingPlan() {
        ResponseEntity responseEntity = controller.removePlan(72L);
        assertEquals(HttpStatus.NOT_FOUND, responseEntity.getStatusCode());
    }

    @Test
    void removeExistingPlan () {
        Mockito.when(repository.findById(ex1.getId())).thenReturn(Optional.of(ex1));
        assertEquals(HttpStatus.OK, controller.removePlan(ex1.getId()).getStatusCode());
    }
}
