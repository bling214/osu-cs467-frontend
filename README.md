# osu-cs467-frontend

Project Experience Explorer Frontend - OSU CS467 Capstone

# Prerequisites

- Visual Studio
- Node.js version 22+ (more information below)

Below is the URL of instructions on how to update your Node to a later version if using Homebrew does not work.
https://www.geeksforgeeks.org/node-js/update-node-js-and-npm-to-latest-version/

# How to run the React App

1. Download/Clone Repo
```bash
git clone https://github.com/bling214/osu-cs467-backend.git
```

2. Change Directory
After downloading or cloning the frontend repository, perform the following command:
```bash
cd osu-cs467-frontend
```
or
```bash
cd [folder-name]
```

3. Install Packages
Then following commands must be entered into the terminal to install packages needed for the React App to run:
```bash
npm install
```

4. Setup .env file
Copy the .env template using the following command.
```bash
cp ".env template" .env
```
Then edit the following parameters in the .env file:
- VITE_SUPABASE_URL - Supabase URL
- VITE_SUPABASE_ANON_KEY - Supabase key
- VITE_API_BASE_URL - 'http://127.0.0.1:8000' or 'http://localhost:8000'

5. Run React App
To run the React app, enter the following command:
```bash
npm run dev
```

The React App will be running on at \\localhost:5173
