# NestJS Blog Application

## Project Setup

1.  **Clone the Repository**

```bash
git clone https://github.com/sajagporwal123/blog-app-backend.git
cd blog-app-backend
```

2.  **Install Dependencies**
    Make sure you have Node.js installed. Then run:

```bash
npm install
```

3.  **Create the `.env` File**
    Create a `.env` file in the root directory of your project and add the following environment variables:

```plaintext
MONGO_DB_HOST=mongodb://localhost:27017
MONGO_DB_NAME=blog-app
PORT=3000
GOOGLE_CLIENT_ID=XXXXXXXXXX.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=XXXXXXXXXX
JWT_SECRET=your_jwt_secret
```

## Running the Project

1.  **Start the Application**

```bash
npm run start
```

2.  **Access Swagger API Documentation**
    Open your browser and navigate to:

```plaintext
http://localhost:3000/api
```

## Generating Dummy Data

1.  **Ensure the `.env` File is Set Up**

    Make sure the `.env` file is configured with the correct credentials as mentioned in the [Project Setup](#project-setup) section.

2.  **Run the Dummy Data Script**

    Execute the `generateAndDumpData.js` script to generate and populate the database with dummy data:

```bash
node generateAndDumpData.js
```

## Running Unit Tests

1.  **Execute Unit Tests**
    To run all unit tests defined in your project, use:

```bash
npm run test
```
