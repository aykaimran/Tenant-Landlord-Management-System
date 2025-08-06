
# 🏠 RENTINEL - Rental Property Manager

**Rentinel** is a full-stack web-based rental property management system designed to help landlords efficiently manage tenants, rent payments, and track earnings. The system automates reminders for overdue payments, supports real-time online rent collection via **Stripe**, and sends **email alerts** to tenants when rent is pending.
Look for rentinel.mp4 file to watch the system working

---

## 🚀 Tech Stack

| Layer     | Technology                |
|-----------|---------------------------|
| **Frontend** | ReactJS, Tailwind CSS (VS Code) |
| **Backend**  | Spring Boot (IntelliJ IDEA)     |
| **Database** | Microsoft SQL Server 2019+      |
| **Payments** | Stripe Integration              |

---

## ✅ Features

- 🏢 Add/Delete Rental Properties  
- 📝 Manage Property Details  
- 👤 Register Tenants & Assign to Properties  
- 📅 Set Rent Due Dates  
- ⏰ Automated Reminders for Overdue Rent  
- 📧 Email Alerts to Tenants  
- 💵 Track Earnings Per Property  
- 💳 Stripe Integration for Secure Online Payments  

---

## 🎯 Design Pattern

- **Observer Pattern**: Used to implement real-time reminders and email notifications for rent dues.

---

## 🔧 Prerequisites

- Node.js & npm  
- Java JDK 17+  
- IntelliJ IDEA  
- Visual Studio Code  
- Microsoft SQL Server 2019 or higher  
- Stripe account (https://dashboard.stripe.com)  
- Postman or cURL (for optional API testing)  

---

## 🖥️ Backend Setup (Spring Boot)

1. Open the backend folder in **IntelliJ IDEA**.  
2. Configure the database in `application.properties`:
   ```
   spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=rentinel_db  
   spring.datasource.username=YOUR_USERNAME  
   spring.datasource.password=YOUR_PASSWORD  
   ```
3. Add your Stripe secret key:
   ```
   stripe.api.key=YOUR_STRIPE_SECRET_KEY  
   ```
4. Make sure SQL Server is running and the `rentinel_db` exists.  
5. Build the project:  
   - With Maven: `mvn clean install`  
   - Or use IntelliJ’s build options  
6. Run the application:  
   - Launch `RentinelApplication.java`

---

## 🌐 Frontend Setup (React + Tailwind)

1. Open the frontend folder in **VS Code**.  
2. Run the following commands:  
   ```bash
   npm install  
   npm run dev  
   ```
3. Ensure the backend is running (default: `http://localhost:8080`).  
4. Update the `.env` or config files to match backend API URL if needed.

---

## 🗄️ Database Setup

1. Open **Microsoft SQL Server Management Studio**.  
2. Run the provided SQL script to create the `rentinel_db` schema.  
3. Ensure all necessary tables exist:  
   - `properties`  
   - `tenants`  
   - `rent_payments`  
   - etc.  
4. Verify the Spring Boot app connects to the database via logs.

---

## 💳 Stripe Integration

1. Sign up / log in at [Stripe Dashboard](https://dashboard.stripe.com).  
2. Get your **Secret Key** from API settings.  
3. Paste it into `application.properties`:  
   ```
   stripe.api.key=YOUR_STRIPE_SECRET_KEY  
   ```
4. Payment is handled via backend API endpoint:  
   - `POST /api/payment`

---

## 🏃 Running the Application

1. Ensure SQL Server is running with `rentinel_db`.  
2. Start the backend using IntelliJ (Spring Boot).  
3. Start the frontend using:  
   ```bash
   npm run dev  
   ```
4. Visit the app at: [http://localhost:5173](http://localhost:5173)

---

## ⚠️ Notes

- Enable **CORS** in Spring Boot to allow frontend-backend communication.  
- Email reminders use `JavaMailSender`. Add email credentials to `application.properties`.  
- Update frontend `.env` if backend port or base URL changes.  
- Check antivirus/firewall if backend or database ports are blocked.

---

## 📂 Project Domain

**Real Estate / Property Management System**

---

## 📬 Contact

For questions or suggestions, feel free to open an [Issue](https://github.com/yourusername/rentinel/issues) or contribute via Pull Requests.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
