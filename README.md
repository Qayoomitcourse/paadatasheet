# PAA Airports Data Sheet (Vercel + Sanity)

Mobile form -> PDF (same blue table as the Word form) -> share on WhatsApp.
Saved reports are stored online in Sanity. Vercel hosts the page and a small private API.

Files
- public/index.html  the form and PDF maker
- api/reports.js     private API (keeps the Sanity token secret, checks the access code)
- package.json, vercel.json

## Step 1 - Sanity (database)
1. Go to https://www.sanity.io and sign in. Create a new project (free plan is enough).
2. Note the Project ID (on the project page) and use dataset "production".
3. Project > API > Tokens > Add API token. Name: paa-data-sheet, permission: Editor.
   Copy the token now (it is shown once).
You do not need to set up a Studio or a schema.

## Step 2 - GitHub (code)
1. Create a free account at https://github.com and a new private repository.
2. Upload all files from this folder (keep the api and public folders as they are).
   "Add file > Upload files" in the browser works.

## Step 3 - Vercel (website)
1. Go to https://vercel.com, sign in with GitHub, click Add New > Project, pick the repository.
2. Before deploying, open Environment Variables and add:
   - SANITY_PROJECT_ID   = your Sanity project ID
   - SANITY_DATASET      = production
   - SANITY_WRITE_TOKEN  = the Editor token from step 1
   - APP_ACCESS_CODE     = a code of your choice (share it only with your SVOs)
3. Click Deploy. Your link will look like https://your-project.vercel.app

## Step 4 - Use it
1. Open the link on the phone. The first time, enter the APP_ACCESS_CODE.
2. Fill the form, tap Flag on anything significant (prints red), tap "Generate PDF & share"
   and choose WhatsApp.
3. Tip: in the phone browser menu choose "Add to Home Screen" to open it like an app.

## Notes
- If you change an environment variable, redeploy in Vercel for it to apply.
- Never put the Sanity token inside index.html. It stays only in Vercel.
- To see or export saved data, open the project in Sanity (Vision tool or a Studio).
