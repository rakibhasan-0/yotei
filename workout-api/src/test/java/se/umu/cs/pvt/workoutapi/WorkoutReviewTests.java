package se.umu.cs.pvt.workoutapi;

import org.junit.jupiter.api.Test;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

public class WorkoutReviewTests {

    @Test
    void getIdOfReview() {
        WorkoutReview review = new WorkoutReview((long) 1,0,4,10,"","",null);
        assertEquals(1,review.getId().intValue());
        WorkoutReview review2 = new WorkoutReview((long) 3,0,4,10,"","",null);
        assertNotEquals(1,review2.getId().intValue());

    }

    @Test
    void getRatingOfReview() {
        WorkoutReview review = new WorkoutReview((long)1,3,4,10,"","",null);
        assertEquals(3,review.getRating());
        WorkoutReview review2 = new WorkoutReview((long)1,2,4,10,"","",null);
        assertNotEquals(3,review2.getRating());
    }

    @Test
    void getUserIdOfReview() {
        WorkoutReview review = new WorkoutReview((long)1,3,4,10,"","",null);
        assertEquals(4,review.getUserId());
        WorkoutReview review2 = new WorkoutReview((long)1,2,5,10,"","",null);
        assertNotEquals(4,review2.getRating());
    }


    @Test
    void getPositiveCommentOfReview() {
        WorkoutReview review = new WorkoutReview((long)1,3,4, 10, "Snyggt byggt, fräsig kärra!","",null);
        assertEquals("Snyggt byggt, fräsig kärra!",review.getPositiveComment());
        WorkoutReview review2 = new WorkoutReview((long)1,2,5, 10, "Jag har lämnat lite skrot på gården din.","",null);
        assertNotEquals("Snyggt byggt, fräsig kärra!",review2.getPositiveComment());
    }


    @Test
    void getNegativeCommentOfReview() {
        WorkoutReview review = new WorkoutReview((long)1,3,4,10,"","Man behöver en ratt!",null);
        assertEquals("Man behöver en ratt!",review.getNegativeComment());
        WorkoutReview review2 = new WorkoutReview((long)1,2,5,10,"","Man behöver hjul på bilen!",null);
        assertNotEquals("Man behöver en ratt!",review2.getNegativeComment());
    }

    @Test
    void getDateOfReview() {
        Date date1 = new Date(1648930522000L);
        WorkoutReview review = new WorkoutReview((long)1,3,4,10,"","Man behöver en ratt!", date1);
        assertEquals(date1,review.getDate());
        Date date2 = new Date(1648950522000L);
        WorkoutReview review2 = new WorkoutReview((long)1,2,5,10,"","Man behöver hjul på bilen!",date2);
        assertNotEquals(date1,review2.getDate());
    }

    @Test
    void getWorkoutIdOfReview() {
        WorkoutReview review = new WorkoutReview((long)1,3,4, 10,"","Man behöver en ratt!",null);
        assertEquals(10,review.getWorkoutId());
        WorkoutReview review2 = new WorkoutReview((long)1,2,5,20,"","Man behöver hjul på bilen!",null);
        assertNotEquals(10,review2.getWorkoutId());
    }
}
