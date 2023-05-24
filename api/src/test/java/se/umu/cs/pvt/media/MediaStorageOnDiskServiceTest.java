package se.umu.cs.pvt.media;

import org.apache.commons.io.FileUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.File;
import java.io.IOException;

public class MediaStorageOnDiskServiceTest {
    private String path = "path";
    private MediaStorageOnDiskService mediaStorageOnDiskService = new MediaStorageOnDiskService(path);

    @BeforeEach
    void init() {

    }

    @Test
    void storeFileTest() throws IOException {
        String fileName = "testFile.tmp";
        MultipartFile multipartFile = new MockMultipartFile(fileName,fileName,null, "Hello World".getBytes());
        mediaStorageOnDiskService.store(multipartFile);

        assertThat(FileUtils.readFileToString(new File(path + fileName), "UTF-8"))
                .isEqualTo("Hello World");

        //Teardown: remove the file created by test
        FileUtils.deleteQuietly(new File(path + fileName));
    }

}
