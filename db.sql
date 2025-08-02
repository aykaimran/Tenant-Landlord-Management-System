--CREATE DATABASE Rentinel
--go
Use Rentinel
go

--DROP TABLE tenantNotifications;
--DROP TABLE ownerNotifications;
--DROP TABLE blackListedUsers;
--DROP TABLE rentAssignment;
--DROP TABLE propertyAssignment;
--DROP TABLE Payment;
--DROP TABLE Property;
--DROP TABLE Admin;
--DROP TABLE Tenant;
--DROP TABLE Owner;
--drop table PaymentReminder

	CREATE TABLE Owner
(
ID int identity(1,1) PRIMARY KEY,
fullName varchar(50) NOT NULL,
userName varchar(50) NOT NULL UNIQUE,
Password varchar(30) NOT NULL,
email varchar(30) NOT NULL,
CNIC varchar(13) NOT NULL,
accountCreationDate Date NOT NULL
)
go
CREATE TABLE Tenant
 (
ID int identity(1,1) PRIMARY KEY,
	fullName varchar(50) NOT NULL,
	userName varchar(50) NOT NULL UNIQUE,
	Password varchar(30) NOT NULL,
	email varchar(30) NOT NULL,
	CNIC varchar(13) NOT NULL,
accountCreationDate Date NOT NULL
)
go
CREATE TABLE Admin
 (
ID int identity(1,1) PRIMARY KEY,
	fullName varchar(50) NOT NULL,
	userName varchar(50) NOT NULL UNIQUE,
	Password varchar(30) NOT NULL,
	email varchar(30) NOT NULL,
	CNIC varchar(13) NOT NULL,
accountCreationDate Date NOT NULL
)
go

CREATE TABLE Property 
(
propertyName varchar(50),
propertyID int primary key IDENTITY(1,1),
Area varchar(50) NOT NULL,
location varchar(255) NOT NULL,
fixedRent Decimal(10,2) NOT NULL,
ownerName varchar(50),
Foreign key (ownerName) references Owner(userName) ON UPDATE CASCADE ON DELETE CASCADE,
tenantName varchar(50),
Foreign key (tenantName) references Tenant(userName) ON UPDATE CASCADE ON DELETE CASCADE,
numOfBedRooms int,
numOfRooms int,
numOfBaths int
)
go
CREATE TABLE Payment
 (
	paymentID INT IDENTITY(1,1) PRIMARY KEY,
	paymentStatus varchar(20),
	paymentDate DATE,
	amount INT NOT NULL,
	propertyID INT NOT NULL,
	tenantUserName varchar(50),
	ownerUserName varchar(50),
	FOREIGN KEY (propertyID) references Property(propertyID),
	FOREIGN KEY (tenantUserName) references Tenant(userName) ON UPDATE CASCADE ON DELETE CASCADE,
FOREIGN KEY (ownerUserName) references Owner(userName) ON UPDATE CASCADE ON DELETE CASCADE
)
go
CREATE TABLE propertyAssignment 
(
	assignmentID INT  IDENTITY(1,1)  PRIMARY KEY ,
	propertyID INT NOT NULL,
	ownerID INT NOT NULL,
tenantID INT NOT NULL,
assignmentDate Date NOT NULL,
FOREIGN KEY (propertyID) REFERENCES Property(propertyID),
FOREIGN KEY (tenantID) references Tenant(ID) ON UPDATE CASCADE ON DELETE CASCADE,
FOREIGN KEY (ownerID) references Owner(ID) ON UPDATE CASCADE ON DELETE CASCADE
)
go
CREATE TABLE rentAssignment
(
assignmentID INT  IDENTITY(1,1)  PRIMARY KEY,
	propertyID INT NOT NULL,
	tenantID INT NOT NULL,
	startDate DATE NOT NULL,
	dueDate DATE NOT NULL,
	FOREIGN KEY (tenantID ) REFERENCES Tenant(ID) ON UPDATE NO ACTION ON DELETE NO ACTION,
FOREIGN KEY (propertyID) REFERENCES Property(propertyID) ON UPDATE NO ACTION ON DELETE NO ACTION,	

)

go
CREATE TABLE blackListedUsers(
	CNIC varchar(13) PRIMARY KEY
)
go
CREATE TABLE PaymentReminder
(
    reminderID INT IDENTITY(1,1) PRIMARY KEY,
    paymentID INT NOT NULL,
    emailSentDate DATE NOT NULL,
    FOREIGN KEY (paymentID) REFERENCES Payment(paymentID) ON DELETE CASCADE
);
go
CREATE TABLE ownerNotifications
(
	notificationID INT IDENTITY(1, 1),
	ownerID INT NOT NULL,
	subject varchar(30),
	sentDate Date NOT NULL,
propertyName varchar(50) NOT NULL,
tenantUserName varchar(30), --the notification does not implicitly come from the tenant basically it comes from the system but this field shows for which tenant
content varchar(255) NOT NULL,
FOREIGN KEY (ownerID) references Owner(ID) ON UPDATE CASCADE ON DELETE CASCADE
)
go
CREATE TABLE tenantNotifications
(
	notificationID INT IDENTITY(1, 1),
	tenantID INT NOT NULL,
	subject varchar(30),
	sentDate Date NOT NULL,
propertyName varchar(50) NOT NULL,
ownerUserName varchar(30), --the notification does not implicitly come from the owner basically it comes from the system but this field shows for which owner
content varchar(255) NOT NULL,
FOREIGN KEY (tenantID) references Tenant(ID) ON UPDATE CASCADE ON DELETE CASCADE
)
go
USE Rentinel

-- Insert Original Owners (account creation dates in early 2025)
INSERT INTO Owner (fullName, userName, Password, email, CNIC, accountCreationDate)
VALUES 
('Ali Khan', 'alikhan', 'SecurePass123', 'ali.khan@gmail.com', '4220112345671', '2025-02-15'),
('Fatima Ahmed', 'fatimaahmed', 'FatimaPass456', 'fatima.ahmed@gmail.com', '4220112345672', '2025-02-20'),
('Usman Malik', 'usmanmalik', 'UsmanPass789', 'usman.malik@gmail.com', '4220112345673', '2025-03-10'),
('Ayesha Raza', 'ayeshaza', 'AyeshaPass101', 'ayesha.raza@gmail.com', '4220112345674', '2025-04-05'),
('Bilal Hussain', 'bilalhussain', 'BilalPass112', 'bilal.hussain@gmail.com', '4220112345675', '2025-05-01'),

-- Additional Owners
('Raza Shah', 'razashah', 'RazaPass123', 'raza.shah@gmail.com', '4220112345676', '2025-01-10'),
('Nadia Akhtar', 'nadiaakhtar', 'NadiaPass456', 'nadia.akhtar@gmail.com', '4220112345677', '2025-02-18'),
('Kamran Siddiqui', 'kamransiddiqui', 'KamranPass789', 'kamran.siddiqui@gmail.com', '4220112345678', '2025-05-15'),
('Sadia Khan', 'sadiakhan', 'SadiaPass101', 'sadia.khan@gmail.com', '4220112345679', '2025-05-08'),
('Farhan Iqbal', 'farhaniqbal', 'FarhanPass112', 'farhan.iqbal@gmail.com', '4220112345680', '2025-05-02');

-- Insert Original Tenants (account creation dates in early 2025)
INSERT INTO Tenant (fullName, userName, Password, email, CNIC, accountCreationDate)
VALUES 
('Sara Khan', 'sarakhan', 'SaraPass123', 'sara.khan@gmail.com', '4220112345681', '2025-01-25'),
('Ahmed Raza', 'ahmedraza', 'AhmedPass456', 'ahmed.raza@gmail.com', '4220112345682', '2025-02-15'),
('Zainab Malik', 'zainabmalik', 'ZainabPass789', 'zainab.malik@gmail.com', '4220112345683', '2025-03-20'),
('Hassan Ali', 'hassanali', 'HassanPass101', 'hassan.ali@gmail.com', '4220112345684', '2025-05-10'),
('Amina Shah', 'aminashah', 'AminaPass112', 'amina.shah@gmail.com', '4220112345685', '2025-05-03'),

-- Additional Tenants
('Imran Sheikh', 'imransheikh', 'ImranPass123', 'imran.sheikh@gmail.com', '4220112345686', '2025-01-20'),
('Sana Javed', 'sanajaved', 'SanaPass456', 'sana.javed@gmail.com', '4220112345687', '2025-01-10'),
('Tariq Mahmood', 'tariqmahmood', 'TariqPass789', 'tariq.mahmood@gmail.com', '4220112345688', '2025-03-25'),
('Lubna Farooq', 'lubnafarooq', 'LubnaPass101', 'lubna.farooq@gmail.com', '4220112345689', '2025-04-15'),
('Waqar Ahmed', 'waqarahmed', 'WaqarPass112', 'waqar.ahmed@gmail.com', '4220112345690', '2025-05-04');

-- Insert Admins (account creation dates in early 2025)
INSERT INTO Admin (fullName, userName, Password, email, CNIC, accountCreationDate)
VALUES 
('Admin One', 'admin1', 'admin123', 'admin.one@gmail.com', '4220112345691', '2025-01-01'),
('Admin Two', 'admin2', 'admin456', 'admin.two@gmail.com', '4220112345692', '2025-01-01');

-- Insert Original Properties
INSERT INTO Property (propertyName, Area, location, fixedRent, ownerName, tenantName, numOfBedRooms, numOfRooms, numOfBaths)
VALUES
('Sunny Villa', '1 Kanal', '123 Main Street, Lahore', 75000.00, 'alikhan', 'sarakhan', 3, 5, 3),
('Garden View', '10 Marla', '456 Park Avenue, Karachi', 55000.00, 'fatimaahmed', 'ahmedraza', 2, 3, 2),
('Hilltop Apartment', '2 Kanal', '789 Hillside Road, Islamabad', 85000.00, 'usmanmalik', 'zainabmalik', 4, 6, 4),
('City Heights', '8 Marla', '321 Downtown Plaza, Lahore', 65000.00, 'ayeshaza', 'hassanali', 3, 4, 2),
('Lakeview House', '1.5 Kanal', '654 Lakeside Drive, Karachi', 95000.00, 'bilalhussain', 'aminashah', 5, 7, 5),

-- Additional Properties
('Royal Residency', '2 Kanal', '12 The Mall, Lahore', 120000.00, 'razashah', 'imransheikh', 6, 8, 5),
('Green Valley', '5 Marla', '34 Garden Road, Islamabad', 45000.00, 'nadiaakhtar', 'sanajaved', 2, 3, 2),
('Ocean Breeze', '1 Kanal', '78 Beach View, Karachi', 110000.00, 'kamransiddiqui', 'tariqmahmood', 4, 6, 4),
('Mountain View', '12 Marla', '56 Hill Street, Murree', 80000.00, 'sadiakhan', 'lubnafarooq', 3, 5, 3),
('Downtown Loft', '7 Marla', '90 Commercial Area, Lahore', 60000.00, 'farhaniqbal', 'waqarahmed', 2, 3, 2);

-- Insert Original Payments (all in May 2025, before current date)
INSERT INTO Payment (paymentStatus, paymentDate, amount, propertyID, tenantUserName, ownerUserName)
VALUES
('Paid', '2025-05-01', 75000, 1, 'sarakhan', 'alikhan'),
('Paid', '2025-05-05', 55000, 2, 'ahmedraza', 'fatimaahmed'),
('Paid', '2025-05-15', 65000, 4, 'hassanali', 'ayeshaza'),

-- Additional Payments
('Paid', '2025-05-03', 120000, 6, 'imransheikh', 'razashah'),
('Paid', '2025-05-12', 110000, 8, 'tariqmahmood', 'kamransiddiqui'),
('Paid', '2025-05-22', 60000, 10, 'waqarahmed', 'farhaniqbal');

-- Insert Original Property Assignments (April-May 2025 dates)
INSERT INTO propertyAssignment (propertyID, ownerID, tenantID, assignmentDate)
VALUES
(1, 1, 1, '2025-04-01'),
(2, 2, 2, '2025-04-05'),
(3, 3, 3, '2025-04-10'),
(4, 4, 4, '2025-04-15'),
(5, 5, 5, '2025-04-20'),

-- Additional Property Assignments
(6, 6, 6, '2025-04-03'),
(7, 7, 7, '2025-04-08'),
(8, 8, 8, '2025-04-12'),
(9, 9, 9, '2025-04-18'),
(10, 10, 10, '2025-04-22');

-- Insert Original Rent Assignments (May 2025 dates, ending before current date)
INSERT INTO rentAssignment (propertyID, tenantID, startDate, dueDate)
VALUES
(1, 1, '2025-05-01', '2025-05-31'),
(2, 2, '2025-05-01', '2025-05-31'),
(3, 3, '2025-05-01', '2025-05-31'),
(4, 4, '2025-05-01', '2025-05-31'),
(5, 5, '2025-05-01', '2025-05-31'),

-- Additional Rent Assignments
(6, 6, '2025-05-01', '2025-05-31'),
(7, 7, '2025-05-01', '2025-05-31'),
(8, 8, '2025-05-01', '2025-05-31'),
(9, 9, '2025-05-01', '2025-05-31'),
(10, 10, '2025-05-01', '2025-05-31');

-- Insert Blacklisted Users
INSERT INTO blackListedUsers (CNIC)
VALUES
('4220112340001'),
('4220112340002');

-- Insert Original Owner Notifications (May 2025 dates, before current date)
INSERT INTO ownerNotifications (ownerID, subject, sentDate, propertyName, tenantUserName, content)
VALUES
(1, 'Rent Paid', '2025-05-02', 'Sunny Villa', 'sarakhan', 'Tenant Sara Khan has paid the rent for May 2025'),
(2, 'Rent Paid', '2025-05-06', 'Garden View', 'ahmedraza', 'Tenant Ahmed Raza has paid the rent for May 2025'),
(3, 'Rent Due', '2025-05-25', 'Hilltop Apartment', 'zainabmalik', 'Reminder: Rent for May 2025 is still pending'),
(4, 'Rent Paid', '2025-05-16', 'City Heights', 'hassanali', 'Tenant Hassan Ali has paid the rent for May 2025'),
(5, 'Rent Due', '2025-05-25', 'Lakeview House', 'aminashah', 'Reminder: Rent for May 2025 is still pending'),

-- Additional Owner Notifications
(6, 'Rent Paid', '2025-05-04', 'Royal Residency', 'imransheikh', 'Tenant Imran Sheikh has paid the rent for May 2025'),
(7, 'Rent Due', '2025-05-25', 'Green Valley', 'sanajaved', 'Reminder: Rent for May 2025 is still pending'),
(8, 'Rent Paid', '2025-05-13', 'Ocean Breeze', 'tariqmahmood', 'Tenant Tariq Mahmood has paid the rent for May 2025'),
(9, 'Rent Due', '2025-05-25', 'Mountain View', 'lubnafarooq', 'Reminder: Rent for May 2025 is still pending'),
(10, 'Rent Paid', '2025-05-23', 'Downtown Loft', 'waqarahmed', 'Tenant Waqar Ahmed has paid the rent for May 2025');

-- Insert Original Tenant Notifications (May 2025 dates, before current date)
INSERT INTO tenantNotifications (tenantID, subject, sentDate, propertyName, ownerUserName, content)
VALUES
(1, 'Payment Confirmation', '2025-05-02', 'Sunny Villa', 'alikhan', 'Your rent payment for May 2025 has been received'),
(2, 'Payment Confirmation', '2025-05-06', 'Garden View', 'fatimaahmed', 'Your rent payment for May 2025 has been received'),
(3, 'Payment Reminder', '2025-05-25', 'Hilltop Apartment', 'usmanmalik', 'Friendly reminder: Your rent for May 2025 is due'),
(4, 'Payment Confirmation', '2025-05-16', 'City Heights', 'ayeshaza', 'Your rent payment for May 2025 has been received'),
(5, 'Payment Reminder', '2025-05-25', 'Lakeview House', 'bilalhussain', 'Friendly reminder: Your rent for May 2025 is due'),

-- Additional Tenant Notifications
(6, 'Payment Confirmation', '2025-05-04', 'Royal Residency', 'razashah', 'Your rent payment for May 2025 has been received'),
(7, 'Payment Reminder', '2025-05-25', 'Green Valley', 'nadiaakhtar', 'Friendly reminder: Your rent for May 2025 is due'),
(8, 'Payment Confirmation', '2025-05-13', 'Ocean Breeze', 'kamransiddiqui', 'Your rent payment for May 2025 has been received'),
(9, 'Payment Reminder', '2025-05-25', 'Mountain View', 'sadiakhan', 'Friendly reminder: Your rent for May 2025 is due'),
(10, 'Payment Confirmation', '2025-05-23', 'Downtown Loft', 'farhaniqbal', 'Your rent payment for May 2025 has been received');

-- Insert Payment Reminders (May 2025 dates, before current date)
--INSERT INTO PaymentReminder (paymentID, emailSentDate)
--VALUES
--(3, '2025-05-25'),
--(5, '2025-05-25'),
--(7, '2025-05-25'),
--(9, '2025-05-25');


select * from Owner