package se.umu.cs.pvt.technique;


import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

/**
 * Entity for the technique_review table.
 * 
 *  Documentation Granatäpple dv22alo
 *  JPA (Java Persistence API)
 * 
 *  TechniqueReview.java - TechniqueReview class. Represents the technique Entity.
 *  TechniqueReviewRepository.java (Interface) - JPARepository file.
 *  TechniqueReviewReturnInterface.java - Interface for returning information about reviews.
 *
 * @author Team Granatäpple (Group 1) (2024-4-19)
 */
@Entity
public class TechniqueReview implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "review_id")
    private Long id;
    @Column(nullable = false, name = "rating")
    private int rating;

    @Column(nullable = false, name = "user_id")
    private int userId;

    @Column(nullable = false, name = "technique_id")
    private int techniqueId;

    @Column(name = "positive_comment")
    private String positiveComment;

    @Column(name = "negative_comment")
    private String negativeComment;
    @Column(nullable = false, name = "review_date")
    private Date date;

    /**
     * Protected constructor.
     *
     * Required by JPA.
     */
    protected TechniqueReview() {

    }

    /**
     * Constructor for techniqueReview.
     *
     * @param id Id for the review.
     * @param rating Rating for the review.
     * @param userId Id of user that created the review.
     * @param techniqueId Id of the technique the review is for.
     * @param positiveComment Comment about the positives in review.
     * @param negativeComment Comment about the negatives in review.
     * @param date Date that review was created.
     */
    public TechniqueReview(Long id, int rating, int userId, int techniqueId, String positiveComment, String negativeComment, Date date) {
        this.id = id;
        this.rating = rating;
        this.userId = userId;
        this.techniqueId = techniqueId;
        this.positiveComment = positiveComment;
        this.negativeComment = negativeComment;
        this.date = date;
    }

    /**
     * Getter for Id.
     *
     * @return id.
     */
    public Long getId() {
        return id;
    }

    /**
     * Getter for rating.
     *
     * @return rating.
     */
    public int getRating() {
        return rating;
    }

    /**
     * Getter for user id.
     *
     * @return userId.
     */
    public int getUserId() {
        return userId;
    }

    /**
     * Getter for positive comment.
     *
     * @return positiveComment.
     */
    public String getPositiveComment() {
        return positiveComment;
    }

    /**
     * Getter for negative comment.
     *
     * @return negativeComment.
     */
    public String getNegativeComment() {
        return negativeComment;
    }

    /**
     * Getter for date.
     *
     * @return date.
     */
    public Date getDate() {
        return date;
    }

    /**
     * Getter for technique id.
     *
     * @return techniqueId.
     */
    public int getTechniqueId() {
        return techniqueId;
    }

    /**
     * Setter for Id.
     */
    public void setId(Long id){
        this.id = id;
    }
}
