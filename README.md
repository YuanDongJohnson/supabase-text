<a href="https://demo-nextjs-with-supabase.vercel.app/">
  <img alt="Next.js and Supabase Starter Kit - the fastest way to build apps with Next.js and Supabase" src="https://demo-nextjs-with-supabase.vercel.app/opengraph-image.png">
  <h1 align="center">Next.js and Supabase Starter Kit</h1>
</a>

<p align="center">
 The fastest way to build apps with Next.js and Supabase
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#demo"><strong>Demo</strong></a> ·
  <a href="#deploy-to-vercel"><strong>Deploy to Vercel</strong></a> ·
  <a href="#clone-and-run-locally"><strong>Clone and run locally</strong></a> ·
  <a href="#feedback-and-issues"><strong>Feedback and issues</strong></a>
</p>
<br/>

## Features

- Bootstraped with [Next.js with Supabase](https://github.com/vercel/next.js/tree/canary/examples/with-supabase)

  - App Router
  - Server Rendered
  - Middleware
  - Protected Routes

- supabase-ssr. A package to configure Supabase Auth to use cookies
- Styling with [Next UI](https://nextui.org/)

## Demo

You can view a fully working demo at [nextjs-app-supabase-template.vercel.app](https://nextjs-app-supabase-template.vercel.app/).

## Deploy to Vercel

Add required [`environment-variables`](#clone-and-run-locally) while deploying on Vercel:

[![Deploy with Vercel](https://camo.githubusercontent.com/b9ff564d8c311812747f1aacea54cf703d850756f9179f9eff6899da20a701a2/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f76657263656c2d2532333030303030302e7376673f7374796c653d666f722d7468652d6261646765266c6f676f3d76657263656c266c6f676f436f6c6f723d7768697465)](https://vercel.com/new/clone?s=https%3A%2F%2Fgithub.com%2FNavin-Jethwani-76%2Fnextjs-supabase-starter&showOptionalTeamCreation=false)

The above will also clone the Starter kit to your GitHub, you can clone that locally and develop locally.

If you wish to just develop locally and not deploy to Vercel, [follow the steps below](#clone-and-run-locally).

## Clone and run locally

1. You'll first need a Supabase project which can be made [via the Supabase dashboard](https://database.new)

2. Clone this repo

   ```bash
   git clone https://github.com/Navin-Jethwani-76/nextjs-supabase-starter.git
   ```

3. Use `cd` to change into the app's directory

   ```bash
   cd nextjs-supabase-starter
   npm install
   ```

4. Rename `.env.local.example` to `.env.local` and update the following:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   DATABASE_URL=[INSERT SUPABASE PROJECT DATABASE CONNECTION URL]
   SUPABASE_ADMIN_KEY=[INSERT SUPABASE PROJECT API SERVER_ROLE KEY]
   NEXT_PUBLIC_SUPABASE_BUCKET=[INSERT SUPABASE PROJECT STORAGE BUCKET NAME]
   ```

   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `DATABASE_URL` and `SUPABASE_ADMIN_KEY` can be found in [your Supabase project's API settings](https://app.supabase.com/project/_/settings/api)

5. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

   The starter kit should now be running on [localhost:3000](http://localhost:3000/).

> Check out [the docs for Local Development](https://supabase.com/docs/guides/getting-started/local-development) to also run Supabase locally.

## Feedback and issues

Please file feedback and issues [Here](https://github.com/Navin-Jethwani-76/nextjs-supabase-starter/issues/new).
