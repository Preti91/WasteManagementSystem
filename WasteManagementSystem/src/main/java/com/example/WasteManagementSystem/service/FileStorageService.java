//package com.example.WasteManagementSystem.service;
//
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Service;
//import org.springframework.util.StringUtils;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.IOException;
//import java.nio.file.Files;
//import java.nio.file.Path;
//import java.nio.file.Paths;
//import java.util.List;
//import java.util.UUID;
//
///**
// * Stores uploaded images (e.g. garbage report photos) on the local
// * filesystem, outside the jar, and hands back a URL that is served by
// * WebConfig's "/uploads/**" resource handler.
// *
// * This does NOT touch the database - GarbageReport already has an
// * imageUrl column, we're just finally filling it in with a real file.
// */
//@Service
//public class FileStorageService {
//
//    private static final List<String> ALLOWED_EXTENSIONS =
//            List.of("jpg", "jpeg", "png", "webp", "gif");
//
//    private static final long MAX_FILE_SIZE_BYTES = 8L * 1024 * 1024; // 8MB
//
//    @Value("${app.upload.dir:uploads}")
//    private String uploadDir;
//
//    public String storeGarbageImage(MultipartFile file) {
//
//        if (file == null || file.isEmpty()) {
//            throw new IllegalArgumentException("No image file was uploaded.");
//        }
//
//        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
//            throw new IllegalArgumentException(
//                    "Image is too large. Maximum allowed size is 8MB.");
//        }
//
//        String originalName =
//                StringUtils.cleanPath(
//                        file.getOriginalFilename() == null
//                                ? ""
//                                : file.getOriginalFilename());
//
//        String extension = "";
//        int dotIndex = originalName.lastIndexOf('.');
//        if (dotIndex >= 0) {
//            extension = originalName.substring(dotIndex + 1).toLowerCase();
//        }
//
//        if (!ALLOWED_EXTENSIONS.contains(extension)) {
//            throw new IllegalArgumentException(
//                    "Unsupported image type. Allowed types: "
//                            + String.join(", ", ALLOWED_EXTENSIONS));
//        }
//
//        try {
//            Path targetDirectory =
//                    Paths.get(uploadDir, "garbage").toAbsolutePath().normalize();
//
//            Files.createDirectories(targetDirectory);
//
//            String storedFileName = UUID.randomUUID() + "." + extension;
//
//            Path targetFile = targetDirectory.resolve(storedFileName);
//
//            Files.copy(file.getInputStream(), targetFile);
//
//            return "/uploads/garbage/" + storedFileName;
//
//        } catch (IOException e) {
//            throw new RuntimeException(
//                    "Could not save the uploaded image.", e);
//        }
//    }
//}
package com.example.WasteManagementSystem.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final List<String> ALLOWED_EXTENSIONS =
            List.of("jpg", "jpeg", "png", "webp", "gif");

    private static final long MAX_FILE_SIZE_BYTES =
            8L * 1024 * 1024;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;


    // =========================================================
    // STORE GARBAGE REPORT IMAGE
    // =========================================================

    public String storeGarbageImage(MultipartFile file) {

        return storeImage(
                file,
                "garbage"
        );
    }


    // =========================================================
    // STORE RECYCLING IMAGE
    // =========================================================

    public String storeRecyclingImage(MultipartFile file) {

        return storeImage(
                file,
                "recycling"
        );
    }


    // =========================================================
    // COMMON IMAGE STORAGE
    // =========================================================

    private String storeImage(
            MultipartFile file,
            String folder
    ) {

        if (file == null || file.isEmpty()) {

            throw new IllegalArgumentException(
                    "No image file was uploaded."
            );
        }


        // -----------------------------------------------------
        // SIZE CHECK
        // -----------------------------------------------------

        if (file.getSize() > MAX_FILE_SIZE_BYTES) {

            throw new IllegalArgumentException(
                    "Image is too large. Maximum allowed size is 8MB."
            );
        }


        // -----------------------------------------------------
        // ORIGINAL FILE NAME
        // -----------------------------------------------------

        String originalName =
                StringUtils.cleanPath(
                        file.getOriginalFilename() == null
                                ? ""
                                : file.getOriginalFilename()
                );


        // -----------------------------------------------------
        // GET EXTENSION
        // -----------------------------------------------------

        String extension = "";

        int dotIndex =
                originalName.lastIndexOf('.');


        if (dotIndex >= 0) {

            extension =
                    originalName
                            .substring(dotIndex + 1)
                            .toLowerCase();
        }


        // -----------------------------------------------------
        // VALIDATE EXTENSION
        // -----------------------------------------------------

        if (!ALLOWED_EXTENSIONS.contains(extension)) {

            throw new IllegalArgumentException(
                    "Unsupported image type. Allowed types: "
                            + String.join(
                            ", ",
                            ALLOWED_EXTENSIONS
                    )
            );
        }


        // -----------------------------------------------------
        // SAVE FILE
        // -----------------------------------------------------

        try {

            Path targetDirectory =
                    Paths.get(
                                    uploadDir,
                                    folder
                            )
                            .toAbsolutePath()
                            .normalize();


            Files.createDirectories(
                    targetDirectory
            );


            // Unique filename
            String storedFileName =
                    UUID.randomUUID()
                            + "."
                            + extension;


            Path targetFile =
                    targetDirectory.resolve(
                            storedFileName
                    );


            Files.copy(
                    file.getInputStream(),
                    targetFile
            );


            // -------------------------------------------------
            // URL SAVED IN DATABASE
            // -------------------------------------------------

            return "/uploads/"
                    + folder
                    + "/"
                    + storedFileName;


        } catch (IOException e) {

            throw new RuntimeException(
                    "Could not save the uploaded image.",
                    e
            );
        }
    }
}