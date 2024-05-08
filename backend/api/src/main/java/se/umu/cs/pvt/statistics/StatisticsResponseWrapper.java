package se.umu.cs.pvt.statistics;

import java.io.Serializable;
import java.util.List;

 /**
  * Wrapper to keep a list of StatisticsResponse along with other information 
  * such as the number of sessions and the average rating for the sessions.
  *
  * @author Cocount 
  * @version 1.0
  * @since 2024-05-03
  */
public class StatisticsResponseWrapper implements Serializable {

    private Integer numberOfSessions;
    private Double averageRating;
    private List<StatisticsResponse> statisticsResponses;

    /**
    * Create a new instance of StatisticsResponse.
    * @param numberOfSessions number of session reviews that the activites was part of.
    * @param averageRating average rating of the underlying session reviews.
    * @param statisticsResponses list of activities that matched the filter.
    * @return new StatisticsResponseWrapper
    */
    public StatisticsResponseWrapper(Integer numberOfSessions, Double averageRating, List<StatisticsResponse> statisticsResponses) {
        this.numberOfSessions = numberOfSessions;
        this.averageRating = averageRating;
        this.statisticsResponses = statisticsResponses;
    }   

    /**
    * Public getter for private property numberOfSessions
    * @return number of sessions
    */
    public Integer getNumberOfSessions() {
        return this.numberOfSessions;
    }

    /**
    * Public getter for private property numberOfSessions
    * @return average rating of underlying session reviews.
    */
    public Double getAverageRating() {
        return this.averageRating;
    }  

    /**
    * Public getter for private property statisticsResponses
    * @return list of activities formatted using the StatisticsResponse type.
    */
    public List<StatisticsResponse> getActivities() {
        return this.statisticsResponses;
    }
}
