# Strava-Notion Webhooks Integration

This is a personal project designed to connect Strava activities to Notion using webhooks. The idea is to automate the process of recording activities from Strava into Notion in a structured and meaningful way.

## Project Overview

The integration works as follows:
- Webhooks are used to listen to Strava activity events (such as creating, updating, or deleting an activity).
- When an event occurs, the data is formatted and added to a Notion database.

The project aims to simplify keeping track of Strava activities in a Notion workspace, offering an easy way to visualize and maintain a personal activity log.

## Current Status

**Note: This project is currently not functioning properly** due to issues with the `request` package, which is used internally by the `strava-v3` package.

The `request` package has been deprecated, and it's causing the following error:

```
Module not found: Can't resolve 'net'
```

This error arises because some dependencies, such as `net`, are native to Node.js and cannot be resolved properly in modern environments.

### Plans for Fixing the Issue

- Option 1: replace the `strava-v3` package or migrate to a different library that does not depend on deprecated packages.
- Option 2: create pull request to the `strava-v3` repo to replace `request` (there is even an issue already)[https://github.com/node-strava/node-strava-v3/issues/155]

## Features (When Working)

- **Listen to Strava Webhook Events**: Captures activity events from Strava (create, update, delete).
- **Integrate with Notion**: Formats and logs activity data into a Notion database automatically.
- **Reauthorization Handling**: Handles Strava reauthorization when tokens expire.

## Installation

To run the project locally, you need to have Node.js installed. You can then clone the repository and install the dependencies:

```bash
git clone https://github.com/kyle-ski/strava-notion-webhooks2.git
cd strava-notion-webhooks2
npm install
```

## Environment Variables

To run the project, you need to set up the following environment variables in a `.env` file:

- `NOTION_KEY` - Your Notion API key.
- `NOTION_DATABASE_ID` - The ID of the Notion database you want to use.
- `CLIENT_ID` - Your Strava app client ID.
- `CLIENT_SECRET` - Your Strava app client secret.
- `VERIFY_TOKEN` - Token for Strava webhook verification.
- `SUPABASE_URL` and `SUPABASE_KEY` - Supabase credentials for user token storage.

## Usage

Run the server using:

```bash
npm run dev
```

Currently, this won't fully function due to the dependency issue mentioned above, but it will still provide a good starting point for further development.

## To-Do List

- [ ] Replace or refactor the `strava-v3` package to remove deprecated dependencies.
- [ ] Improve error handling for better stability.
- [ ] Make the app more robust for future multi-user support.

## Contributions

This project is currently just for personal use, and contributions are not expected. However, if you come across this and want to contribute, feel free to fork it, improve it, and open a pull request!

## License

This project is licensed under the MIT License.

