package se.umu.cs.pvt.statistics;

import java.io.Serializable;
import java.util.List;

public class StatisticsResponseWrapper implements Serializable {

    private Integer numberOfSessions;
    private Double averageRating;
    private List<StatisticsResponse> statisticsResponses;

    public StatisticsResponseWrapper(Integer numberOfSessions, Double averageRating, List<StatisticsResponse> statisticsResponses) {
        this.numberOfSessions = numberOfSessions;
        this.averageRating = averageRating;
        this.statisticsResponses = statisticsResponses;
    }   

    public Integer getNumberOfSessions() {
        return this.numberOfSessions;
    }

    public Double getAverageRating() {
        return this.averageRating;
    }

    public List<StatisticsResponse> getActivities() {
        return this.statisticsResponses;
    }
}
