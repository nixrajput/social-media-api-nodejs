# Social Media API

An open source social media API built with Node.js, Express, and MongoDB. This API is built for developers to use in their projects. It is not meant to be used as a standalone social media platform. This API is still in development and is not ready for production use.

[![Stars](https://img.shields.io/github/stars/nixrajput/social-media-api-nodejs?label=Stars)][repo]
[![Forks](https://img.shields.io/github/forks/nixrajput/social-media-api-nodejs?label=Forks)][repo]
[![Watchers](https://img.shields.io/github/watchers/nixrajput/social-media-api-nodejs?label=Watchers)][repo]
[![Contributors](https://img.shields.io/github/contributors/nixrajput/social-media-api-nodejs?label=Contributors)][repo]

[![GitHub last commit](https://img.shields.io/github/last-commit/nixrajput/social-media-api-nodejs?label=Last+Commit)][repo]
[![GitHub issues](https://img.shields.io/github/issues/nixrajput/social-media-api-nodejs?label=Issues)][issues]
[![GitHub pull requests](https://img.shields.io/github/issues-pr/nixrajput/social-media-api-nodejs?label=Pull+Requests)][pulls]
[![GitHub Licence](https://img.shields.io/github/license/nixrajput/social-media-api-nodejs?label=Licence)][license]

* This project is powered by [NixLab Technologies][website].

* If you would like to contribute to this project, please see the [contributing guidelines](CONTRIBUTING.md).

* We are open to suggestions and contributions. Feel free to open an [issue](https://github.com/nixrajput/social-media-api-nodejs/issues) or a [pull request](https://github.com/nixrajput/social-media-api-nodejs/pulls). If you like the project, please consider giving it a star.

* Due to database limitations, the API is currently hosted on a free tier of MongoDB Atlas. So, it may take a few seconds to respond to your request. Please be patient.

* This API is currently in development stage. So, after releasing the production version, we will be adding more features to it. You can check the progress of the project here. If you have any suggestions, feel free to open an issue.

* For the production version, we are planning to host the API on AWS and a paid tier of MongoDB Atlas. So, it will be more reliable and faster.

* After releasing the production version, we may delete some of the data in the database for better and faster performance. Data will be deleted only if it is not required for the project or it may cause any issues or conflicts.

If you would like to contribute, please read the [contribution guidelines](CONTRIBUTING.md).

## Documentation

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Authors

* **[Nikhil Rajput][portfolio]** - *Owner & Lead Developer*

## Features

* [x] User Authentication
* [x] Post Feed
* [x] Post Creation
* [x] Post Editing
* [x] Post Deletion
* [x] Post Liking
* [x] Post Commenting
* [x] Post Sharing
* [x] Post Searching
* [ ] Post Filtering
* [ ] Post Sorting
* [x] Post Reporting
* [x] Post Blocking
* [ ] Post Muting
* [x] Profile Creation
* [x] Profile Editing
* [ ] Profile Deactivation
* [x] User Following
* [x] User Unfollowing
* [ ] User Blocking
* [ ] User Muting
* [x] User Searching
* [x] User Filtering
* [x] Trending Posts
* [x] Hash Tagging
* [x] Post Tagging
* [x] User Tagging
* [x] Recommendations
* [ ] Search Suggestions

## Usage

* Star and Fork the repository
* Clone the repository

```bash
git clone https://github.com/<your-github-username>/social-media-api-nodejs.git
```

* Install required modules
  
```bash
npm install
```

* Create a new directory `config` in `src` directory
* Create a new file `config.env` in `config` directory
* Add following VARIABLES in `config.env` or in production Environment Variables
* Replace XXXXXXXXXXXXXXXXXX with your own values
  
```env
PORT = YOUR PORT

MONGO_URI = 'XXXXXXXXXXXXXXXXXX'
DB_NAME = 'XXXXXXXXXXXXXXXXXX'

NODE_ENV = 'development'

JWT_SECRET = 'XXXXXXXXXXXXXXXXXX'
JWT_EXPIRES_IN = 7d

SMTP_FROM = 'Test <noreply@yourcompany.com>'

SENDGRID_API_KEY = 'XXXXXXXXXXXXXXXXXX'

# Cloudinary
CLOUDINARY_CLOUD_NAME = 'XXXXXXXXXXXXXXXXXX'
CLOUDINARY_API_KEY = 'XXXXXXXXXXXXXXXXXX'
CLOUDINARY_API_SECRET = 'XXXXXXXXXXXXXXXXXX'

# Twilio
TWILIO_ACCOUNT_SID = 'XXXXXXXXXXXXXXXXXX'
TWILIO_AUTH_TOKEN = 'XXXXXXXXXXXXXXXXXX'
TWILIO_PHONE_NO = 'XXXXXXXXXXXXXXXXXX'

# Firebase
FIREBASE_TYPE = 'XXXXXXXXXXXXXXXXXX'
FIREBASE_PROJECT_ID = 'XXXXXXXXXXXXXXXXXX'
FIREBASE_PRIVATE_KEY_ID = 'XXXXXXXXXXXXXXXXXX'
FIREBASE_PRIVATE_KEY = 'XXXXXXXXXXXXXXXXXX'
FIREBASE_CLIENT_EMAIL = 'XXXXXXXXXXXXXXXXXX'
FIREBASE_CLIENT_ID = 'XXXXXXXXXXXXXXXXXX'
FIREBASE_AUTH_URI = 'XXXXXXXXXXXXXXXXXX'
FIREBASE_TOKEN_URI = 'XXXXXXXXXXXXXXXXXX'
FIREBASE_AUTH_PROVIDER_X509_CERT_URL = 'XXXXXXXXXXXXXXXXXX'
FIREBASE_CLIENT_X509_CERT_URL = 'XXXXXXXXXXXXXXXXXX'
```

* Run the server

```bash
npm run dev
```

## License

This project is licensed under the GPL-3.0 License - see the
[LICENSE.md](LICENSE.md) file for details.

## Activities

![Alt](https://repobeats.axiom.co/api/embed/c3dfb333461ededdd3671da9162a49bea38a9126.svg "Repobeats analytics image")

## Connect With Me

[![Instagram: nixrajput](https://img.shields.io/badge/nixrajput-141430?logo=Instagram&logoColor=fff)][instagram]
[![Linkedin: nixrajput](https://img.shields.io/badge/nixrajput-141430?logo=Linkedin&logoColor=fff)][linkedin]
[![GitHub: nixrajput](https://img.shields.io/badge/nixrajput-141430?logo=Github&logoColor=fff)][github]
[![Twitter: nixrajput07](https://img.shields.io/badge/nixrajput07-141430?logo=Twitter&logoColor=fff)][twitter]
[![Facebook: nixrajput07](https://img.shields.io/badge/nixrajput07-141430?logo=Facebook&logoColor=fff)][facebook]

[github]: https://github.com/nixrajput
[website]: https://nixlab.co.in
[facebook]: https://facebook.com/nixrajput07
[twitter]: https://twitter.com/nixrajput07
[instagram]: https://instagram.com/nixrajput
[linkedin]: https://linkedin.com/in/nixrajput
[portfolio]: https://nixrajput.nixlab.co.in
[repo]: https://github.com/nixrajput/social-media-api-nodejs
[issues]: https://github.com/nixrajput/social-media-api-nodejs/issues
[pulls]: https://github.com/nixrajput/social-media-api-nodejs/pulls
[license]: https://github.com/nixrajput/social-media-api-nodejs/blob/master/LICENSE.md
