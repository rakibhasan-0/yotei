package se.umu.cs.pvt.techniqueChain;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TechniqueChainNodeRepository extends JpaRepository<TechniqueChainNode, Long> {
    List<TechniqueChainNode> findByParentWeave(Long parentWeave);
}
