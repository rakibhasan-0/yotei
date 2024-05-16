package se.umu.cs.pvt.export;

import javax.persistence.*;

/**
 * Represents a belt export entity.
 *
 * @author Max Thorén
 * date 2023-05-17
 * @version 1.0
 */
@Entity
@Table(name= "belt")
public class BeltExport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "belt_id")
    private long id;

    /**
     * no-args constructor required by JPA spec
     * this one is protected since it shouldn't be used directly
     */
    protected BeltExport() {}

    /**
     * Creates a belt.
     * @param id Id of the belt.
     */
    public BeltExport(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }
}
