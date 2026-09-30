\# FoodHub — Full-Stack Food Ordering Platform



FoodHub is a full-stack food ordering web application that connects customers, restaurant owners, and administrators through a role-based platform.



The application provides restaurant discovery, menu management, cart and checkout functionality, order tracking, restaurant owner onboarding, and administrative management.



\## Features



\### Customer

\- Browse restaurants

\- View restaurant menus

\- Browse food categories

\- Add food items to cart

\- Update cart quantities

\- Checkout and place orders

\- View order history

\- View order details

\- Cancel eligible orders

\- Apply to become a restaurant owner



\### Restaurant Owner

\- Restaurant dashboard

\- Create and edit restaurants

\- Manage food categories

\- Add and edit food items

\- Set food availability

\- Manage restaurant orders

\- Update order status

\- Apply restaurant ownership workflow



\### Administrator

\- Admin dashboard

\- Manage users

\- Activate/deactivate users

\- Approve restaurants

\- Manage restaurant status

\- Review restaurant owner applications

\- Approve or reject owner applications



\## Tech Stack



\### Frontend

\- React

\- Vite

\- React Router

\- Axios

\- JavaScript

\- CSS



\### Backend

\- Java

\- Spring Boot

\- Spring Security

\- JWT Authentication

\- Spring Data MongoDB

\- Maven



\### Database

\- MongoDB



\## Architecture



```text

FoodHub

│

├── food-ordering-frontend

│   ├── components

│   ├── pages

│   ├── services

│   ├── context

│   └── assets

│

└── food-ordering-backend

&#x20;   ├── controller

&#x20;   ├── service

&#x20;   ├── repository

&#x20;   ├── model

&#x20;   ├── dto

&#x20;   ├── security

&#x20;   └── exception

User Roles

Customer

&#x20;  │

&#x20;  ├── Browse Restaurants

&#x20;  ├── Manage Cart

&#x20;  ├── Place Orders

&#x20;  └── Track Orders

&#x20;      

Restaurant Owner

&#x20;  │

&#x20;  ├── Manage Restaurant

&#x20;  ├── Manage Menu

&#x20;  └── Manage Orders



Administrator

&#x20;  │

&#x20;  ├── Manage Users

&#x20;  ├── Approve Restaurants

&#x20;  └── Review Owner Applications

Authentication \& Authorization



FoodHub uses JWT-based authentication with role-based authorization.



Supported roles:



CUSTOMER

RESTAURANT\_OWNER

ADMIN



Protected backend endpoints are secured using Spring Security and role-based access control.



Main Application Flow

Customer

&#x20;  ↓

Login / Register

&#x20;  ↓

Browse Restaurants

&#x20;  ↓

View Menu

&#x20;  ↓

Add Items to Cart

&#x20;  ↓

Checkout

&#x20;  ↓

Place Order

&#x20;  ↓

Track Order



Restaurant Owner

&#x20;  ↓

Owner Application

&#x20;  ↓

Admin Review

&#x20;  ↓

Restaurant Owner Access

&#x20;  ↓

Create Restaurant

&#x20;  ↓

Manage Menu

&#x20;  ↓

Manage Orders



Administrator

&#x20;  ↓

Admin Dashboard

&#x20;  ↓

Manage Users

&#x20;  ↓

Approve Restaurants

&#x20;  ↓

Review Owner Applications

Running the Project Locally

Prerequisites

Java 21

Node.js

npm

MongoDB

Backend



Navigate to the backend:



cd food-ordering-backend



Configure the required JWT secret as an environment variable:



JWT\_SECRET=your-secret-value



Make sure MongoDB is running locally.



The backend runs on:



http://localhost:8080

Frontend



Navigate to the frontend:



cd food-ordering-frontend



Install dependencies:



npm install



Start the development server:



npm run dev



The frontend runs on:



http://localhost:5173

Database



FoodHub uses MongoDB for persistent application data.



The local development database is:



food\_ordering\_db

Project Highlights

Full-stack React + Spring Boot application

RESTful API architecture

JWT authentication

Role-based authorization

MongoDB persistence

Customer ordering workflow

Restaurant management

Menu and category management

Restaurant owner onboarding workflow

Admin approval workflows

Responsive design for desktop and mobile

Input validation and centralized exception handling

Future Improvements

Online payment integration

Order delivery tracking

Restaurant search and advanced filtering

Customer reviews and ratings

Image upload through cloud storage

Email/SMS notifications

Production deployment

Author



Gokul CP

