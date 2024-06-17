# Social Media API

A social media API built with Node.js, Express.js, and MongoDB. This API is built for developers to use in their projects. It is not meant to be used as a standalone social media platform. This API is still in development and is not ready for production use.

[![Stars](https://img.shields.io/github/stars/nixrajput/social-media-api-nodejs?label=Stars&style=flat)][repo]
[![Forks](https://img.shields.io/github/forks/nixrajput/social-media-api-nodejs?label=Forks&style=flat)][repo]
[![Watchers](https://img.shields.io/github/watchers/nixrajput/social-media-api-nodejs?label=Watchers&style=flat)][repo]
[![Contributors](https://img.shields.io/github/contributors/nixrajput/social-media-api-nodejs?label=Contributors&style=flat)][repo]

[![GitHub last commit](https://img.shields.io/github/last-commit/nixrajput/social-media-api-nodejs?label=Last+Commit&style=flat)][repo]
[![GitHub issues](https://img.shields.io/github/issues/nixrajput/social-media-api-nodejs?label=Issues&style=flat)][issues]
[![GitHub pull requests](https://img.shields.io/github/issues-pr/nixrajput/social-media-api-nodejs?label=Pull+Requests&style=flat)][pulls]
[![GitHub Licence](https://img.shields.io/github/license/nixrajput/social-media-api-nodejs?label=Licence&style=flat)][license]

## Table of Contents

- [Social Media API](#social-media-api)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Upcoming Features](#upcoming-features)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Configuration](#configuration)
    - [Database Setup](#database-setup)
    - [Running the Application](#running-the-application)
  - [API Documentation](#api-documentation)
    - [Authentication](#authentication)
    - [Endpoints](#endpoints)
      - [Auth](#auth)
      - [Post](#post)
  - [Deployment](#deployment)
  - [Technologies Used](#technologies-used)
  - [Contributing](#contributing)
  - [License](#license)
  - [Sponsor Me](#sponsor-me)
  - [Connect With Me](#connect-with-me)
  - [Activities](#activities)

## Features

- User authentication and authorization.
- CRUD operations for users, posts, and notifications.
- JWT-based authentication for secure API access.
- RESTful API design.
- Written in TypeScript for enhanced maintainability and type safety.

## Upcoming Features

- Personal Chat
- Group Chat
- End-To-End Encryption in Chat

## Getting Started

You can follow these instructions to get the project up and running on your local machine.

### Prerequisites

You need to have the following software installed on your computer:

- [Bun](https://bun.sh/) (v1.1.0 or later) or [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/), [pnpm](https://pnpm.io/), [Yarn](https://yarnpkg.com/) or [Bun](https://bun.sh/) package manager

### Installation

1. Star the repository.

2. Clone this repository to your local machine using the following command:

   ```bash
   git clone https://github.com/nixrajput/social-media-api-nodejs.git
   ```

3. Navigate to the project directory:

   ```bash
   cd social-media-api-nodejs
   ```

4. Install the project dependencies:

   If you're using npm:

   ```bash
   npm install
   ```

   If you're using pnpm:

   ```bash
   pnpm install
   ```

   If you're using Yarn:

   ```bash
   yarn install
   ```

   If you're using bun:

   ```bash
   bun install
   ```

### Configuration

Before running the application, you need to configure the environment variables. Copy the `.env.example` file to `.env.local` and fill in the necessary values.

```bash
cp .env.example .env.local
```

### Database Setup

Make sure you have a database configured and running. Update the database connection details in the `.env.local` file.

### Running the Application

Once the dependencies are installed and the configuration is set up, you can start the application by running:

```bash
npm run dev
#or
pnpm run dev
# or
yarn dev
# or
bun run dev
```

By default, the application will run on port `3000`. You can change the port by modifying the `PORT` environment variable in the `.env.local` file.

## API Documentation

### Authentication

The API uses JWT (JSON Web Tokens) for authentication. To authenticate, send a POST request to `/api/v2/auth/login` with a JSON payload containing the user's email and password.

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

If the credentials are valid, the API will respond with a JWT token, which should be included in subsequent requests as an Authorization header:

```json
Authorization: Bearer <token>
```

### Endpoints

#### Auth

- **POST /api/v2/auth/register**: Create a new account.
- **POST /api/v2/auth/login**: Login to the account.
- **GET /api/v2/auth/me**: Get profile details.

#### Post

- **GET /api/v2/post/create**: Create a new post.
- **GET /api/v2/post/feed**: Get post feed.

## Deployment

This API can be deployed using various platforms such as Heroku, AWS, Google Cloud Platform, or your own server infrastructure. Here are some general steps to deploy the API:

1. **Prepare your environment**: Ensure that your deployment environment meets the requirements specified in the Prerequisites section.

2. **Build the application**: If necessary, build the TypeScript code into JavaScript. You can do this by running:

   ```bash
   npm run build
   ```

   or

   ```bash
   yarn build
   ```

   or

   ```bash
   bun run build
   ```

3. **Configure environment variables**: Set up environment variables similar to how it's done in the local setup. Ensure that you provide appropriate values for your deployment environment.

4. **Deploy the application**: Deploy the built application to your chosen platform. Each platform may have its own deployment process. Refer to the documentation of your chosen platform for detailed instructions.

5. **Start the application**: Once deployed, start the application in your deployment environment. This might involve running a command similar to `npm start` or `yarn start`, depending on your setup.

6. **Monitor the deployment**: Monitor the deployed application for any issues. Make sure that it's running smoothly and handle any errors or performance issues as needed.

## Technologies Used

- Node.js
- Express.js
- Bun
- TypeScript
- MongoDB

## Contributing

If you would like to contribute to this project, feel free to fork the repository, make your changes, and submit a pull request. Please follow the guidelines in the [CONTRIBUTING.md](CONTRIBUTING.md) file.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Sponsor Me

By sponsoring my efforts, you're not merely contributing to the development of my projects; you're investing in its growth and sustainability.

Your support empowers me to dedicate more time and resources to improving the project's features, addressing issues, and ensuring its continued relevance in the rapidly evolving landscape of technology.

Your sponsorship directly fuels innovation, fosters a vibrant community, and helps maintain the project's high standards of quality. Together, we can shape the future of the projects and make a lasting impact in the open-source community.

Thank you for considering sponsoring my work!

[![Sponsor](https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/nixrajput)

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/nixrajput)

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/nixrajput)

## Connect With Me

[![GitHub: nixrajput](https://img.shields.io/badge/nixrajput-EFF7F6?logo=GitHub&logoColor=333&link=https://www.github.com/nixrajput)][github]
[![Linkedin: nixrajput](https://img.shields.io/badge/nixrajput-EFF7F6?logo=LinkedIn&logoColor=blue&link=https://www.linkedin.com/in/nixrajput)][linkedin]
[![Instagram: nixrajput](https://img.shields.io/badge/nixrajput-EFF7F6?logo=Instagram&link=https://www.instagram.com/nixrajput)][instagram]
[![Twitter: nixrajput07](https://img.shields.io/badge/nixrajput-EFF7F6?logo=X&logoColor=333&link=https://x.com/nixrajput)][twitter]
[![Telegram: nixrajput](https://img.shields.io/badge/nixrajput-EFF7F6?logo=Telegram&link=https://telegram.me/nixrajput)][telegram]
[![Gmail: nkr.nikhi.nkr@gmail.com](https://img.shields.io/badge/nkr.nikhil.nkr@gmail.com-EFF7F6?logo=Gmail&link=mailto:nkr.nikhil.nkr@gmail.com)][gmail]

## Activities

![Alt](https://repobeats.axiom.co/api/embed/c3dfb333461ededdd3671da9162a49bea38a9126.svg "Repobeats analytics image")

[github]: https://github.com/nixrajput
[twitter]: https://twitter.com/nixrajput07
[instagram]: https://instagram.com/nixrajput
[linkedin]: https://linkedin.com/in/nixrajput
[telegram]: https://telegram.me/nixrajput
[gmail]: mailto:nkr.nikhil.nkr@gmail.com

[repo]: https://github.com/nixrajput/social-media-api-nodejs
[issues]: https://github.com/nixrajput/social-media-api-nodejs/issues
[pulls]: https://github.com/nixrajput/social-media-api-nodejs/pulls
[license]: https://github.com/nixrajput/social-media-api-nodejs/blob/master/LICENSE.md
