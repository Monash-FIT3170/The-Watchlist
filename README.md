# The Watchlist
## Project 9 - FIT3170 - 2024

The Watchlist is a web application designed to allow users to create, manage, and interact with lists of movies and TV shows. The project is built using Meteor, React, and MongoDB, with data sourced from The Movie Database (TMDb).

## Table of Contents
- [The Watchlist](#the-watchlist)
  - [Project 9 - FIT3170 - 2024](#project-9---fit3170---2024)
  - [Table of Contents](#table-of-contents)
  - [Summary for New Developers](#summary-for-new-developers)
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
      - [3. Configuring the CI/CD Pipeline](#3-configuring-the-cicd-pipeline)
  - [Common Issues and Notes](#common-issues-and-notes)
    - [Node.js Version Compatibility](#nodejs-version-compatibility)
    - [`development_secrets.json`](#development_secretsjson)
    - [MongoDB Connection](#mongodb-connection)
    - [API Rate Limits](#api-rate-limits)
  - [Versioning Strategy](#versioning-strategy)
    - [Semantic Versioning Format](#semantic-versioning-format)
    - [Transition to Semantic Versioning](#transition-to-semantic-versioning)
    - [Release Tagging and Change Tracking](#release-tagging-and-change-tracking)
  - [Pull Request Strategy](#pull-request-strategy)
    - [Contributing Guidelines](#contributing-guidelines)
    - [Submitting a Pull Request](#submitting-a-pull-request)
    - [Code Review Process](#code-review-process)
    - [Branching Strategy](#branching-strategy)
  - [File Structure](#file-structure)
  - [Team Member Information](#team-member-information)
    - [Agile Team 1](#agile-team-1)
    - [Agile Team 2](#agile-team-2)
    - [Agile Team 3](#agile-team-3)

## Summary for New Developers

Welcome to The Watchlist project! This application allows users to explore, create, and manage personalised lists of movies and TV shows. As a new developer, you'll be working with a tech stack that includes Meteor, React, and MongoDB. Our codebase follows standard Agile software engineering practices and is structured to facilitate collaboration and continuous integration.

This documentation will guide you through setting up the project on your local machine, understanding our versioning and branching strategies, and contributing code through pull requests. We encourage you to read through this document carefully and reach out to any of the team members listed below if you have questions.

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
    },
  },
  "TMDB_API_KEY": "your-tdmb-api-key"
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

- **Meteor application host**: Heroku
- **Heroku plan**: Eco tier
- **MongoDB database host**: MongoDB Atlas on shared cluster
- **SSL certificate**: Managed via Heroku (internally uses Let's Encrypt)
- **CI/CD**: GitHub Actions using the [Deploy to Heroku](https://github.com/marketplace/actions/deploy-to-heroku) action
- **Heroku Deploy**: Uses the [meteor-buildpack-horse](https://elements.heroku.com/buildpacks/admithub/meteor-buildpack-horse) buildpack

Please note that the entire project can be run with zero cost for ~6 months using an account registered with the GitHub Student Developer Pack. During all the following steps, when registering for an account, connect the account to GitHub if using an SDP account, which will provide free credits to use.

You will also need to obtain a domain name (if you want to deploy to a custom domain). GoDaddy was the domain provider used to deploy [thewatchlist.xyz](https://www.thewatchlist.xyz).

### Deploying from Scratch
A complete deployment, using the above ecosystem, involves three steps:

1. Setting up MongoDB Atlas
2. Creating an application in Heroku
3. Configuring the CI/CD Pipeline

#### 1. Setting up MongoDB Atlas

1. Register for an account at [MongoDB Atlas](https://cloud.mongodb.com/).
2. Create a new Atlas database instance.
   - Click on the "Create" button.
   - Click on "Go to Advanced Configuration" at the bottom.
   - Change the server type to **Shared**.
   - Set the region to **us-east-1** (so that it sits close to the location of the Heroku server).
   - Set the cluster tier to **M2** (2GB - which can hold the entire dataset).
   - Rename the cluster to your name of choice.
3. When prompted, enter a username and password to connect to the server.
4. When prompted, allow connections to the database from any IP (note: Heroku does not provide static IPs on their free tier, so we cannot whitelist a particular IP).

#### 2. Creating an Application in Heroku

1. Register for an account at [Heroku](https://dashboard.heroku.com/).
2. Go to **Profile** -> **Settings** -> **Billing**. Enable "Eco Dynos Plan". Copy the API key in the section below for future reference.
3. Create a new app. The name should be `watchlist-monash`. The region should be **US**.
4. Download the Heroku CLI from [Heroku CLI Installation](https://devcenter.heroku.com/articles/heroku-cli#install-the-heroku-cli).
5. In the cloned repository, run the following command in Terminal:

   ```bash
   heroku git:remote -a watchlist-monash
   ```

   This will set up the Heroku remote in your Git repository.

6. Navigate to your app in the Heroku dashboard. Click on **Settings**.
7. In the **Config Vars** section, click on **Reveal Config Vars**. Set the following:

   - `METEOR_SETTINGS`: Copy-paste the complete contents of `development_secrets.json` (replacing all the values with production credentials).
   - `MONGO_URL`: Copy-paste the MongoDB connection URL, including username and password.
   - `ROOT_URL`: Set to the domain name you purchased (or set to the Heroku URL provided in the app dashboard).

8. In the **Domains** section, add the custom domain (if relevant).
9. Activate automatic SSL management.

#### 3. Configuring the CI/CD Pipeline

1. In the GitHub repository, go to **Settings** -> **Secrets and variables** -> **Actions**.
2. Add a new repository secret called `HEROKU_API_KEY`. Set the value to your Heroku API key obtained earlier.
3. Edit the file in `.github/workflows/auto-deploy.yml`, changing the `heroku_email` value to the email you registered with Heroku.
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

## Versioning Strategy

With the project reaching its final stages, we are introducing [Semantic Versioning 2.0.0](https://semver.org/) as the official versioning strategy for all future releases. This versioning convention will help developers and contributors understand the nature of changes between releases and ensure a smooth evolution of the project.

### Semantic Versioning Format

Version numbers will follow the format:  
`MAJOR.MINOR.PATCH`

- **MAJOR**: Incremented for incompatible TMDB API changes or major functionality overhauls.
- **MINOR**: Incremented when adding new features or functionality in a backward-compatible manner.
- **PATCH**: Incremented for backward-compatible bug fixes or performance improvements.

### Transition to Semantic Versioning

While earlier stages of the project did not strictly adhere to Semantic Versioning, we encourage all future contributors to adopt this strategy to maintain consistency and clarity in the release process.

### Release Tagging and Change Tracking

Starting with the current version, all future releases will be **tagged** in the Git repository to help track changes effectively. Contributors can find details of each release in the [Releases](https://github.com/Monash-FIT3170/The-Watchlist/releases) section of the repository.

We recommend including a **changelog** for each release, listing notable changes, new features, and any potential breaking changes. This will enhance transparency and help developers understand what has changed between versions.

By adopting Semantic Versioning now, we aim to ensure that the project remains easy to maintain, extend, and collaborate on as it grows.

## Pull Request Strategy

We encourage contributions from the community and strive to make the process as smooth as possible. To maintain code quality and project integrity, please follow the guidelines below when submitting a pull request.

### Contributing Guidelines

- **Fork the Repository**: Start by forking the main repository to your GitHub account.

  ```bash
  git clone https://github.com/your-username/The-Watchlist.git
  cd The-Watchlist
  ```

- **Create a Feature Branch**: Use a descriptive name for your branch.

  ```bash
  git checkout -b feat/your-feature-name
  ```

- **Commit Changes**: Make sure to write clear and concise commit messages.

  ```bash
  git commit -m "Add feature X that does Y"
  ```

- **Push to Your Fork**:

  ```bash
  git push origin feat/your-feature-name
  ```

### Submitting a Pull Request

1. **Create a Pull Request**: Go to the original repository and click on **New Pull Request**.
2. **Select Your Branch**: Ensure you're comparing the correct branches (`your-username:feat/your-feature-name` against `Monash-FIT3170:main`).
3. **Describe Your Changes**: Provide a clear and detailed description of what your pull request does.
4. **Link Issues**: If your pull request addresses any open issues, link them in the description.
5. **Submit for Review**: Once all details are filled out, submit the pull request for review.

### Code Review Process

- A project maintainer will review your pull request.
- Be prepared to make revisions based on feedback.
- Once approved, your changes will be merged into the main branch.

### Branching Strategy

We urge you to use the **Gitflow** workflow:

- **main**: Production-ready code.
- **develop**: Active development branch.
- **feat/xxx**: Feature-specific branches off `develop`.
- **release/xxx**: Preparation for a new release.
- **fix/issue-<number>xxx**: Patches to the issue with relevant issue number. 

Please ensure your feature branches are up-to-date with the `develop` branch before submitting a pull request.

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

- **Max Ramm**
  - Product Owner/Manager
- **Reya**
  - Product Owner/Manager
- **Peter Roberts** (prob0006@student.monash.edu)
  - System Architect
- **Miles Rudelic** (mrud0004@student.monash.edu)
  - Release Train Engineer
- **Aydin Ficker Karci**
  - Release Train Engineer

### Agile Team 2

- **Lachlan Durra** (ldur0003@student.monash.edu)
  - Release Train Engineer
- **Ari Feldman** (afel0004@student.monash.edu)
  - System Architect
- **Selsa Sony** (sson0024@student.monash.edu)
  - Product Owner/Manager
- **Maddy**
  - Product Owner/Manager
- **Ishita Gupta**
  - Release Train Engineer

### Agile Team 3

- **Stefan Su**
  - Product Owner/Manager
- **Sineth Fernando**
  - Product Owner/Manager
- **Geomher Vergara** (gver0007@student.monash.edu)
  - System Architect
- **Wee Jun Lin (Lucas)**
  - System Architect
- **Brian Nge Jing Hong**
  - Release Train Engineer
- **Chris How**
  - Release Train Engineer
