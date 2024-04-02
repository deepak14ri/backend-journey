# YouTube + Twitter Backend Journey Project

This project aims to build a backend system similar to YouTube and Twitter, encompassing various functionalities found in both applications. The backend is developed using Node.js with Express.js framework and utilizes MongoDB for data storage. Key features include user management, profile management, watch history tracking, password encryption, and integration with Cloudinary for media storage. JWT is used for authentication, Bcrypt for password encryption, and Multer for handling file uploads.

## Features

- **User Management:** Includes registration, login, logout, and profile update functionalities.
- **Profile Management:** Users can manage their profiles, including editing personal information and uploading profile pictures.
- **Watch History Tracking:** Tracks users' watch history to provide personalized recommendations.
- **Password Encryption:** Utilizes Bcrypt to securely hash passwords before storing them in the database.

## Technologies Used

The project employs:

- **Node.js:** JavaScript runtime for server-side development.
- **Express.js:** Web application framework for Node.js used for building APIs.
- **MongoDB:** NoSQL database for storing user data and other application-related information.
- **Cloudinary:** Cloud-based media management platform for storing and serving images and videos.
- **JWT (JSON Web Tokens):** Used for user authentication and authorization.
- **Bcrypt:** Library for password hashing to enhance security.
- **Multer:** Middleware for handling file uploads in Node.js applications.

## Screenshots

Screenshots of Postman requests demonstrating API endpoints and functionality will be provided in the repository's screenshots directory.

## Setup Instructions

1. Clone the repository to your local machine.
2. Install dependencies using `npm install`.
3. Set up environment variables such as database connection details, Cloudinary API key, JWT secret, etc.
4. Run the application using `npm start`.
5. Access API endpoints using a tool like Postman for testing and integration.

## Contribution

Contributions are welcome! Feel free to submit issues or pull requests to improve the project.

## License

This project is licensed under the MIT License.

*Note: This README provides an overview of the project. Detailed documentation and setup instructions can be found in the project repository.*
