package se.umu.cs.pvt.media;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.util.stream.Stream;

public interface StorageService {

    String store(MultipartFile file) throws IOException;

    Path load(String filename);

    Resource loadAsResource(String filename) throws IOException;

    void deleteAll() throws IOException;

    void delete(String filename) throws IOException;

}
