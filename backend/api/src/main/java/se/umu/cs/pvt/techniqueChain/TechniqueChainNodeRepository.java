package se.umu.cs.pvt.techniqueChain;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * The Repository class for the techniqueChainNode.
 * @author Team Durian
 * @date 2024-05-29
 * @version 1.0
 */
public interface TechniqueChainNodeRepository extends JpaRepository<TechniqueChainNode, Long> {
    //to finde all the nodes that is in a specific weave id
    @Query("SELECT n FROM TechniqueChainNode n WHERE n.parentWeave = :parentWeaveId")
    List<TechniqueChainNode> findByParentWeaveId(@Param("parentWeaveId") Long parentWeaveId);
    //to finde all nodes that are in a specific weave object.
    List<TechniqueChainNode> findByParentWeave(TechniqueChainWeave parentWeaveId);
}
