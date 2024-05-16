package se.umu.cs.pvt.technique;

/**
 * TechniqueShort is a projection that makes JPA
 * only return the name and id of the technique.
 */
public interface TechniqueShort {

    /**
     * Returns the id of the technique.
     * @return the id of the technique
     */
    Long getId();

    /**
     * Returns the name of the technique.
     * @return the name of the technique
     */
    String getName();
}
