package se.umu.cs.pvt.export;

import java.util.List;

/**
 * Container class for json formatting.
 *
 * @author Andre Byström
 * date: 2023-04-25
 */
public class TechniqueContainer {
    private List<TechniqueExportResponse> techniques;

    public TechniqueContainer(List<TechniqueExportResponse> techniques) {
        this.techniques = techniques;
    }

    public TechniqueContainer() {

    }

    public List<TechniqueExportResponse> getTechniques() {
        return techniques;
    }
}
