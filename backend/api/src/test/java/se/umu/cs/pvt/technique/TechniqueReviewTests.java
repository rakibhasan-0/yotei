package se.umu.cs.pvt.technique;

import org.junit.jupiter.api.Test;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

public class TechniqueReviewTests {

    /**
     * @author  Team Granatäpple (Group 1) (2024-4-19)
     */
    @Test
    void shouldGetIdOfReview() {
        TechniqueReview review = new TechniqueReview((long) 1,0,4,10,"","",null);
        assertEquals(1,review.getId().intValue());
        TechniqueReview review2 = new TechniqueReview((long) 3,0,4,10,"","",null);
        assertNotEquals(1,review2.getId().intValue());

    }

    @Test
    void shouldGetRatingOfReview() {
        TechniqueReview review = new TechniqueReview((long)1,3,4,10,"","",null);
        assertEquals(3,review.getRating());
        TechniqueReview review2 = new TechniqueReview((long)1,2,4,10,"","",null);
        assertNotEquals(3,review2.getRating());
    }

    @Test
    void shouldGetUserIdOfReview() {
        TechniqueReview review = new TechniqueReview((long)1,3,4,10,"","",null);
        assertEquals(4,review.getUserId());
        TechniqueReview review2 = new TechniqueReview((long)1,2,5,10,"","",null);
        assertNotEquals(4,review2.getRating());
    }


    @Test
    void shouldGetPositiveCommentOfReview() {
        TechniqueReview review = new TechniqueReview((long)1,3,4, 10, "What a nice car you've built!","",null);
        assertEquals("What a nice car you've built!",review.getPositiveComment());
        TechniqueReview review2 = new TechniqueReview((long)1,2,5, 10, "I left junk in your yard.","",null);
        assertNotEquals("What a nice car you've built!",review2.getPositiveComment());
    }


    @Test
    void shouldGetNegativeCommentOfReview() {
        TechniqueReview review = new TechniqueReview((long)1,3,4,10,"","You need a steering wheel!",null);
        assertEquals("You need a steering wheel!",review.getNegativeComment());
        TechniqueReview review2 = new TechniqueReview((long)1,2,5,10,"","You need wheels on the car",null);
        assertNotEquals("You need a steering wheel!",review2.getNegativeComment());
    }

    @Test
    void shouldGetDateOfReview() {
        Date date1 = new Date(1648930522000L);
        TechniqueReview review = new TechniqueReview((long)1,3,4,10,"","You need a steering wheel!", date1);
        assertEquals(date1,review.getDate());
        Date date2 = new Date(1648950522000L);
        TechniqueReview review2 = new TechniqueReview((long)1,2,5,10,"","You need wheels on the car",date2);
        assertNotEquals(date1,review2.getDate());
    }

    @Test
    void shouldGetTechniqueIdOfReview() {
        TechniqueReview review = new TechniqueReview((long)1,3,4, 10,"","You need a steering wheel!",null);
        assertEquals(10,review.getTechniqueId());
        TechniqueReview review2 = new TechniqueReview((long)1,2,5,20,"","You need wheels on the car",null);
        assertNotEquals(10,review2.getTechniqueId());
    }
}