package se.umu.cs.pvt.technique;

import java.util.Date;

/**
 * Interface for returning information about reviews.
 *
 * NOTE: The names contain keywords, DO NOT CHANGE NAMES OF METHODS unless you know
 * what you're doing.
 *
 * @author Team Granatäpple (Group 1)
 */
public interface TechniqueReviewReturnInterface {

    Long getReview_id();

    int getUser_id();
    int getRating();
    String getPositive_comment();
    String getNegative_comment();
    Date getReview_date();

    int getTechnique_id();
    String getUsername();

}
