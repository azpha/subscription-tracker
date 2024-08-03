# subscription-tracker
Easily manage your subscriptions

## About
This is a simple subscription tracker that allows you to manage your subscriptions & get notified when your subscriptions are expiring.

## Setup
First, clone the repository
```
git clone https://github.com/azpha/subscription-tracker
```

Then, setup each component;
### API
```
cd api
npm i
[edit .env to your liking]
npm run start
```

### Web

```
cd web
npm i
[edit .env if you've changed the port on the API]
npm run build
```
and serve "/web/dist" using your web server