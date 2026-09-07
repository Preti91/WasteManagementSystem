# ♻️ RecycleX — Smart Waste Management System

> **A smart, role-based waste management platform that connects citizens, cleaning workers, recycling workers, and administrators to make waste collection, recycling, and environmental responsibility more organized and efficient.**

<p align="center">

**♻️ Report Waste • 🗺️ Track Collection • 🤖 Classify Waste • ♻️ Recycle • 🏆 Earn Rewards**

</p>

---

## 🌱 About RecycleX

**RecycleX** is a full-stack **Smart Waste Management System** designed to digitize and simplify the process of reporting, collecting, managing, and recycling waste.

The platform provides separate workflows for **Users, Cleaning Workers, Recycling Workers, and Administrators**, allowing each role to perform specific tasks through a secure and centralized system.

Instead of treating waste collection as a simple reporting system, RecycleX creates a complete ecosystem where users can:

* 📸 Report garbage with images
* 📍 Submit and manage waste locations
* 🤖 Get waste classification assistance
* 🧹 Track cleaning activities
* ♻️ Submit recyclable materials
* 👷 Assign and manage worker tasks
* 🗺️ View locations and routes using maps
* 🔔 Receive notifications
* 🏆 Earn points and rewards
* 📊 View leaderboards
* 📜 Access certificates
* 💬 Interact with a waste-management chatbot

---

## 🎯 Project Objective

The main objective of RecycleX is to build a **technology-driven waste management ecosystem** that improves communication between citizens, workers, and administrators.

### The system aims to:

* Reduce unmanaged and improperly disposed waste
* Make garbage reporting faster and easier
* Improve coordination between users and workers
* Encourage recycling through rewards
* Provide role-based access and secure authentication
* Use intelligent waste classification assistance
* Improve operational visibility through dashboards
* Promote environmentally responsible behavior

---

# ✨ Key Features

## 👤 User Module

Users can interact with the waste-management system through a dedicated interface.

### Features

* 🔐 User registration and login
* 🔑 JWT-based authentication
* 🔄 Forgot password functionality
* 🔢 OTP verification for password recovery
* 📸 Garbage reporting with image upload
* 📍 Waste location selection
* ♻️ Recycling request submission
* 🗺️ Location/map support
* 🔔 Notifications
* 🤖 Waste classification assistance
* 💬 AI-style waste management chatbot
* 🏆 Rewards and points
* 📊 Leaderboard
* 📜 Certificates
* 👤 User dashboard

---

# 🧹 Cleaning Worker Module

Cleaning workers are responsible for handling garbage collection and cleaning tasks assigned through the platform.

### Features

* 👷 Worker dashboard
* 📋 View assigned cleaning tasks
* 📍 View waste locations
* 🗺️ Map and route support
* 🔄 Update task status
* 📸 Handle reported garbage
* 🔔 Worker notifications
* 📊 Task management

---

# ♻️ Recycling Worker Module

The recycling workflow allows recyclable waste to be processed separately from regular garbage.

### Features

* ♻️ View recycling requests
* 📋 Manage assigned recycling tasks
* 📍 Access recycling locations
* 🔄 Update recycling status
* 🔔 Receive notifications
* 📊 Track recycling activities

---

# 👨‍💼 Admin Module

The administrator has centralized control over the platform.

### Features

* 👥 User management
* 👷 Worker management
* 🗑️ Garbage report management
* ♻️ Recycling request management
* 📋 Cleaning task management
* 📊 Dashboard statistics
* 🔔 Send notifications
* 🏆 Manage reward-related activities
* 📜 Certificate management
* 🔐 Role-based authorization

---

# 🤖 Smart Waste Classification

RecycleX includes an intelligent waste-classification component designed to assist users in identifying the appropriate waste category.

The system analyzes the submitted waste information and provides a classification based on configured waste-related logic.

### Example categories

* 🟢 Biodegradable / Organic
* 🔵 Recyclable
* 🟡 Plastic
* 🟠 Electronic Waste
* 🔴 Other / General Waste

This feature helps users understand **how waste should be handled before disposal or recycling**.

---

# 💬 Waste Management Chatbot

RecycleX also includes a chatbot interface that provides users with assistance related to waste management.

The chatbot can help with topics such as:

* ♻️ Recycling guidance
* 🗑️ Waste disposal information
* 🌱 Environmental awareness
* 📸 Garbage reporting guidance
* 🔄 Recycling workflow information
* ❓ General waste-management questions

---

# 🏆 Rewards & Leaderboard

To encourage users to participate actively in responsible waste management, RecycleX includes a **gamification system**.

Users can earn points through eligible activities.

### Gamification features

* ⭐ Points
* 🏆 Leaderboard
* 🎁 Reward system
* 📊 Reward summary
* 📜 Certificates

This approach turns responsible waste disposal and recycling into a more engaging experience.

---

# 🔐 Authentication & Security

Security is an important part of the application.

RecycleX uses:

* 🔐 Spring Security
* 🎟️ JWT authentication
* 👥 Role-based authorization
* 🔑 Password reset workflow
* 🔢 OTP verification
* ✅ Request validation
* ⚠️ Global exception handling

### Supported roles

```text
USER
ADMIN
CLEANING_WORKER
RECYCLING_WORKER
```

Each role has access only to the functionality required for that role.

---

# 🔑 Forgot Password Workflow

The application includes a complete password-recovery workflow.

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

This functionality is implemented using dedicated DTOs, repository logic, and password-reset service components.

---

# 🗺️ Maps & Location Support

RecycleX integrates map-based functionality to support waste reporting and worker operations.

The frontend contains map-related functionality for:

* 📍 Waste locations
* 🗺️ Map visualization
* 📌 Location selection
* 🧹 Cleaning worker navigation
* 🚚 Route assistance
* ♻️ Recycling locations

The project uses **Google Maps-related services** for map, place, and route functionality.

---

# 📸 Waste Image Upload

Users can attach images when reporting garbage.

The system supports:

* Image upload
* Garbage report image storage
* Recycling-related image handling
* File validation
* Configurable upload size

The current configuration supports uploads up to **8 MB per request**.

---

# 🏗️ System Architecture

RecycleX follows a layered Spring Boot architecture.

```text
                    ┌─────────────────────┐
                    │      Frontend       │
                    │ HTML / CSS / JS     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    REST Controllers │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Services       │
                    │ Business Logic      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Repositories     │
                    │      Spring Data    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │       MySQL         │
                    │      Database       │
                    └─────────────────────┘
```

---

# 🛠️ Technology Stack

## Backend

| Technology           | Purpose                        |
| -------------------- | ------------------------------ |
| ☕ Java 21            | Programming language           |
| 🌱 Spring Boot 4.1.0 | Backend framework              |
| 🔐 Spring Security   | Authentication & authorization |
| 🎟️ JWT              | Token-based authentication     |
| 🗄️ Spring Data JPA  | Database access                |
| 🧩 Hibernate         | ORM                            |
| 🐬 MySQL             | Relational database            |
| 📦 Maven             | Dependency management & build  |
| ✅ Jakarta Validation | Request validation             |
| 🧰 Lombok            | Boilerplate reduction          |

## Frontend

| Technology       | Purpose               |
| ---------------- | --------------------- |
| HTML5            | Page structure        |
| CSS3             | Styling               |
| JavaScript       | Frontend logic        |
| Tailwind CSS     | UI styling            |
| Google Maps APIs | Maps, places & routes |

---

# 📁 Project Structure

```text
WasteManagementSystem/
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/example/WasteManagementSystem/
│   │   │
│   │   │   ├── config/
│   │   │   ├── controller/
│   │   │   ├── dto/
│   │   │   ├── entity/
│   │   │   ├── enums/
│   │   │   ├── repository/
│   │   │   ├── security/
│   │   │   └── service/
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
├── frontend/
├── .mvn/
├── pom.xml
├── mvnw
├── mvnw.cmd
└── README.md
```

---

# 🔄 Main Application Workflow

## Garbage Reporting

```text
User
 ↓
Login
 ↓
Report Garbage
 ↓
Select Location
 ↓
Upload Image
 ↓
Submit Report
 ↓
Admin Reviews Report
 ↓
Cleaning Task Created
 ↓
Cleaning Worker Assigned
 ↓
Worker Updates Status
 ↓
Garbage Collected
```

---

## ♻️ Recycling Workflow

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

---

# 🗃️ Main Domain Entities

The backend contains entities representing the core operations of the system.

```text
User
GarbageReport
RecyclingRequest
CleaningTask
RecyclingTask
Notification
Reward
Certificate
AIClassification
PasswordResetToken
```

---

# 🌐 Main Application Pages

The frontend includes dedicated interfaces for different parts of the application.

```text
Home
Login
Register
User Dashboard
Garbage Report
Recycling
Map
Notifications
Rewards
Leaderboard
Certificates
Chatbot
Admin Dashboard
Cleaning Worker
Recycling Worker
Forgot Password
```

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
```

Navigate into the project:

```bash
cd WasteManagementSystem
```

---

## 2. Requirements

Before running the application, install:

* Java 21
* Maven
* MySQL
* Git
* A modern web browser

---

# 🗄️ Database Setup

Create the MySQL database:

```sql
CREATE DATABASE smart_waste;
```

Then configure your local database credentials in:

```text
src/main/resources/application.properties
```

### Example

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/smart_waste
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
```

> ⚠️ **Never commit real database passwords, API keys, JWT secrets, or other credentials to GitHub.**

---

# 🔐 Environment & Secret Configuration

For security, sensitive configuration should be stored outside the public repository.

Recommended configuration includes:

```text
Database username
Database password
JWT secret
Google Maps API key
Other private credentials
```

Use environment variables or a local configuration file for development.

---

# ▶️ Run the Application

Using Maven:

```bash
mvn spring-boot:run
```

Or on Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

The application runs on:

```text
http://localhost:8081
```

---

# 🧪 Testing

Run the test suite with:

```bash
mvn test
```

Or:

```powershell
.\mvnw.cmd test
```

---

# 🔌 API Architecture

The backend exposes REST APIs for different modules.

```text
/api/auth
/api/users
/api/admin
/api/garbage
/api/recycling
/api/cleaning-worker
/api/recycling-worker
/api/rewards
/api/leaderboard
/api/notifications
/api/certificates
/api/chatbot
/api/ai
```

> Exact endpoint paths may evolve as the project continues to be developed.

---

# 📊 Core Backend Layers

### Controllers

Handle incoming HTTP requests and API responses.

### Services

Contain the application's business logic.

### Repositories

Provide database access using Spring Data JPA.

### Entities

Represent database tables and domain objects.

### DTOs

Control the data transferred between frontend and backend.

### Security

Handles authentication, JWT processing, and role-based authorization.

---

# 💡 Why RecycleX?

Traditional waste-management systems often focus only on reporting garbage.

RecycleX goes further by connecting the entire workflow:

```text
Citizen
   ↓
Waste Report
   ↓
Classification
   ↓
Admin
   ↓
Worker
   ↓
Collection
   ↓
Recycling
   ↓
Rewards
   ↓
Environmental Impact
```

This creates a more connected and transparent approach to waste management.

---

# 🌍 Future Improvements

Possible future enhancements include:

* 🤖 Machine-learning based image classification
* 📱 Progressive Web App / mobile application
* ☁️ Cloud deployment
* ☁️ Cloud-based image storage
* 📈 Advanced analytics dashboard
* 🔔 Real-time notifications
* 📍 Real-time worker tracking
* 🧠 Generative AI-powered waste assistant
* 📊 Environmental impact calculations
* 🌱 Carbon-footprint estimation
* 🏙️ Smart-city integration
* 🔗 QR-based recycling tracking

---

# 🎓 Academic Project

**Project:** RecycleX — Smart Waste Management System

**Project Type:** Full-Stack Web Application

**Domain:** Waste Management / Smart City / Sustainability

**Architecture:** Layered RESTful Architecture

**Backend:** Java + Spring Boot

**Database:** MySQL

**Frontend:** HTML + CSS + JavaScript + Tailwind CSS

**Security:** Spring Security + JWT

---

# 👩‍💻 Developer

### Preti Kundu

**BCA Student | Full-Stack Developer**

Interested in:

* Java & Spring Boot
* Web Development
* Database Management
* AI/ML
* Software Engineering
* Cloud & Backend Development

---

# ⭐ Support the Project

If you find **RecycleX** interesting or useful:

⭐ Star the repository
🍴 Fork the project
🐛 Report issues
💡 Suggest improvements

---

<p align="center">

### ♻️ RecycleX

**Technology for a cleaner, smarter and more sustainable future.**

🌱 **Reduce • Reuse • Recycle • Repeat** 🌱

</p>
