package se.umu.cs.pvt.plan;
/**
 * A test-class for the Plan-controller API-methods
 *
 * @author Calzone, Phoenix (25-04-2023)
 */

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import se.umu.cs.pvt.belt.Belt;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

@WebMvcTest(controllers = PlanController.class)
@ExtendWith(MockitoExtension.class)
class PlanApiApplicationTests {
    @MockBean
    private PlanRepository repository;

    @Autowired
    private PlanController controller;

    @Test
    void contextLoads() {
        assertThat(controller).isNotNull();
    }

    private final Belt belt1 = new Belt(1L, "Vitt", "#F12F12", false);
    private final Belt belt2 = new Belt(2L, "Brunt", "#FFFFFF", true);
    private final Belt belt3 = new Belt(3L, "Svart", "#000000", false);
    private final Set<Belt> belts = new HashSet<>();
    private final Plan ex1 = new Plan(1L, "namn 1", 1L, belts);
    private final Plan ex2 = new Plan(2L, "namn 2", 2L, belts);
    private final Plan ex3 = new Plan(3L, "namn 3", 1L, belts);
    private ArrayList<Plan> plans;

    @BeforeEach
    void init() {
        plans = new ArrayList<>();
        plans.add(ex1);
        plans.add(ex2);
        plans.add(ex3);

        belts.add(belt1);
        belts.add(belt2);
        belts.add(belt3);
    }


    @Test
    void shouldFailWhenUpdatingANonExistingPlan() {
        Mockito.when(repository.findById(ex1.getId())).thenReturn(Optional.empty());
        controller.updatePlan(ex1);
        assertEquals(HttpStatus.NOT_FOUND, controller.updatePlan(ex1).getStatusCode());
    }


    @Test
    void shouldFailWhenUpdatingWithoutId() {
        Plan invalidPlan = new Plan(null, "name", 1L, belts);
        ResponseEntity<Plan> response = controller.updatePlan(invalidPlan);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }


    @Test
    void shouldFailWhenUpdatingWithNullAttributes() {
        Plan invalidPlan = new Plan(1L, "color", null, null);
        ResponseEntity<Plan> response = controller.updatePlan(invalidPlan);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }


    @Test
    void shouldFailWhenUpdatingWithInvalidBeltSet() {
        Plan invalidPlan = new Plan(1L, "name", 1L, null);
        ResponseEntity<Plan> response = controller.updatePlan(invalidPlan);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }


    @Test
    void shouldFailWhenAddingPlanWithBeltsBeingNull() {
        Plan invalidPlan = new Plan(null, "name", 1L, null);
        ResponseEntity<Plan> response = controller.postPlan(invalidPlan);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }


    @Test
    void shouldFailWhenAddingPlanWithNullAttributes() {
        Plan invalidPlan = new Plan(null, null, 1L, null);
        ResponseEntity<Plan> response = controller.postPlan(invalidPlan);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }


    @Test
    void shouldSucceedUpdatingExistingPlan() {
        Mockito.when(repository.findById(ex1.getId())).thenReturn(Optional.of(ex1));
        assertEquals(HttpStatus.OK, controller.updatePlan(ex1).getStatusCode());
    }


    @Test
    void shouldFailWhenGettingAllPlansFromEmptyTable() {
        ResponseEntity response = controller.getAllPlan();
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void shouldFailWhenAddNothing() {
        ResponseEntity<Plan> response = controller.postPlan(new Plan());
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void shouldSucceedWhenAddingPlan() {
        Plan ex4 = new Plan(null, "namn 4", 2L, belts);
        ResponseEntity<Plan> response = controller.postPlan(ex4);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
    }

    @Test
    void shouldFailWhenRemovingNoneExistingPlan() {
        ResponseEntity responseEntity = controller.removePlan(72L);
        assertEquals(HttpStatus.NOT_FOUND, responseEntity.getStatusCode());
    }

    @Test
    void shouldSucceedWhenRemovingExistingPlan() {
        Mockito.when(repository.findById(ex1.getId())).thenReturn(Optional.of(ex1));
        assertEquals(HttpStatus.OK, controller.removePlan(ex1.getId()).getStatusCode());
    }
}