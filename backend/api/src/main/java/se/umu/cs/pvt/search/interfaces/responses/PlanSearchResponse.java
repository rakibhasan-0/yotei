package se.umu.cs.pvt.search.interfaces.responses;

import java.util.ArrayList;
import java.util.List;

/**
 * This class represents the Plan object returned
 * from the API.
 *
 * @author Minotaur (James Eriksson)
 * 
 */
public class PlanSearchResponse {
    private Long planID;
    private List<ColorObject> planColors = new ArrayList<>();
    private List<SessionObject> sessions = new ArrayList<>();

    public PlanSearchResponse(
            Long planID,
            String beltColor,
            String beltName,
            Boolean isChild,
            Long sessionID,
            String sessionDate,
            String sessionTime,
            String sessionText) {
        this.planID = planID;
        addSession(sessionID, sessionDate, sessionTime, sessionText);
        addPlanColor(beltColor, beltName, isChild);
    }

    public Long getPlanID() {
        return planID;
    }

    public List<ColorObject> getPlanColors() {
        return planColors;
    }

    public List<SessionObject> getSessions() {
        return sessions;
    }

    public void addPlanColor(String beltColor, String beltName, Boolean isChild){
        if(beltColor == null) return;

        planColors.add(new ColorObject(beltColor, beltName, isChild));
    }

    public void addSession(Long sessionID, String sessionDate, String sessionTime, String sessionText){
        if(sessionID == null) return;

        sessions.add(new SessionObject(sessionID, sessionDate, sessionTime, sessionText));
    }

	/**
	  * Private class representing what colour a plan is connected to.
      *
	  * @author Minotaur (James Eriksson)
	 */
    private class ColorObject {
        private String beltColor;
        private String beltName;
        private Boolean isChild;

        public ColorObject(String beltColor, String beltName, Boolean isChild){
            this.beltColor = beltColor;
            this.beltName = beltName;
            this.isChild = isChild;
        }

        public String getBeltColor() {
            return beltColor;
        }

        public String getBeltName() {
            return beltName;
        }

        public Boolean getChild() {
            return isChild;
        }
    }

	/**
	  * Private class representing what session a plan is connected to.
      *
	  * @author Minotaur (James Eriksson)
	 */
    private class SessionObject {
        private Long sessionID;
        private String sessionDate;
        private String sessionTime;
        private String sessionText;

        public SessionObject(Long sessionID, String sessionDate, String sessionTime, String sessionText){
            this.sessionID = sessionID;
            this.sessionDate = sessionDate;
            this.sessionTime = sessionTime;
            this.sessionText = sessionText;
        }

        public Long getSessionID() {
            return sessionID;
        }

        public String getSessionDate() {
            return sessionDate;
        }

        public String getSessionTime() {
            return sessionTime;
        }

        public String getSessionText() {
            return sessionText;
        }
    }
}
