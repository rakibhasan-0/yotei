package se.umu.cs.pvt.media;

import org.apache.commons.io.FileUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

import java.io.File;
import java.io.IOException;

public class MediaStorageOnDiskServiceTest {
    private String path = "path";
    private MediaStorageOnDiskService mediaStorageOnDiskService;

    @BeforeEach
    void init() {
        mediaStorageOnDiskService = new MediaStorageOnDiskService(path);
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

    @Test
    void storeDuplicateFileTest() throws IOException {
        String fileName = "testFile";
        String ending =".tmp";
        MultipartFile multipartFile = new MockMultipartFile(fileName + ending,
                fileName + ending,null, "Hello World".getBytes());

        mediaStorageOnDiskService.store(multipartFile);
        mediaStorageOnDiskService.store(multipartFile);

        assertThat(FileUtils.readFileToString(new File(path + fileName +"(1)" +ending ), "UTF-8"))
                .isEqualTo("Hello World");

        //Teardown: remove the files created by test
        FileUtils.deleteQuietly(new File(path + fileName + ending));
        FileUtils.deleteQuietly(new File(path + fileName + "(1)" + ending));

    }


    @Test
    void storeTwoDuplicateFileTest() throws IOException {
        String fileName = "testFile";
        String ending =".tmp";
        MultipartFile multipartFile = new MockMultipartFile(fileName + ending,
                fileName + ending,null, "Hello World".getBytes());

        mediaStorageOnDiskService.store(multipartFile);
        mediaStorageOnDiskService.store(multipartFile);
        String name2= mediaStorageOnDiskService.store(multipartFile);
        System.out.println(name2);
        assertThat(FileUtils.readFileToString(new File(path + fileName +"(2)" +ending ), "UTF-8"))
                .isEqualTo("Hello World");

        //Teardown: remove the files created by test
        FileUtils.deleteQuietly(new File(path + fileName + ending));
        FileUtils.deleteQuietly(new File(path + fileName + "(1)" + ending));
        FileUtils.deleteQuietly(new File(path + fileName + "(2)" + ending));

    }

    @Test
    void storeDuplicateFilesWithoutFileEndingTest() throws IOException {
        String fileName = "testFile";
        MultipartFile multipartFile = new MockMultipartFile(fileName ,
                fileName ,null, "Hello World".getBytes());

        mediaStorageOnDiskService.store(multipartFile);
        mediaStorageOnDiskService.store(multipartFile);

        assertThat(FileUtils.readFileToString(new File(path + fileName +"(1)" ), "UTF-8"))
                .isEqualTo("Hello World");

        //Teardown: remove the files created by test
        FileUtils.deleteQuietly(new File(path + fileName ));
        FileUtils.deleteQuietly(new File(path + fileName + "(1)"));

    }


    @Test
    void storeFileWithoutNameTest() throws IOException {
        String fileName = "";
        MultipartFile multipartFile = new MockMultipartFile("file" ,
                fileName ,null, "Hello World".getBytes());

        mediaStorageOnDiskService = new MediaStorageOnDiskService("/");

        assertThrows(IllegalArgumentException.class, () -> {mediaStorageOnDiskService.store(multipartFile);});

    }

    @Test
    void loadAsResourceTest() throws IOException {
        String fileName = "testFile.tmp";
        MultipartFile multipartFile = new MockMultipartFile(fileName ,
                fileName ,null, "Hello World".getBytes());

        mediaStorageOnDiskService.store(multipartFile);

        FileSystemResource fileAsResource = (FileSystemResource) mediaStorageOnDiskService.loadAsResource(fileName);

        assertTrue(fileAsResource.exists());

        //Teardown. Delete created file.
        FileUtils.deleteQuietly(new File(path + fileName ));
    }

    @Test
    void loadAsResourceNotExistTest() throws IOException {
        String fileName = "testFile.tmp";

        assertThrows(IOException.class, () -> {mediaStorageOnDiskService.loadAsResource(fileName);});
    }

    @Test
    void deleteTest() throws IOException {
        String fileName = "testFile.tmp";
        MultipartFile multipartFile = new MockMultipartFile(fileName ,
                fileName ,null, "Hello World".getBytes());

        mediaStorageOnDiskService.store(multipartFile);
        mediaStorageOnDiskService.delete( fileName);

        assertFalse(new File(path + fileName ).exists());
    }





}
