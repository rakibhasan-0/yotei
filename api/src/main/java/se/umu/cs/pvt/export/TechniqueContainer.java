package se.umu.cs.pvt.export;

import java.util.List;

/**
 * Container class for json formatting.
 *
 * @author Andre Byström
 * date: 2023-04-25
 */
public class TechniqueContainer {
    private List<TechniqueExport> techniques;

    public TechniqueContainer(List<TechniqueExport> techniques) {
        this.techniques = techniques;
    }

    public List<TechniqueExport> getTechniques() {
        return techniques;
    }
}
