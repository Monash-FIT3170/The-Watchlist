# The Watchlist
## Project 9 - FIT3170 - 2024

The Watchlist is a web application designed to allow users to create, manage, and interact with lists of movies and TV shows. The project is built using Meteor, React, and MongoDB, with data sourced from The Movie Database (TMDb).

## Table of Contents
- [The Watchlist](#the-watchlist)
  - [Project 9 - FIT3170 - 2024](#project-9---fit3170---2024)
  - [Table of Contents](#table-of-contents)
  - [Software and Hardware Requirements](#software-and-hardware-requirements)
    - [Operating System](#operating-system)
    - [Dependencies](#dependencies)
    - [Database](#database)
  - [Getting the Project Up and Running](#getting-the-project-up-and-running)
    - [1. Clone the Repository](#1-clone-the-repository)
    - [2. Install Project Dependencies](#2-install-project-dependencies)
    - [3. Environment Configuration](#3-environment-configuration)
    - [4. Running the Project Locally](#4-running-the-project-locally)
      - [Option 1: Run with the `development_secrets.json` file](#option-1-run-with-the-development_secretsjson-file)
      - [Option 2: Run without the `development_secrets.json` file](#option-2-run-without-the-development_secretsjson-file)
  - [Deployment](#deployment)
    - [Deploying from Scratch](#deploying-from-scratch)
      - [1. Setting up MongoDB Atlas](#1-setting-up-mongodb-atlas)
      - [2. Creating an Application in Heroku](#2-creating-an-application-in-heroku)
      - [3. Configuring the CI/CD pipeline](#3-configuring-the-cicd-pipeline)
  - [Common Issues and Notes](#common-issues-and-notes)
    - [Node.js Version Compatibility](#nodejs-version-compatibility)
    - [`development_secrets.json`](#development_secretsjson)
    - [MongoDB Connection](#mongodb-connection)
    - [API Rate Limits](#api-rate-limits)
  - [File Structure](#file-structure)
  - [Team Member Information](#team-member-information)
    - [Agile Team 1](#agile-team-1)
    - [Agile Team 2](#agile-team-2)
    - [Agile Team 3](#agile-team-3)

## Software and Hardware Requirements

### Operating System
- **Windows** or **Intel-based Mac**: Node.js version 14.17.3
- **Mac with M1 chip**: Node.js version 14.15.0

### Dependencies
- **Node.js**: Version 14.x as specified above.
- **Meteor**: Ensure that Meteor is installed globally.
  ```bash
  npm install -g meteor
  ```

### Database
- **MongoDB**: The project uses MongoDB as the database. Ensure that MongoDB is properly set up and running on your machine or through a cloud service like MongoDB Atlas.

## Getting the Project Up and Running

### 1. Clone the Repository
Clone the project repository to your local machine.
```bash
git clone https://github.com/Monash-FIT3170/The-Watchlist.git
cd The-Watchlist
```

### 2. Install Project Dependencies
Install all the necessary Node.js dependencies.
```bash
npm install
```

### 3. Environment Configuration
You need to set up a `development_secrets.json` file for running the project locally. This file contains sensitive information like API keys and should **not** be committed to version control.

Create a `development_secrets.json` file in the root directory with the following structure:
```json
{
  "private": {
    "github": {
      "clientId": "your-github-client-id",
      "clientSecret": "your-github-client-secret"
    },
    "google": {
      "clientId": "your-google-client-id",
      "clientSecret": "your-google-client-secret"
    }
  }
}
```
Ensure that the values are replaced with your actual API keys.

Alternatively, you can use the provided sample file as a starting point:

```bash
cp development_secrets.sample.json development_secrets.json
```

Then, open `development_secrets.json` and replace the placeholder values with your own API keys.

### 4. Running the Project Locally
To run the project locally, you have two options:

#### Option 1: Run with the `development_secrets.json` file
If you have created and filled in the `development_secrets.json` file, run the project using:

```bash
npm start
```

This will automatically use the `development_secrets.json` file.

#### Option 2: Run without the `development_secrets.json` file
If you do not need to use the `development_secrets.json` file (e.g., for development purposes without requiring external APIs), you can run the project using:

```bash
npm run start-nosecrets
```

This option allows you to start the project without loading any secrets.

These instructions provide flexibility for running the project both with and without the `development_secrets.json` file. For typical development, the first option (`npm start`) is recommended, as it ensures all necessary configurations are applied.

The application will be accessible at [http://localhost:3000](http://localhost:3000).

## Deployment

The Watchlist is deployed at [thewatchlist.xyz](https://www.thewatchlist.xyz). The application can be deployed on any platform, so long as it can connect to an external database.

Currently, The Watchlist is deployed using the following ecosystem:
* Meteor application host: Heroku
* Heroku plan: eco tier
* MongoDB database host: MongoDB Atlas on shared cluster
* SSL certificate: Managed via Heroku (internally uses Let's Encrypt)
* CI/CD: GitHub Actions using the [Deploy to Heroku](https://github.com/marketplace/actions/deploy-to-heroku) action
* Heroku Deploy: Uses the [meter-buildpack-horse](https://elements.heroku.com/buildpacks/admithub/meteor-buildpack-horse) buildpack

Please note that the entire project can be run with zero cost for ~6 months using an account registered with the GitHub Student Developer Pack. During all the following steps, when registering from an account, connect the account to GitHub if using a SDP account, which will provide free credits to use.

You will also need to obtain a domain name (if you want to deploy to a custom domain). GoDaddy was the domain provider used to deploy [thewatchlist.xyz](https://www.thewatchlist.xyz).

### Deploying from Scratch
A complete deployment, using the above ecosystem, involves three steps:

1. Setting up MongoDB Atlas
2. Creating an application in Heroku
3. Configuring the CI/CD pipeline


#### 1. Setting up MongoDB Atlas
1. Register for an account at https://cloud.mongodb.com/
2. Create a new Atlas database instance.
    - Click on the "Create" button.
    - Click on "Go to Advanced Configuration" at the bottom.
    - Change the server type to Shared
    - Set the region to us-east-1 (so that it sits close to the location of the Heroku server)
    - Set the cluster tier to M2 (2GB - which can hold the entire dataset)
    - Rename the cluster to your name of choice
3. When prompted, enter a username and password to connect to the server.
4. When prompted, allow connections to the database from any IP (note: Heroku does not provide static IPs on their free tier, so we cannot whitelist a particular IP)

#### 2. Creating an Application in Heroku
1. Register for an account at https://dashboard.heroku.com/
2. Go to Profile -> Settings -> Billing. Enable "Eco Dynos Plan". Copy the API key in the section below for future reference.
3. Create a new app. The name should be `watchlist-monash`. The region should be US.
4. Download the Heroku CLI from https://devcenter.heroku.com/articles/heroku-cli#install-the-heroku-cli
5. In the cloned repository, run the following command in Terminal: `heroku git:remote watchlist-monash`. This will allow GitHub to deploy to your Heroku app.
6. Navigate to your app in the Heroku dashboard. Click on "Settings".
7. In the "Config Vars" section, click on "Reveal Config Vars". Set the following:
    - `METEOR_SETTINGS`: copy-paste the complete contents of `development_secrets.json` (replacing all the values with production credentials)
    - `MONGO_URL`: copy-paste the MongoDB connection URL, including username and password
    - `ROOT_URL`: set to the domain name you purchased (or set to the Heroku URL provided in the app dashboard)
8. In the "Domains" section, add the custom domain (if relevant).
9. Activate automatic SSL management.

#### 3. Configuring the CI/CD pipeline
1. In the GitHub repository, go to Settings -> Secrets and variables -> Actions.
2. Add a new repository secret called `HEROKU_API_KEY`. Set the value to your Heroku API key obtained earlier.
3. Edit the file in `.github/workflows/auto-deploy.yml`, changing the `heroku_email` value to the email you registered Heroku using.
4. Upon saving, the application should auto-deploy to Heroku.


Finally, to ensure Google OAuth works correctly, update the URL in `server/main.js`:

```javascript
if (Meteor.isProduction){
    Meteor.absoluteUrl.defaultOptions.rootUrl = "https://www.thewatchlist.xyz/"; // update this URL
} else if (Meteor.isDevelopment){
    Meteor.absoluteUrl.defaultOptions.rootUrl = "http://localhost:3000/";
}
```

## Common Issues and Notes

### Node.js Version Compatibility
Make sure you are using the correct version of Node.js based on your operating system:
- **Windows or Intel-based Mac**: Node.js version 14.17.3
- **Mac with M1 chip**: Node.js version 14.15.0

### `development_secrets.json`
This file contains sensitive information and should **not** be committed to the repository. Ensure that it is added to your `.gitignore` file.

### MongoDB Connection
Ensure that MongoDB is running and accessible when running the application locally. You can use a local MongoDB instance or a cloud-based MongoDB service like MongoDB Atlas.

### API Rate Limits
The project relies on The Movie Database (TMDb) for movie and TV show data. Ensure that your API usage stays within TMDb's rate limits to avoid disruptions.

## File Structure

The project's file structure is organized as follows:

```plaintext
.github/            # CI/CD workflows and GitHub-specific configurations
.meteor/            # Meteor configuration files
client/             # Client-side code, including React components and main entry files
data-ingestion/     # Scripts for ingesting and processing data
imports/            # Shared code between client and server, including API methods, database models, and UI components
public/             # Public assets like images and JSON files accessible to the client
server/             # Server-side code, including main server entry point and Meteor methods
tests/              # Test cases and configurations
.gitignore          # Specifies files and directories to be ignored by Git
README.md           # Project documentation
package.json        # Node.js dependencies and project metadata
```

## Team Member Information

### Agile Team 1
- Max Ramm
  - Product Owner/Manager
- Reya
  - Product Owner/Manager
- Peter Roberts (prob0006@student.monash.edu)
  - System Architect
- Miles Rudelic (mrud0004@student.monash.edu)
  - Release Train Engineer
- Aydin Ficker Karci
  - Release Train Engineer 

### Agile Team 2
- Lachlan Durra (ldur0003@student.monash.edu)
  - Release Train Engineer
- Ari Feldman (afel0004@student.monash.edu)
  - System Architect
- Selsa Sony (sson0024@student.monash.edu)
  - Product Owner/Manager
- Maddy
  - Product Owner/Manager   
- Ishita Gupta
  - Release Train Engineer

### Agile Team 3
- Stefan Su
  - Product Owner/Manager
- Sineth Fernando
  - Product Owner/Manager
- Geomher Vergara (gver0007@student.monash.edu)
  - System Architect 
- Wee Jun Lin (Lucas)
  - System Architect
- Brian Nge Jing Hong
  - Release Train Engineer
- Chris How
  - Release Train Engineer
