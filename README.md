# stocks-valuation

## Project setup

First install all the packages and dependecies

```
yarn install
```

Then start the express server

```
yarn express
```

Once the server is up and running, start the site

```
yarn serve
```

### Remote DB and API key setup

You would need to create a `.env.development.local` file with the following configs.
You will need to create your own DB and API key.
This app is using a remote mongo DB server to store the watchlist data and
a Yahoo Finance API key to fetch stocks data.

```
EXPRESS_MONGO_USER=root
EXPRESS_MONGO_PASSWORD=dbPassword
EXPRESS_MONGO_ENDPOINT=api.mongodb.net/dbname
EXPRESS_RAPIDAPI_KEY=this_is_the_api_key
```
