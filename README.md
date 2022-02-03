# Slack bot
A playful slack bot created to "act" as a manager. Implemented using AWS SDK.

**Features**:
- Weekly standups (including creating funretro board, see: https://github.com/kevinatown/distributed)
- Welcomes new users to channel
- Responds with management and mismanagement quotes
- Able to add and remove users karma
- Magic eight ball with gifs!

## To start
- install dependencies in both root and src

## Run locally
- `ngrok http 3000`
- from root run `node src/bot.js`
- change Event Request URL in `https://api.slack.com/apps/<SLACK_ID>/event-subscriptions` to `${ngrok's http}/api/messages`

## Deploy
- ensure: `https://<STACK_ID>.execute-api.us-east-1.amazonaws.com/prod/api/messages` is set in Event Request URL in `https://api.slack.com/apps/<SLACK_ID>/event-subscriptions`
- npm run build:deploy
- 

## TODOS:
- typescript support for botkit code
- build ci/cd
- Make bot more abstract
- connect storage to users and teams
