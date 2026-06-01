Netlify Deployment — Quick Steps

1) Prepare your repo
- Commit the project to a Git provider (GitHub/GitLab/Bitbucket).

2) Deploy via Netlify (recommended)
- Sign in to https://app.netlify.com/
- Click "New site" → "Import from Git"
- Connect your Git provider and select the repository
- On the "Build settings" page set:
  - Branch to deploy: `main` (or your default branch)
  - Build command: *leave empty* (this is a static site)
  - Publish directory: `.`
- Deploy site. Netlify will provide a public URL.

3) Alternatively: Drag & Drop
- Zip your project or open the project folder
- In Netlify dashboard, click "Add new site" → "Deploy manually"
- Drag the site folder (or zip) into the upload area

4) Environment variables
- If you use any secret keys (Firebase config, EmailJS user id), add them under Site settings → Build & deploy → Environment.
- In client-side code, prefer storing only public keys; protect sensitive server-side secrets.

5) Verify
- Visit the provided Netlify URL
- Perform a test purchase and ensure orders show in the admin page
- Test the QR verification flow: scan QR → `ticket-verify.html?ticket=...`

Notes
- If your project uses server-side verification (recommended for payment verification), deploy server code separately (Netlify Functions or another backend) and configure endpoints.
