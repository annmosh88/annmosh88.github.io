# Ann Muchiri — Portfolio

A production-grade Next.js portfolio with a real backend contact form powered by Resend.

---

## 🚀 Deploy to Vercel (Step by Step)

### Step 1 — Get your free Resend API key
1. Go to https://resend.com and create a free account
2. In the dashboard, click **API Keys** → **Create API Key**
3. Name it "portfolio" and copy the key (starts with `re_...`)

### Step 2 — Push this project to GitHub
```bash
cd portfolio
git init
git add .
git commit -m "Initial portfolio"
git remote add origin https://github.com/annmosh88/annmosh88.github.io.git
git push -u origin main
```

### Step 3 — Deploy on Vercel
1. Go to https://vercel.com and sign in with GitHub
2. Click **Add New Project** → Import `annmosh88.github.io`
3. Framework: **Next.js** (auto-detected)
4. Click **Environment Variables** and add:
   - Key: `RESEND_API_KEY`
   - Value: your key from Step 1
5. Click **Deploy** — done! 🎉

### Step 4 — Verify email delivery (important!)
By default, Resend's free tier only sends to the email you signed up with.
To send to **amuchiri040@gmail.com**:
- Either sign up to Resend with amuchiri040@gmail.com, OR
- Add a custom domain in Resend (free) to unlock sending to any address

---

## 🛠 Run locally
```bash
npm install
cp .env.example .env.local
# Add your RESEND_API_KEY to .env.local
npm run dev
# Visit http://localhost:3000
```

## 📁 Project Structure
```
portfolio/
├── pages/
│   ├── index.js          # Main portfolio page
│   ├── _app.js           # App wrapper
│   └── api/
│       └── contact.js    # Backend email API route
├── public/
│   └── ann.jpeg          # Your profile photo
├── styles/
│   └── globals.css       # All styles
├── .env.example          # Environment variable template
└── package.json
```
