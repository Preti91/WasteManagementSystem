//package com.example.WasteManagementSystem.service;
//
//import com.example.WasteManagementSystem.dto.AIClassificationRequest;
//import com.example.WasteManagementSystem.entity.AIClassification;
//import com.example.WasteManagementSystem.repository.AIClassificationRepository;
//import org.springframework.stereotype.Service;
//
//@Service
//public class AIService {
//
//    private final AIClassificationRepository aiClassificationRepository;
//
//    public AIService(AIClassificationRepository aiClassificationRepository) {
//        this.aiClassificationRepository = aiClassificationRepository;
//    }
//
//    public AIClassification classifyWaste(AIClassificationRequest request) {
//
//        // 1. Check input
//        if (request == null ||
//                request.getText() == null ||
//                request.getText().trim().isEmpty()) {
//
//            throw new IllegalArgumentException(
//                    "Waste description cannot be empty"
//            );
//        }
//
//        // 2. Get user's waste description
//        String inputText = request.getText().trim().toLowerCase();
//
//        String wasteType;
//        Boolean recyclable;
//        Double confidence;
//
//        // 3. Non-biodegradable
//        if (inputText.contains("plastic")
//                || inputText.contains("bottle")
//                || inputText.contains("polythene")
//                || inputText.contains("glass")
//                || inputText.contains("metal")
//                || inputText.contains("can")) {
//
//            wasteType = "NON_BIODEGRADABLE";
//            recyclable = true;
//            confidence = 0.95;
//
//        }
//
//        // 4. Biodegradable
//        else if (inputText.contains("food")
//                || inputText.contains("vegetable")
//                || inputText.contains("fruit")
//                || inputText.contains("leaf")
//                || inputText.contains("leaves")
//                || inputText.contains("banana")
//                || inputText.contains("apple")
//                || inputText.contains("organic")) {
//
//            wasteType = "BIODEGRADABLE";
//            recyclable = false;
//            confidence = 0.95;
//
//        }
//
//        // 5. Unknown
//        else {
//
//            wasteType = "UNKNOWN";
//            recyclable = false;
//            confidence = 0.50;
//        }
//
//        // 6. Create classification
//        AIClassification result = new AIClassification();
//
//        result.setInputText(inputText);
//        result.setWasteType(wasteType);
//        result.setRecyclable(recyclable);
//        result.setConfidence(confidence);
//
//        // 7. SAVE TO DATABASE
//        return aiClassificationRepository.save(result);
//    }
//}
//package com.example.WasteManagementSystem.service;
//
//import com.example.WasteManagementSystem.dto.AIClassificationRequest;
//import com.example.WasteManagementSystem.entity.AIClassification;
//import org.springframework.stereotype.Service;
//
//@Service
//public class AIService {
//
//    public AIClassification classifyWaste(AIClassificationRequest request) {
//
//        if (request == null ||
//                request.getText() == null ||
//                request.getText().trim().isEmpty()) {
//
//            throw new IllegalArgumentException(
//                    "Waste description cannot be empty"
//            );
//        }
//
//        String inputText = request.getText().trim().toLowerCase();
//
//        String wasteType;
//        Boolean recyclable;
//        Double confidence;
//
//        if (inputText.contains("plastic")
//                || inputText.contains("bottle")
//                || inputText.contains("polythene")
//                || inputText.contains("glass")
//                || inputText.contains("metal")
//                || inputText.contains("can")) {
//
//            wasteType = "NON_BIODEGRADABLE";
//            recyclable = true;
//            confidence = 0.95;
//
//        } else if (inputText.contains("food")
//                || inputText.contains("vegetable")
//                || inputText.contains("fruit")
//                || inputText.contains("leaf")
//                || inputText.contains("leaves")
//                || inputText.contains("banana")
//                || inputText.contains("apple")
//                || inputText.contains("organic")) {
//
//            wasteType = "BIODEGRADABLE";
//            recyclable = false;
//            confidence = 0.95;
//
//        } else {
//
//            wasteType = "UNKNOWN";
//            recyclable = false;
//            confidence = 0.50;
//        }
//
//        AIClassification result = new AIClassification();
//
//        result.setInputText(inputText);
//        result.setWasteType(wasteType);
//        result.setRecyclable(recyclable);
//        result.setConfidence(confidence);
//
//        return result;
//    }
//}

package com.example.WasteManagementSystem.service;

import com.example.WasteManagementSystem.dto.AIClassificationRequest;
import com.example.WasteManagementSystem.entity.AIClassification;
import org.springframework.stereotype.Service;

@Service
public class AIService {

    public AIClassification classifyWaste(
            AIClassificationRequest request) {

        // ==============================
        // 1. Validate request
        // ==============================

        if (request == null ||
                request.getText() == null ||
                request.getText().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Waste description cannot be empty"
            );
        }

        // ==============================
        // 2. Clean input
        // ==============================

        String inputText =
                request.getText()
                        .trim()
                        .toLowerCase();

        String wasteType;
        Boolean recyclable;
        Double confidence;

        // ==============================
        // 3. AI classification
        // ==============================

        if (inputText.contains("plastic")
                || inputText.contains("bottle")
                || inputText.contains("polythene")
                || inputText.contains("glass")
                || inputText.contains("metal")
                || inputText.contains("can")) {

            wasteType = "NON_BIODEGRADABLE";
            recyclable = true;
            confidence = 0.95;

        } else if (inputText.contains("food")
                || inputText.contains("vegetable")
                || inputText.contains("fruit")
                || inputText.contains("leaf")
                || inputText.contains("leaves")
                || inputText.contains("banana")
                || inputText.contains("apple")
                || inputText.contains("organic")) {

            wasteType = "BIODEGRADABLE";
            recyclable = false;
            confidence = 0.95;

        } else {

            wasteType = "UNKNOWN";
            recyclable = false;
            confidence = 0.50;
        }

        // ==============================
        // 4. Create AI Classification
        // ==============================

        AIClassification result =
                new AIClassification();

        result.setInputText(inputText);
        result.setWasteType(wasteType);
        result.setRecyclable(recyclable);
        result.setConfidence(confidence);

        // IMPORTANT:
        // We return the result.
        // Saving will be done by RecyclingService
        // and GarbageReportService.

        return result;
    }
}