package se.umu.cs.pvt.commentapi;

/**
 * A projection for a short comment.
 * @author Henrik Aili (c20hai) - Grupp 3 Hawaii
 */
public interface CommentShort {
    /**
     * Returns the id of the comment.
     * @return the id of the comment.
     */
    Long getCommentId();

    /**
     * Returns the content of the comment.
     * @return the content of the comment.
     */
    String getCommentText();
}
