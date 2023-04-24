package se.umu.cs.pvt.techniqueapi;

/**
 * TechniqueShort is a projection that makes JPA
 * only return the name and id of the technique.
 */
public interface TechniqueShort {
    Long getId();
    String getName();
}
