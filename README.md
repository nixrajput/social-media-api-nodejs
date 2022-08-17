# social-media-api-nodejs

An open-source RESTful API developed using NodeJS, ExpressJS and MongoDB helps you to integrate User Authentication and Social Media Post Management in your application with ease.

## Features

- Login
- Registration
- Get Profile Details
- Update Profile Details
- Upload Profile Picture
- Delete Profile
- Add Post
- Get Posts
- Like/Unlike Post
- Update Post
- Delete Post
- Add Comment
- Get Comments
- Like/Unlike Comment
- Delete Comment

## Usage

- Clone the repository

```bash
git clone https://github.com/nixrajput/social-media-api-nodejs.git
```

- Install required modules
  
```bash
npm install
```

- Create a new directory `config` in `src` directory
- Create a new file `config.env` in `config` directory
- Add following VARIABLES in `config.env` or in production Environment Variables
  
```env
PORT = YOUR PORT

MONGO_URI = 'YOUR MONGO-DB URI'
DB_NAME = 'YOUR MONGO-DB DATABASE NAME'

NODE_ENV = 'development'

JWT_SECRET = 'YOUR SECRET'
JWT_EXPIRES_IN = 7d

SMTP_FROM = 'Test <noreply@yourcompany.com>'

SENDGRID_API_KEY = 'YOUR SENDGRID API KEY'

# Cloudinary
CLOUDINARY_CLOUD_NAME = 'YOUR CLOUDINARY CLOUD NAME'
CLOUDINARY_API_KEY = 'YOUR CLOUDINARY API KEY'
CLOUDINARY_API_SECRET = 'YOUR CLOUDINARY API SECRET'
```

- Run the server

```bash
npm run dev
```

## Documentation

[Link](https://app.swaggerhub.com/apis-docs/nixrajput-apis/social-media-api/1.0.0)

## Connect With Me

[<img align="left" alt="nixrajput | Website" width="24px" src="https://raw.githubusercontent.com/nixrajput/nixlab-files/master/images/icons/globe-icon.svg" />][website]

[<img align="left" alt="nixrajput | GitHub" width="24px" src="https://raw.githubusercontent.com/nixrajput/nixlab-files/master/images/icons/github-brands.svg" />][github]

[<img align="left" alt="nixrajput | Instagram" width="24px" src="https://raw.githubusercontent.com/nixrajput/nixlab-files/master/images/icons/instagram-brands.svg" />][instagram]

[<img align="left" alt="nixrajput | Facebook" width="24px" src="https://raw.githubusercontent.com/nixrajput/nixlab-files/master/images/icons/facebook-brands.svg" />][facebook]

[<img align="left" alt="nixrajput | Twitter" width="24px" src="https://raw.githubusercontent.com/nixrajput/nixlab-files/master/images/icons/twitter-brands.svg" />][twitter]

[<img align="left" alt="nixrajput | LinkedIn" width="24px" src="https://raw.githubusercontent.com/nixrajput/nixlab-files/master/images/icons/linkedin-in-brands.svg" />][linkedin]


[github]: https://github.com/nixrajput
[website]: https://nixlab.co.in
[facebook]: https://facebook.com/nixrajput07
[twitter]: https://twitter.com/nixrajput07
[instagram]: https://instagram.com/nixrajput
[linkedin]: https://linkedin.com/in/nixrajput
