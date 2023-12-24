# Quiz Management System

This is the documentation for the Authentication and Core Service component of the Quiz Management System. It is built using TypeScript, Express.js, Zod validation, PostgreSQL and Prisma.

### Backend Live Link: https://quiz-backend-pied.vercel.app

### Application Routes:-

#### Auth

- https://quiz-backend-pied.vercel.app/api/v1/auth/signup (POST)
- https://quiz-backend-pied.vercel.app/api/v1/auth/signin (POST)
- https://quiz-backend-pied.vercel.app/api/v1/auth/refresh-token (POST)

#### User

- https://quiz-backend-pied.vercel.app/api/v1/users (GET)
- https://quiz-backend-pied.vercel.app/api/v1/users/6177a5b87d32123f08d2f5d4 (Single GET) Include an id that is saved in your database
- https://quiz-backend-pied.vercel.app/api/v1/users/6177a5b87d32123f08d2f5d4 (PATCH)
- https://quiz-backend-pied.vercel.app/api/v1/users/6177a5b87d32123f08d2f5d4 (DELETE) Include an id that is saved in your database

#### Profile

- https://quiz-backend-pied.vercel.app/api/v1/profile (GET)

### Category

- https://quiz-backend-pied.vercel.app/api/v1/categories/create-category (POST)
- https://quiz-backend-pied.vercel.app/api/v1/categories (GET)
- https://quiz-backend-pied.vercel.app/api/v1/categories/6177a5b87d32123f08d2f5d4 (Single GET) Include an id that is saved in your database
- https://quiz-backend-pied.vercel.app/api/v1/categories/6177a5b87d32123f08d2f5d4 (PATCH)
- https://quiz-backend-pied.vercel.app/api/v1/categories/6177a5b87d32123f08d2f5d4 (DELETE) Include an id that is saved in your database

### Quiz

- https://quiz-backend-pied.vercel.app/api/v1/quizs/create-quiz (POST)
- https://quiz-backend-pied.vercel.app/api/v1/quizs (GET)
- https://quiz-backend-pied.vercel.app/api/v1/quizs/:id (GET)
- https://quiz-backend-pied.vercel.app/api/v1/quizs/:id (PATCH)
- https://quiz-backend-pied.vercel.app/api/v1/quizs/:id (DELETE)

#### Leader Board

- https://quiz-backend-pied.vercel.app/api/v1/leaderBoards/create-leaderBoard (POST)
- https://quiz-backend-pied.vercel.app/api/v1/leaderBoards (GET)
- https://quiz-backend-pied.vercel.app/api/v1/leaderBoards/:id (GET)
- https://quiz-backend-pied.vercel.app/api/v1/leaderBoards/:id (PATCH)
- https://quiz-backend-pied.vercel.app/api/v1/leaderBoards/:id (DELETE)


Postman Documentation: [Click Here](https://documenter.getpostman.com/view/26682150/2s93zB72V9#acc25f08-de78-478b-809d-837ce239d2b3)