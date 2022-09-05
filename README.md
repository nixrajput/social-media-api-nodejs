# Social Media API - By NixLab

*An open-source RESTful API developed using NodeJS, ExpressJS and MongoDB helps you to integrate User Authentication and Social Media Post Management in your application with ease.*

**Note: Due to significant updates and changes in database and API structure, the API is no longer compatible with the previous version. Please refer to the documentation for more details.**

**It is possible that your old version of the API may not work with the new version. In that case, you can refer to the documentation for the new version.**

We are open to suggestions and contributions. Feel free to open an issue or a pull request. If you like the project, please consider giving it a star.

If you would like to contribute, please read the [contribution guidelines](CONTRIBUTING.md).

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

## License

This project is licensed under the GPL-3.0 License - see the
[LICENSE.md](LICENSE.md) file for details

## Usage

* Clone the repository

```bash
git clone https://github.com/nixrajput/social-media-api-nodejs.git
```

* Install required modules
  
```bash
npm install
```

* Create a new directory `config` in `src` directory
* Create a new file `config.env` in `config` directory
* Add following VARIABLES in `config.env` or in production Environment Variables
  
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

* Run the server

```bash
npm run dev
```

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
