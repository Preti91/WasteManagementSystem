package com.example.WasteManagementSystem.service;

import org.springframework.stereotype.Service;

@Service
public class ChatbotService {

    public String getResponse(String userMessage) {

        if (userMessage == null ||
                userMessage.trim().isEmpty()) {

            return "Please enter a message so I can help you.";

        }

        String message =
                userMessage.toLowerCase().trim();


        // =====================================================
        // GREETINGS
        // =====================================================

        if (message.equals("hi") ||
                message.equals("hello") ||
                message.equals("hey") ||
                message.contains("good morning") ||
                message.contains("good afternoon") ||
                message.contains("good evening")) {

            return "Hello! 👋 I am WasteBot, your RecycleX waste management assistant. "
                    + "I can help you with garbage reporting, recycling, waste classification, "
                    + "garbage collection, rewards and report status.";

        }


        // =====================================================
        // WHO ARE YOU
        // =====================================================

        if (message.contains("who are you") ||
                message.contains("what are you") ||
                message.contains("what is wastebot")) {

            return "I am WasteBot 🤖, the virtual assistant of RecycleX. "
                    + "I provide information about garbage management, recycling, "
                    + "waste segregation and the services available in RecycleX.";

        }


        // =====================================================
        // HOW TO REPORT GARBAGE
        // =====================================================

        if (message.contains("report garbage") ||
                message.contains("report waste") ||
                message.contains("garbage report") ||
                message.contains("how to report") ||
                message.contains("report a garbage")) {

            return "To report garbage, open the Report Garbage section "
                    + "of RecycleX. Enter the waste description, location and "
                    + "upload an image if required. Submit the report and it "
                    + "can be processed by the cleaning team.";

        }


        // =====================================================
        // GARBAGE COLLECTION
        // =====================================================

        if (message.contains("garbage collection") ||
                message.contains("collect garbage") ||
                message.contains("pickup garbage") ||
                message.contains("garbage pickup") ||
                message.contains("clean garbage") ||
                message.contains("cleaning worker")) {

            return "After a garbage report is submitted, it can be reviewed "
                    + "and assigned to a cleaning worker. The worker can then "
                    + "collect or clean the reported waste.";

        }


        // =====================================================
        // RECYCLING
        // =====================================================

        if (message.contains("recycle") ||
                message.contains("recycling") ||
                message.contains("recyclable")) {

            return "Recycling means processing used materials so they can "
                    + "be converted into useful products again. Common "
                    + "recyclable materials include paper, cardboard, glass, "
                    + "metal and suitable plastics.";

        }


        // =====================================================
        // WHAT CAN BE RECYCLED
        // =====================================================

        if (message.contains("what can i recycle") ||
                message.contains("what can be recycled") ||
                message.contains("recyclable items") ||
                message.contains("recyclable materials")) {

            return "Common recyclable materials include paper, cardboard, "
                    + "glass bottles, metal cans and many types of plastic. "
                    + "Always keep recyclable materials clean and dry.";

        }


        // =====================================================
        // PLASTIC
        // =====================================================

        if (message.contains("plastic")) {

            return "Plastic should be separated from other waste. "
                    + "Clean and dry plastic containers can often be recycled. "
                    + "Avoid mixing plastic with food waste or other contaminated materials.";

        }


        // =====================================================
        // PAPER
        // =====================================================

        if (message.contains("paper") ||
                message.contains("cardboard")) {

            return "Paper and cardboard are generally recyclable when they "
                    + "are clean and dry. Keep them away from wet and food-contaminated waste.";

        }


        // =====================================================
        // GLASS
        // =====================================================

        if (message.contains("glass") ||
                message.contains("glass bottle")) {

            return "Glass bottles and containers are generally recyclable. "
                    + "Keep them separate from other waste and handle broken glass carefully.";

        }


        // =====================================================
        // METAL
        // =====================================================

        if (message.contains("metal") ||
                message.contains("metal can") ||
                message.contains("tin can")) {

            return "Metal cans and containers are commonly recyclable. "
                    + "Where possible, empty and clean them before placing them with recyclable waste.";

        }


        // =====================================================
        // FOOD WASTE
        // =====================================================

        if (message.contains("food waste") ||
                message.contains("organic waste") ||
                message.contains("kitchen waste") ||
                message.contains("vegetable waste")) {

            return "Food and kitchen waste is generally organic waste. "
                    + "It can often be composted and converted into useful compost "
                    + "instead of being mixed with recyclable materials.";

        }


        // =====================================================
        // BIODEGRADABLE
        // =====================================================

        if (message.contains("biodegradable") ||
                message.contains("biodegrade")) {

            return "Biodegradable waste can naturally decompose through "
                    + "biological processes. Examples include food scraps, "
                    + "vegetable peels, fruit waste, leaves and garden waste.";

        }


        // =====================================================
        // NON-BIODEGRADABLE
        // =====================================================

        if (message.contains("non biodegradable") ||
                message.contains("non-biodegradable")) {

            return "Non-biodegradable waste does not easily decompose naturally. "
                    + "Examples include many plastics, glass and some synthetic materials. "
                    + "These should be properly recycled or disposed of.";

        }


        // =====================================================
        // WASTE SEGREGATION
        // =====================================================

        if (message.contains("segregation") ||
                message.contains("segregate waste") ||
                message.contains("separate waste") ||
                message.contains("separate garbage")) {

            return "Waste segregation means separating waste into different categories "
                    + "such as biodegradable, recyclable and non-recyclable waste. "
                    + "Proper segregation makes recycling and waste processing easier.";

        }


        // =====================================================
        // WASTE TYPES
        // =====================================================

        if (message.contains("types of waste") ||
                message.contains("waste types") ||
                message.contains("different waste")) {

            return "Common waste categories include biodegradable waste, "
                    + "recyclable waste, non-biodegradable waste, electronic waste "
                    + "and hazardous waste.";

        }


        // =====================================================
        // E-WASTE
        // =====================================================

        if (message.contains("e-waste") ||
                message.contains("electronic waste") ||
                message.contains("electronics")) {

            return "E-waste includes discarded electronic devices such as "
                    + "phones, computers, chargers and electronic equipment. "
                    + "It should be given to authorized e-waste collection or recycling facilities.";

        }


        // =====================================================
        // HAZARDOUS WASTE
        // =====================================================

        if (message.contains("hazardous waste") ||
                message.contains("dangerous waste")) {

            return "Hazardous waste may contain substances that can harm people "
                    + "or the environment. It should not be mixed with normal household waste "
                    + "and should be handled through appropriate disposal facilities.";

        }


        // =====================================================
        // COMPOSTING
        // =====================================================

        if (message.contains("compost") ||
                message.contains("composting")) {

            return "Composting is the process of naturally breaking down organic "
                    + "materials such as food scraps and garden waste into nutrient-rich compost.";

        }


        // =====================================================
        // AI CLASSIFICATION
        // =====================================================

        if (message.contains("ai") ||
                message.contains("classification") ||
                message.contains("classify waste") ||
                message.contains("identify waste") ||
                message.contains("image classification")) {

            return "RecycleX can use AI-based waste classification to analyze "
                    + "waste information or images and help identify the type of waste, "
                    + "such as biodegradable or non-biodegradable waste.";

        }


        // =====================================================
        // WASTE IMAGE
        // =====================================================

        if (message.contains("upload image") ||
                message.contains("waste image") ||
                message.contains("garbage photo") ||
                message.contains("garbage picture")) {

            return "You can upload an image of the garbage when submitting a report "
                    + "if the Report Garbage section supports image uploads. "
                    + "The image can help identify and process the reported waste.";

        }


        // =====================================================
        // RECYCLING REQUEST
        // =====================================================

        if (message.contains("recycling pickup") ||
                message.contains("recycle pickup") ||
                message.contains("recycling request")) {

            return "For recyclable waste, use the Recycling section of RecycleX "
                    + "to submit a recycling request. The request can then be "
                    + "processed and assigned to the appropriate recycling worker.";

        }


        // =====================================================
        // RECYCLING WORKER
        // =====================================================

        if (message.contains("recycling worker") ||
                message.contains("recycle worker")) {

            return "A recycling worker handles eligible recycling requests "
                    + "and helps collect recyclable materials for further processing.";

        }


        // =====================================================
        // CLEANING WORKER
        // =====================================================

        if (message.contains("cleaning worker") ||
                message.contains("cleaning staff")) {

            return "A cleaning worker can be assigned to handle reported garbage "
                    + "and cleaning tasks submitted through the RecycleX system.";

        }


        // =====================================================
        // REPORT STATUS
        // =====================================================

        if (message.contains("status") ||
                message.contains("my report") ||
                message.contains("report status")) {

            return "You can check the status of your submitted garbage reports "
                    + "from the My Reports section. The status may change as the "
                    + "report is reviewed, assigned and completed.";

        }


        // =====================================================
        // REWARDS
        // =====================================================

        if (message.contains("reward") ||
                message.contains("points") ||
                message.contains("earn points") ||
                message.contains("earn rewards")) {

            return "RecycleX can provide rewards or points for eligible "
                    + "waste-management activities such as responsible reporting "
                    + "and recycling participation.";

        }


        // =====================================================
        // LEADERBOARD
        // =====================================================

        if (message.contains("leaderboard") ||
                message.contains("ranking") ||
                message.contains("rank")) {

            return "The leaderboard can show users according to their eligible "
                    + "waste-management activities and earned points.";

        }


        // =====================================================
        // ENVIRONMENT
        // =====================================================

        if (message.contains("environment") ||
                message.contains("pollution") ||
                message.contains("save environment")) {

            return "Proper waste management helps reduce pollution, conserve "
                    + "resources, protect ecosystems and keep communities cleaner.";

        }


        // =====================================================
        // REDUCE WASTE
        // =====================================================

        if (message.contains("reduce waste") ||
                message.contains("how to reduce waste") ||
                message.contains("less waste")) {

            return "You can reduce waste by avoiding unnecessary purchases, "
                    + "reusing items, choosing reusable products, repairing items "
                    + "when possible and recycling suitable materials.";

        }


        // =====================================================
        // REUSE
        // =====================================================

        if (message.contains("reuse") ||
                message.contains("reusing")) {

            return "Reuse means using an item again instead of throwing it away. "
                    + "For example, reusable containers, bags and bottles can reduce waste.";

        }


        // =====================================================
        // THREE R
        // =====================================================

        if (message.contains("3r") ||
                message.contains("three r") ||
                message.contains("reduce reuse recycle")) {

            return "The three Rs of waste management are Reduce, Reuse and Recycle. "
                    + "They help minimize waste and conserve resources.";

        }


        // =====================================================
        // LOGIN
        // =====================================================

        if (message.contains("login") ||
                message.contains("log in") ||
                message.contains("sign in") ||
                message.contains("how to login")) {

            return "To login to RecycleX, open the Login page and enter your registered "
                    + "email and password. After successful login, you will be redirected "
                    + "to the appropriate dashboard based on your role.";

        }


        // =====================================================
        // REGISTER / SIGN UP
        // =====================================================

        if (message.contains("register") ||
                message.contains("registration") ||
                message.contains("sign up") ||
                message.contains("create account") ||
                message.contains("new account")) {

            return "To create a RecycleX account, open the Register page and provide "
                    + "the required details. After registration, you can login using "
                    + "your registered credentials.";

        }


        // =====================================================
        // FORGOT PASSWORD
        // =====================================================

        if (message.contains("forgot password") ||
                message.contains("forget password") ||
                message.contains("forgot my password") ||
                message.contains("forgotten password") ||
                message.contains("reset password") ||
                message.contains("change password")) {

            return "If you forgot your RecycleX password, use the Forgot Password "
                    + "or Password Reset option on the Login page if available. "
                    + "If you cannot reset your password, please contact RecycleX "
                    + "support at 9123040662.";

        }


        // =====================================================
        // PASSWORD HELP
        // =====================================================

        if (message.contains("password") ||
                message.contains("login password")) {

            return "For account security, keep your RecycleX password private and "
                    + "do not share it with anyone. If you cannot access your account, "
                    + "use the password reset option or contact support at 9123040662.";

        }


        // =====================================================
        // LOGOUT
        // =====================================================

        if (message.contains("logout") ||
                message.contains("log out") ||
                message.contains("sign out")) {

            return "You can logout from RecycleX using the Logout option in the "
                    + "navigation menu or dashboard. Always logout when using a "
                    + "shared or public computer.";

        }


        // =====================================================
        // DASHBOARD
        // =====================================================

        if (message.contains("dashboard") ||
                message.contains("my dashboard") ||
                message.contains("user dashboard")) {

            return "Your RecycleX dashboard provides access to important features "
                    + "such as your reports, recycling requests, notifications, "
                    + "rewards, points and other account-related information.";

        }


        // =====================================================
        // MY REPORTS
        // =====================================================

        if (message.contains("my reports") ||
                message.contains("submitted reports") ||
                message.contains("previous reports") ||
                message.contains("reported garbage")) {

            return "You can view your submitted garbage reports from the My Reports "
                    + "section of your RecycleX dashboard. You can track the progress "
                    + "of reports that you have submitted.";

        }


        // =====================================================
        // REPORT LOCATION
        // =====================================================

        if (message.contains("garbage location") ||
                message.contains("waste location") ||
                message.contains("map location")) {

            return "When reporting garbage, provide the correct waste location. "
                    + "RecycleX can use map and location features to help identify "
                    + "where the garbage has been reported.";

        }


        // =====================================================
        // CURRENT LOCATION / GPS
        // =====================================================

        if (message.contains("current location") ||
                message.contains("my gps") ||
                message.contains("gps location") ||
                message.contains("use my location")) {

            return "RecycleX can use your device location to help identify the "
                    + "location of reported waste. Make sure you allow location "
                    + "permission in your browser when requested.";

        }


        // =====================================================
        // MAP
        // =====================================================

        if (message.equals("map") ||
                message.contains("google map") ||
                message.contains("map feature") ||
                message.contains("search location")) {

            return "The RecycleX map feature helps users select or search for the "
                    + "location of waste. You can use the location search and map "
                    + "features while submitting a garbage or recycling request.";

        }


        // =====================================================
        // IMAGE UPLOAD
        // =====================================================

        if (message.contains("upload photo") ||
                message.contains("upload a photo") ||
                message.contains("upload picture") ||
                message.contains("add photo") ||
                message.contains("add image")) {

            return "You can upload a waste image while submitting a garbage report "
                    + "when image upload is available. A clear image can help with "
                    + "waste identification and processing.";

        }


        // =====================================================
        // AI WASTE DETECTION
        // =====================================================

        if (message.contains("detect waste") ||
                message.contains("detect garbage") ||
                message.contains("ai detect") ||
                message.contains("ai identify") ||
                message.contains("identify garbage")) {

            return "RecycleX can use AI-based classification to help identify the "
                    + "type of waste from available waste information or images. "
                    + "The classification can assist with proper waste segregation.";

        }


        // =====================================================
        // BIO WASTE
        // =====================================================

        if (message.contains("bio waste") ||
                message.contains("biowaste") ||
                message.contains("wet waste")) {

            return "Bio or wet waste generally includes food scraps, vegetable peels, "
                    + "fruit waste and other organic materials. It should preferably "
                    + "be separated from dry recyclable waste and can often be composted.";

        }


        // =====================================================
        // DRY WASTE
        // =====================================================

        if (message.contains("dry waste") ||
                message.contains("dry garbage")) {

            return "Dry waste includes materials such as paper, cardboard, plastics, "
                    + "glass and metals. Keep dry recyclable materials clean and "
                    + "separated from wet or food waste.";

        }


        // =====================================================
        // HOW TO RECYCLE
        // =====================================================

        if (message.contains("how to recycle") ||
                message.contains("how do i recycle") ||
                message.contains("recycle my waste") ||
                message.contains("request recycling")) {

            return "To request recycling through RecycleX, open the Recycling section, "
                    + "provide the required waste details and submit your recycling request. "
                    + "The request can then be assigned to a recycling worker.";

        }


        // =====================================================
        // RECYCLING REQUEST STATUS
        // =====================================================

        if (message.contains("recycling status") ||
                message.contains("recycle request status") ||
                message.contains("status of recycling")) {

            return "You can track your recycling request from the appropriate "
                    + "Recycling or dashboard section. A request may move through "
                    + "stages such as pending, assigned, pickup in progress and completed.";

        }


        // =====================================================
        // RECYCLING PICKUP
        // =====================================================

        if (message.contains("when will recycling be picked") ||
                message.contains("when will recycling pickup") ||
                message.contains("recycling collection")) {

            return "After a recycling request is submitted and assigned, the "
                    + "recycling worker can handle the pickup. Check your recycling "
                    + "request status for the latest progress.";

        }


        // =====================================================
        // NOTIFICATIONS
        // =====================================================

        if (message.contains("notification") ||
                message.contains("notifications") ||
                message.contains("alerts")) {

            return "RecycleX notifications can keep users and workers informed "
                    + "about important activities such as task assignments, "
                    + "recycling updates and completed requests.";

        }


        // =====================================================
        // HOW TO EARN POINTS
        // =====================================================

        if (message.contains("how to earn points") ||
                message.contains("how can i earn points") ||
                message.contains("get points")) {

            return "You can earn eligible RecycleX points through responsible "
                    + "waste-management activities supported by the system, such "
                    + "as reporting waste and participating in recycling activities.";

        }


        // =====================================================
        // MY REWARDS
        // =====================================================

        if (message.contains("reward balance") ||
                message.contains("my rewards") ||
                message.contains("reward points")) {

            return "You can view your available reward points and eligible rewards "
                    + "from the Rewards section of your RecycleX dashboard.";

        }


        // =====================================================
        // LEADERBOARD POSITION
        // =====================================================

        if (message.contains("top users") ||
                message.contains("who is top") ||
                message.contains("my leaderboard position")) {

            return "The RecycleX leaderboard ranks eligible users according to "
                    + "their earned points and waste-management activities.";

        }


        // =====================================================
        // USER ROLE
        // =====================================================

        if (message.contains("user role") ||
                message.contains("my role") ||
                message.contains("roles")) {

            return "RecycleX supports different roles for managing the waste "
                    + "management process, including USER, ADMIN, CLEANING_WORKER "
                    + "and RECYCLING_WORKER.";

        }


        // =====================================================
        // ADMIN
        // =====================================================

        if (message.equals("admin") ||
                message.contains("administrator") ||
                message.contains("what does admin do")) {

            return "The RecycleX administrator manages important system operations "
                    + "such as reviewing reports, assigning cleaning tasks, assigning "
                    + "recycling tasks and managing the overall waste-management workflow.";

        }


        // =====================================================
        // CLEANING TASK
        // =====================================================

        if (message.contains("cleaning task") ||
                message.contains("cleaning assignment") ||
                message.contains("garbage cleaning task")) {

            return "A cleaning task can be created from a reported garbage case "
                    + "and assigned to a cleaning worker. The worker can then handle "
                    + "the reported waste and update the task progress.";

        }


        // =====================================================
        // RECYCLING TASK
        // =====================================================

        if (message.contains("recycling task") ||
                message.contains("recycling assignment")) {

            return "A recycling task is created when a recycling request is assigned "
                    + "to a recycling worker. The worker can then handle the recyclable "
                    + "material pickup and complete the task.";

        }


        // =====================================================
        // WORKER STATUS
        // =====================================================

        if (message.contains("worker status") ||
                message.contains("worker availability") ||
                message.contains("available worker")) {

            return "RecycleX workers can have statuses such as AVAILABLE, BUSY "
                    + "or OFFLINE. This helps the system manage worker assignments.";

        }


        // =====================================================
        // REPORT COMPLETED
        // =====================================================

        if (message.contains("report completed") ||
                message.contains("completed report") ||
                message.contains("garbage cleaned")) {

            return "When the assigned cleaning task is completed, the corresponding "
                    + "garbage report can be updated to reflect that the reported "
                    + "waste has been handled.";

        }


        // =====================================================
        // CANCEL RECYCLING
        // =====================================================

        if (message.contains("cancel recycling") ||
                message.contains("cancel recycling request") ||
                message.contains("cancel my recycling")) {

            return "If your recycling request supports cancellation, you can cancel "
                    + "it according to the current request status and available options "
                    + "in the Recycling section.";

        }


        // =====================================================
        // ACCOUNT / PROFILE
        // =====================================================

        if (message.contains("my account") ||
                message.contains("account details") ||
                message.contains("profile")) {

            return "Your RecycleX account contains your registered user information "
                    + "and access to your dashboard and waste-management activities.";

        }


        // =====================================================
        // SUPPORT / HELPLINE
        // =====================================================

        if (message.contains("support") ||
                message.contains("customer care") ||
                message.contains("helpline") ||
                message.contains("help line") ||
                message.contains("contact") ||
                message.contains("phone number") ||
                message.contains("contact number")) {

            return "For RecycleX support or assistance with your account and "
                    + "waste-management services, please contact the support helpline "
                    + "at 9123040662.";

        }


        // =====================================================
        // URGENT HELP
        // =====================================================

        if (message.contains("urgent") ||
                message.contains("emergency") ||
                message.contains("immediate help")) {

            return "If you need urgent assistance related to the RecycleX service, "
                    + "please contact the support helpline at 9123040662.";

        }


        // =====================================================
        // WEBSITE FEATURES
        // =====================================================

        if (message.contains("features") ||
                message.contains("website features") ||
                message.contains("what does recyclex do") ||
                message.contains("what can recyclex do")) {

            return "RecycleX provides features such as user registration and login, "
                    + "garbage reporting, image upload, location and map support, "
                    + "AI waste classification, recycling requests, cleaning and "
                    + "recycling worker management, notifications, report tracking, "
                    + "rewards, points and leaderboard functionality.";

        }


        // =====================================================
        // HOW RECYCLEX WORKS
        // =====================================================

        if (message.contains("how recyclex works") ||
                message.contains("how does recyclex work") ||
                message.contains("how the system works")) {

            return "RecycleX connects users, administrators and waste-management "
                    + "workers. A user can report garbage or submit a recycling request. "
                    + "The administrator can assign appropriate workers, and workers "
                    + "can process the assigned tasks and update their progress.";

        }


        // =====================================================
        // ACCOUNT SECURITY
        // =====================================================

        if (message.contains("is my account safe") ||
                message.contains("account security") ||
                message.contains("is my data safe")) {

            return "RecycleX uses account authentication and protected access to "
                    + "help secure user information. Never share your password or "
                    + "authentication credentials with anyone.";

        }


        // =====================================================
        // NEED ASSISTANCE
        // =====================================================

        if (message.contains("where can i get help") ||
                message.contains("need assistance") ||
                message.contains("need support")) {

            return "I'm here to help with RecycleX features and waste-management "
                    + "questions. For account or service assistance, you can also "
                    + "contact the support helpline at 9123040662.";

        }


        // =====================================================
        // HELP
        // =====================================================

        if (message.contains("help") ||
                message.contains("what can you do") ||
                message.contains("what can i ask")) {

            return "I can help you with:\n"
                    + "1. Garbage reporting\n"
                    + "2. Garbage collection\n"
                    + "3. Recycling\n"
                    + "4. Waste segregation\n"
                    + "5. Biodegradable waste\n"
                    + "6. Non-biodegradable waste\n"
                    + "7. Plastic recycling\n"
                    + "8. Paper recycling\n"
                    + "9. Glass recycling\n"
                    + "10. Metal recycling\n"
                    + "11. E-waste\n"
                    + "12. Composting\n"
                    + "13. AI waste classification\n"
                    + "14. Image upload\n"
                    + "15. Recycling requests\n"
                    + "16. Recycling pickup\n"
                    + "17. Report status\n"
                    + "18. Login and registration\n"
                    + "19. Forgot password\n"
                    + "20. Dashboard\n"
                    + "21. Notifications\n"
                    + "22. Rewards and points\n"
                    + "23. Leaderboard\n"
                    + "24. Admin and worker roles\n"
                    + "25. Location and map\n"
                    + "26. Account support\n"
                    + "27. RecycleX features\n"
                    + "28. Support helpline: 9123040662";

        }


        // =====================================================
        // THANK YOU
        // =====================================================

        if (message.contains("thank") ||
                message.contains("thanks")) {

            return "You're welcome! 😊 I'm always happy to help with waste management.";

        }


        // =====================================================
        // BYE
        // =====================================================

        if (message.equals("bye") ||
                message.contains("goodbye")) {

            return "Goodbye! 👋 Keep your surroundings clean and keep recycling! ♻️";

        }


        // =====================================================
        // DEFAULT
        // =====================================================

        return "Sorry, I didn't understand your question. 🤔 "
                + "You can ask me about garbage reporting, recycling, "
                + "waste segregation, biodegradable waste, collection, "
                + "AI classification, rewards, dashboard, login, forgot password, "
                + "recycling requests, notifications, or report status.";

    }

}