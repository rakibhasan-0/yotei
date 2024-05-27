package se.umu.cs.pvt.techniqueChain;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TechniqueChainEdgesRepository  extends JpaRepository<TechniqueChainEdges, Long> {
    List<TechniqueChainEdges> findByFromNode_Id(Long fromNodeId);
}
