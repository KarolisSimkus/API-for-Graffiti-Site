# Graffiti Catalog API

A Node.js API for cataloging local graffiti and publishing descriptions associated with graffiti records. The service uses Express and MongoDB, and provides REST endpoints alongside a small GraphQL query.

## Features

- Create, list, retrieve, update, and delete graffiti records.
- Upload a JPEG image when creating a graffiti record.
- Create and browse descriptions linked to graffiti records.
- Register users and authenticate requests with JSON Web Tokens (JWT).
- Query a basic GraphQL `hello` field.

## Requirements

- Node.js 18 or later
- npm
- MongoDB credentials for the cluster configured by the application

## Getting started

1. Install dependencies:

   ```sh
   npm install
   ```

2. Create a `.env` file in the project root:

   ```env
   MONGO_PASSWORD=your_mongodb_password
   JWT_KEY=replace_with_a_long_random_secret
   ```

   `MONGO_PASSWORD` is used in the MongoDB connection string. `JWT_KEY` signs and verifies authentication tokens. Keep this file private; it is excluded from Git.

3. Create the local image upload directory:

   ```sh
   mkdir uploads
   ```

4. Start the API:

   ```sh
   npm start
   ```

The server listens on port `5000` by default. The application currently reads its port from the lowercase `port` environment variable if set.

## REST API

All endpoints are relative to `http://localhost:5000`. JSON request bodies should use `Content-Type: application/json`, except for image uploads, which use `multipart/form-data`.

### Authentication

Register with `POST /user/signup` and sign in with `POST /user/login`. A successful login returns a JWT. Send it on protected requests in the `Authorization` header:

```http
Authorization: Bearer <token>
```

Tokens expire after one hour.

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/user/signup` | Public | Register with `email` and `password`. |
| `POST` | `/user/login` | Public | Authenticate with `email` and `password`; returns a token. |
| `DELETE` | `/user/:userId` | JWT required | Delete the user with the specified ID. |

Example signup or login request:

```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

### Graffiti

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/graffs` | Public | List graffiti records. |
| `GET` | `/graffs/:graffId` | Public | Retrieve a graffiti record. |
| `POST` | `/graffs` | JWT required | Create a graffiti record with an image upload. |
| `PATCH` | `/graffs/:graffId` | JWT required | Update graffiti fields. |
| `DELETE` | `/graffs/:graffId` | JWT required | Delete a graffiti record. |

To create a graffiti record, send a `multipart/form-data` request with:

- `name`: the record name
- `image`: a JPEG file, up to 5 MiB

The uploaded file is stored in `uploads/`.

### Blog entries

Every blog endpoint requires a JWT.

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/blogs` | List blog entries and their associated graffiti names. |
| `GET` | `/blogs/:blogId` | Retrieve a blog entry. |
| `POST` | `/blogs` | Create a blog entry linked to an existing graffiti record. |
| `DELETE` | `/blogs/:blogId` | Delete a blog entry. |

Create a blog entry with a JSON request body containing the graffiti record ID and description:

```json
{
  "graffId": "<graffiti_record_id>",
  "description": "A description of the artwork and its location."
}
```

## GraphQL

The GraphQL interface is mounted at `/graphql`. The currently defined query is `hello`:

```graphql
{
  hello {
    text
    views
  }
}
```

## Project structure

```text
api/
  controllers/   Request handlers
  graphql/       GraphQL schema and resolvers
  middleware/    Authentication middleware
  models/        Mongoose models
  routes/        REST route definitions
app.js           Express app and database connection
server.js        HTTP server entry point
```

## Development notes

- Run `npm start` to start the server with Nodemon.
- The repository does not currently define an automated test suite.
- Do not commit `.env` files or production credentials.
