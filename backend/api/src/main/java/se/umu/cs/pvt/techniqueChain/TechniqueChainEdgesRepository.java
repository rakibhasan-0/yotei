package se.umu.cs.pvt.techniqueChain;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

/**
 * The Repository for the TechniqueChainEdges.
 * @author Team Durian
 * @date 2024-05-29
 * @version 1.0
 */
public interface TechniqueChainEdgesRepository  extends JpaRepository<TechniqueChainEdges, Long> {
    //to get all the edges going from a node
    List<TechniqueChainEdges> findByFromNode_Id(Long fromNodeId);
}
