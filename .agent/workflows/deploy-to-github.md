---
description: How to push local changes to the GitHub repository
---

This workflow describes how to synchronize your local project with the GitHub repository using the established HTTPS method.

### Prerequisites
- You must have the project's GitHub URL: `https://github.com/greenbydefault/BookFast.git`
- Ensure your changes are saved locally.

### Steps

1. **Check current status**
   Verify which files are changed or untracked:
   ```bash
   git status
   ```

2. **Stage your changes**
   Add all changes (respecting `.gitignore`):
   ```bash
   git add .
   ```

3. **Commit your changes**
   Write a descriptive commit message:
   ```bash
   git commit -m "Your descriptive message here"
   ```

4. **Verify remote configuration**
   Ensure the remote is set to HTTPS (one-time check):
   ```bash
   git remote -v
   ```
   *If it is wrong or missing, run:*
   ```bash
   git remote set-url origin https://github.com/greenbydefault/BookFast.git
   ```

5. **Push to GitHub**
   Push the changes to the `main` branch:
   ```bash
   git push origin main
   ```

> [!TIP]
> Since we are using HTTPS, macOS will typically handle your credentials via the **Keychain Access**. If you are prompted for a password on the command line, use your **GitHub Personal Access Token (PAT)**, not your regular password.
