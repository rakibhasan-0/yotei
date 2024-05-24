package se.umu.cs.pvt.techniqueChain;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TechniqueChainNodeRepository extends JpaRepository<TechniqueChainNode, Long> {
    @Query("SELECT n FROM TechniqueChainNode n WHERE n.parentWeave = :parentWeaveId")
    List<TechniqueChainNode> findByParentWeaveId(@Param("parentWeaveId") Long parentWeaveId);
    List<TechniqueChainNode> findByParentWeave(TechniqueChainWeave parentWeaveId);
}
