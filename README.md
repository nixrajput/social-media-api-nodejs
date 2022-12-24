# Social Media API - By NixLab

An open source social media API built with Node.js, Express, and MongoDB. This API is built for developers to use in their projects. It is not meant to be used as a standalone social media platform. This API is still in development and is not ready for production use.

* If you would like to contribute to this project, please see the [contributing guidelines](CONTRIBUTING.md).

* We are open to suggestions and contributions. Feel free to open an [issue](https://github.com/nixrajput/social-media-api-nodejs/issues) or a [pull request](https://github.com/nixrajput/social-media-api-nodejs/pulls). If you like the project, please consider giving it a star.

* Due to server limitations, the API is currently hosted on a free tier of Cyclic. So, it may take a few seconds to respond to your request. Please be patient.

* Due to the same reason, the API may be down for a few minutes every day. We are working on a solution to this problem.

* Due to database limitations, the API is currently hosted on a free tier of MongoDB Atlas. So, it may take a few seconds to respond to your request. Please be patient.

* This API is currently in development. So, after releasing the production version, we will be adding more features to it. You can check the progress of the project here. If you have any suggestions, feel free to open an issue.

* For the production version, we are planning to host the API on a paid tier of Cyclic and MongoDB Atlas. So, it will be more reliable and faster.

* After releasing the production version, we may delete some of the data in the database for better and faster performance. Data will be deleted only if it is not required for the project or it may cause any issues or conflicts.

If you would like to contribute, please read the [contribution guidelines](CONTRIBUTING.md).

>Note: Due to significant updates and changes in database and API structure, the API is no longer compatible with the previous version. Please refer to the documentation for more details.
> It is possible that your old version of the API may not work with the new version. In that case, you can refer to the documentation for the new version.

## Documentation

[`Documentation`](https://app.swaggerhub.com/apis-docs/nixrajput-apis/social-media-api/1.0.0)
----------------

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
* [ ] Post Sharing
* [ ] Post Searching
* [ ] Post Filtering
* [ ] Post Sorting
* [ ] Post Reporting
* [ ] Post Blocking
* [ ] Post Muting
* [x] Profile Creation
* [x] Profile Editing
* [ ] Profile Deactivation
* [x] User Following
* [x] User Unfollowing
* [ ] User Blocking
* [ ] User Muting
* [ ] User Searching
* [ ] User Filtering
* [ ] Trending Posts
* [ ] Hash Tagging
* [ ] Post Tagging
* [ ] User Tagging
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
[portfolio]: https://nixrajput.nixlab.co.in
