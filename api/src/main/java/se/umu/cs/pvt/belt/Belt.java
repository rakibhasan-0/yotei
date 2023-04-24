package se.umu.cs.pvt.belt;

import javax.persistence.*;
import java.io.Serializable;

/**
 * A belt entity for Spring
 *
 * @author Max Thorén
 * @author Andre Byström
 * date: 2023-04-24
 */
@Entity()
@Table(name = "belt")
public class Belt implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "belt_id")
    private long id;

    @Column(nullable = false, name = "belt_name")
    private String name;

    @Column(nullable = false, name = "belt_color")
    private String color;

    @Column(nullable = false, name = "is_child")
    private boolean isChild;

    /**
     * No-args constructor required JPA spec
     */
    protected Belt() {
    }

    public Belt(Long id, String name, String color, boolean isChild) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.isChild = isChild;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getColor() {
        return color;
    }

    public boolean isChild() {
        return isChild;
    }
}
