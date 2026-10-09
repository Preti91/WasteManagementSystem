# ♻️ RecycleX — Smart Waste Management System

> **A smart, role-based waste management platform designed to connect users, cleaning workers, recycling workers, and administrators to make waste reporting, collection, recycling, and environmental responsibility more organized and efficient.**

**♻️ Report Waste 
🗺️ Track Collection 
🤖 Classify Waste 
♻️ Recycle 
🏆 Earn Rewards**

---

# 🌱 About the Project

The **RecycleX Smart Waste Management System** is a full-stack web application developed to digitize and simplify the process of reporting, collecting, managing, and recycling waste.

The system provides separate workflows for:

- 👤 Users
- 👨‍💼 Administrators
- 🧹 Cleaning Workers
- ♻️ Recycling Workers

The platform allows users to report garbage, provide waste locations, upload images, request recycling services, receive notifications, earn rewards, and interact with waste-management assistance features.

Administrators can manage users, workers, garbage reports, recycling requests, cleaning tasks, rewards, certificates, and other system activities.

Cleaning and recycling workers can view assigned tasks, access waste locations, and update task statuses.

---

# 🎯 Project Objective

The main objective of this project is to develop a **technology-driven waste management platform** that improves communication and coordination between citizens, workers, and administrators.

### The system aims to:

- ♻️ Reduce unmanaged and improperly disposed waste
- 📸 Make garbage reporting easier
- 📍 Record and manage waste locations
- 🧹 Improve coordination between users and cleaning workers
- ♻️ Encourage recycling
- 🏆 Motivate users through rewards and points
- 🔐 Provide secure authentication and authorization
- 🤖 Provide waste classification assistance
- 🗺️ Support map-based waste location management
- 📊 Provide dashboards for better operational visibility
- 🔔 Keep users and workers informed through notifications
- 🌱 Promote environmentally responsible behavior

---

# ✨ Key Features

## 👤 User Module

Users can interact with the system through a dedicated user interface.

### Features

- 🔐 User registration and login
- 🎟️ JWT-based authentication
- 🔑 Forgot password functionality
- 🔢 OTP verification
- 🔄 Password reset
- 📸 Garbage reporting with image upload
- 📍 Waste location selection
- ♻️ Recycling request submission
- 🗺️ Map support
- 🔔 Notifications
- 🤖 Waste classification assistance
- 💬 Waste-management chatbot
- 🏆 Rewards and points
- 📊 Leaderboard
- 📜 Certificates
- 👤 User dashboard

---

# 🧹 Cleaning Worker Module

Cleaning workers are responsible for handling garbage collection and cleaning tasks assigned through the platform.

### Features

- 👷 Cleaning worker dashboard
- 📋 View assigned cleaning tasks
- 📍 View reported waste locations
- 🗺️ Map and location support
- 🔄 Update cleaning task status
- 📸 Handle reported garbage
- 🔔 Worker notifications
- 📊 Task management

# 🧹 Cleaning Worker Workflow
```text
User
↓
Submit Garbage Report
↓
Provide Waste Details
↓
Upload Waste Image
↓
Select Location
↓
Report Reviewed
↓
Cleaning Worker Assigned
↓
Waste Collected
↓
Cleaning Status Updated
↓
User Receives Updates
```

# ♻️Recycling Worker Module

Recycling workers are responsible for handling recyclable waste and completing recycling requests assigned through the platform.

Features
- 👷 Recycling worker dashboard
- 📋 View assigned recycling tasks
- ♻️ View recycling requests
- 📍 View recycling locations
- 🗺️ Map and location support
- 🔄 Update recycling task status
- 📸 View waste information and uploaded images
- 🔔 Worker notifications
- 📊 Recycling task management

# Recycling Workflow
```text
User
↓
Submit Recycling Request
↓
Provide Waste Details
↓
Select Location
↓
Request Reviewed
↓
Recycling Worker Assigned
↓
Waste Collected
↓
Recycling Status Updated
↓
User Receives Updates
```

# 👨‍💼 Admin Module

The administrator manages and monitors the overall waste management system. The admin has centralized access to users, workers, garbage reports, recycling requests, tasks, rewards, notifications, and system activities.

Features
- 👥 Manage users
- 👷 Manage cleaning workers
- ♻️ Manage recycling workers
- 🗑️ Manage garbage reports
- 📋 Create and manage cleaning tasks
- ♻️ Manage recycling requests
- 📦 Manage recycling tasks
- 📊 Admin dashboard and system statistics
- 🔔 Manage notifications
- 🏆 Manage rewards
- 📜 Manage certificates
- 🔐 Role-based access control
- 👤 Monitor user and worker activities


# 🤖 Smart Waste Classification

The application includes a waste-classification component designed to assist users in identifying appropriate waste categories.

The classification functionality helps users understand how submitted waste should be handled before disposal or recycling.

Example Waste Categories
- 🟢 Biodegradable / Organic
- 🔵 Recyclable
- 🟡 Plastic
- 🟠 Electronic Waste
- 🔴 Other / General Waste

This feature is intended to support better waste segregation and environmentally responsible disposal.

# 💬 Waste Management Chatbot

The application includes a chatbot interface that provides assistance related to waste management.

The chatbot can provide guidance related to:

- ♻️ Recycling
- 🗑️ Waste disposal
- 🌱 Environmental awareness
- 📸 Garbage reporting
- 🔄 Recycling workflow
- ❓ General waste-management questions

The chatbot is integrated into the application's frontend and backend architecture

# 🏆 Rewards & Leaderboard

To encourage users to participate in responsible waste management, the system includes a reward and gamification system.

Users can earn points through eligible activities.

Gamification Features
- ⭐ Reward points
- 🏆 Leaderboard
- 🎁 Reward catalog
- 📊 Reward summary
- 📜 Certificates

The reward system encourages users to actively participate in waste reporting and recycling activities.


# 🔐 Authentication & Security

Security is an important part of the application.

The project uses:

- 🔐 Spring Security
- 🎟️ JWT authentication
- 👥 Role-based authorization
- 🔑 Password reset workflow
- 🔢 OTP verification
- ✅ Request validation
- ⚠️ Global exception handling
- Supported Roles
- USER
- ADMIN
- CLEANING_WORKER
- RECYCLING_WORKER

Each role has access only to the functionality required for that role.

# 🔑 Forgot Password Workflow

The application provides a password-recovery workflow.

```text 
Enter Email
↓
Request Password Reset
↓
Generate OTP
↓
Verify OTP
↓
Create New Password
↓
Password Updated
↓
Login
```

This functionality is supported by dedicated request DTOs, password-reset logic, repository components, and service-layer functionality.

# 🗺️ Maps & Location Support

The system includes map-related functionality to support waste reporting and worker operations.

Map functionality includes:
- 📍 Waste locations
- 🗺️ Map visualization
- 📌 Location selection
- 🧹 Cleaning worker navigation
- 🚚 Route assistance
- ♻️ Recycling locations

The project uses Google Maps-related services for map, place, and route functionality.

# 📸 Waste Image Upload

Users can attach images when reporting garbage.

The application supports:

- 📸 Garbage image upload
- 🗂️ Image storage
- ♻️ Recycling-related image handling
- ✅ File validation
- 📦 Configurable upload size

The current application configuration supports file uploads up to 8 MB per request.


# 🏗️ System Architecture

The application follows a layered Spring Boot architecture.
```text
                    ┌─────────────────────┐
                    │      Frontend       │
                    │  HTML / CSS / JS    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  REST Controllers   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Services       │
                    │   Business Logic    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Repositories     │
                    │    Spring Data JPA  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │       MySQL         │
                    │      Database       │
                    └─────────────────────┘
```
## 🛠️ Technology Stack

### Backend

| Technology | Purpose |
|---|---|
| ☕ Java | Programming language |
| 🌱 Spring Boot | Backend framework |
| 🔐 Spring Security | Authentication & authorization |
| 🎟️ JWT | Token-based authentication |
| 🗄️ Spring Data JPA | Database access |
| 🧩 Hibernate | ORM |
| 🐬 MySQL | Relational database |
| 📦 Maven | Dependency management and build |
| ✅ Jakarta Validation | Request validation |
| 🧰 Lombok | Boilerplate code reduction |

### Frontend

| Technology | Purpose |
|---|---|
| HTML5 | Page structure |
| CSS3 | Styling |
| JavaScript | Frontend functionality |
| Tailwind CSS | UI styling |
| Google Maps APIs | Maps and location functionality |

# 📁 Project Structure
```text
WasteManagementSystem/
│
├── frontend/
│   ├── input.css
│   ├── package.json
│   └── package-lock.json
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/example/WasteManagementSystem/
│   │   │       ├── config/
│   │   │       ├── controller/
│   │   │       ├── dto/
│   │   │       ├── entity/
│   │   │       ├── enums/
│   │   │       ├── repository/
│   │   │       ├── security/
│   │   │       └── service/
│   │   │
│   │   └── resources/
│   │       ├── static/
│   │       │   ├── css/
│   │       │   ├── images/
│   │       │   ├── js/
│   │       │   └── *.html
│   │       │
│   │       └── templates/
│   │
│   └── test/
│
├── .mvn/
├── .gitignore
├── HELP.md
├── mvnw
├── mvnw.cmd
├── pom.xml
└── README.md
```


# 🔄 Main Application Workflow

## 🗑️ Garbage Reporting Workflow
```text 
User
↓
Login / Register
↓
Report Garbage
↓
Select Waste Location
↓
Upload Waste Image
↓
Submit Report
↓
Admin Reviews Report
↓
Cleaning Task Created
↓
Cleaning Worker Assigned
↓
Worker Handles Waste
↓
Worker Updates Task Status
↓
Garbage Collected
```

##  ♻️ Recycling Workflow

```text
User
↓
Submit Recycling Request
↓
Provide Waste Details
↓
Select Location
↓
Request Reviewed
↓
Recycling Worker Assigned
↓
Waste Collected
↓
Recycling Status Updated
↓
User Receives Updates
🏆 Reward Workflow
User Performs Eligible Activity
↓
Points Earned
↓
Reward Summary
↓
Leaderboard Updated
↓
Reward Redemption
↓
Certificate
```

# 🗃️ Main Domain Entities

The backend contains entity classes representing the core operations of the system.

- User
- GarbageReport
- RecyclingRequest
- CleaningTask
- RecyclingTask
- Notification
- Reward
- Certificate
- AIClassification
- PasswordResetToken

These entities are used with Spring Data JPA and Hibernate for database operations.

# 🌐 Main Application Pages

The frontend contains dedicated pages for different parts of the application.

- Home
- Login
- Register
- User Dashboard
- Garbage Report
- Recycling
- Map
- Notifications
- Rewards
- Leaderboard
- Certificates
- Chatbot
- Admin Dashboard
- Cleaning Worker
- Recycling Worker
- Forgot Password

# 🚀 Getting Started

## 1. Clone the Repository

Clone the project using:

```bash
git clone https://github.com/04-taniya/Waste-Management-System.git
```

Navigate into the project:

```bash
cd Waste-Management-System
```

# 📋 Requirements

Before running the application, install the following:

- ☕ Java JDK
- 📦 Maven
- 🐬 MySQL
- 🔧 Git
- 💻 IntelliJ IDEA or another Java IDE
- 🌐 Modern web browser
# 🗄️ Database Setup

The application uses MySQL.

Create the database:

```sql
CREATE DATABASE smart_waste;
```

After creating the database, configure your local database credentials.

# ⚙️ Local Configuration

**The real application.properties file is not included in this GitHub repository because it contains local configuration and database credentials.**

**When working on the project on your local machine, create:**

src/main/resources/application.properties

Then add your own configuration.

Example
```text
spring.datasource.url=jdbc:mysql://localhost:3306/smart_waste
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
```

Replace:

- YOUR_USERNAME
- YOUR_PASSWORD

with your own local MySQL credentials.

**⚠️ Never commit real database passwords, API keys, JWT secrets, or other private credentials to GitHub.**

# 🔐 Environment & Secret Configuration

Sensitive configuration should remain outside the public repository.

Examples include:

- Database username
- Database password
- JWT secret
- Google Maps API key
- Other private credentials

For local development, use your own `application.properties` file or environment variables.

The `.gitignore` file is configured to prevent sensitive/local files from being uploaded.

# ▶️ Run the Application

## Option 1 — Using Maven

```bash
mvn spring-boot:run
```

## Option 2 — Windows Maven Wrapper

```powershell
.\mvnw.cmd spring-boot:run
```

## Option 3 — IntelliJ IDEA

Open:

```text
src/main/java/com/example/WasteManagementSystem/WasteManagementSystemApplication.java
```

Then run the main Spring Boot application from IntelliJ IDEA.
# 🌐 Application URL

After starting the application, access it through:

http://localhost:8081

The exact URL may depend on the local server configuration.

# 🧪 Testing

The project contains tests under:

```text
src/test/
```

Run the tests using Maven:

```bash
mvn test
```

Or on Windows:

```powershell
.\mvnw.cmd test
```

# 🔌 API Architecture

The backend is organized into different API modules.

- /api/auth
- /api/users
- /api/admin
- /api/garbage
- /api/recycling
- /api/cleaning-worker
- /api/recycling-worker
- /api/rewards
- /api/leaderboard
- /api/notifications
- /api/certificates
- /api/chatbot
- /api/ai

Note: Exact endpoint paths may evolve as the project continues to be developed.

# 📊 Core Backend Layers

## Controllers

Controllers handle incoming HTTP requests and provide API responses.

```text
controller/
```

## Services

Services contain the main business logic of the application.

```text
service/
```

## Repositories

Repositories provide database access using Spring Data JPA.

```text
repository/
```

## Entities

Entities represent database tables and core domain objects.

```text
entity/
```

## DTOs

DTOs are used to transfer data between different parts of the application.

```text
dto/
```

## Security

Security components handle:

- Authentication
- JWT processing
- Authorization
- Role-based access

```text
security/
```

# 💡 Why This RecycleX Smart Waste Management System?

Traditional waste-management processes can depend heavily on manual reporting and coordination.

This system brings multiple activities into a centralized digital platform:
```text
Citizen
↓
Waste Report
↓
Waste Classification
↓
Admin Review
↓
Worker Assignment
↓
Waste Collection
↓
Recycling
↓
Rewards
↓
Environmental Responsibility
```
This creates a more organized and transparent approach to waste management.


# 🌍 Future Improvements

Possible future enhancements include:

- 🤖 Machine-learning based image classification
- 📱 Mobile application
- 📱 Progressive Web App
- ☁️ Cloud deployment
- ☁️ Cloud-based image storage
- 📈 Advanced analytics dashboard
- 🔔 Real-time notifications
- 📍 Real-time worker tracking
- 🧠 Generative AI-powered waste assistant
- 📊 Environmental impact calculations
- 🌱 Carbon-footprint estimation
- 🏙️ Smart-city integration
- 🔗 QR-based recycling tracking

# 🎓 Academic Project

| **Details** | **Information** |
|---|---|
| **Project** | RecycleX — Smart Waste Management System |
| **Project Type** | Full-Stack Web Application |
| **Domain** | Waste Management / Smart City / Sustainability |
| **Architecture** | Layered RESTful Architecture |
| **Backend** | Java + Spring Boot |
| **Database** | MySQL |
| **Frontend** | HTML + CSS + JavaScript + Tailwind CSS |
| **Security** | Spring Security + JWT |

# 👩‍💻 Developer

**Taniya Mistri**

*BCA Student | Full-Stack Developer*

### Areas of Interest

- ☕ Java
- 🌱 Spring Boot
- 🌐 Web Development
- 🗄️ Database Management
- 🤖 AI / ML
- ☁️ Backend Development
- 💻 Software Engineering
# ⭐ Support the Project

If you find this project interesting or useful:

- ⭐ Star the repository
- 🍴 Fork the project
- 🐛 Report issues
- 💡 Suggest improvements

---

**♻️ RecycleX — Smart Waste Management System**

Technology for a cleaner, smarter and more sustainable future.

🌱 **Reduce • Reuse • Recycle • Repeat** 🌱
