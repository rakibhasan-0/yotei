package se.umu.cs.pvt.tag;

public class TagResponse {
    private long tagId;
    private String tagName;

    public TagResponse(long tagId, String name) {
        this.tagId = tagId;
        this.tagName = name;
    }

    public long getTagId() {
        return tagId;
    }

    public String getTagName() {
        return tagName;
    }
}
