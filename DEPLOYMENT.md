# Deployment Guide (cPanel)

This guide explains how to deploy the **Atilla Öröksége** web application to a cPanel hosting environment.

## Prerequisites

- Access to cPanel
- Node.js installed locally (to build the project)

## 1. Create Deployment Package

We have included a script to automatically build and package the application for deployment.

1. Open your terminal in the project root.
2. Run the following command:

   ```bash
   npm run package
   ```

   This will:
   - Run `npm run build` to compile the application.
   - Create a `deploy.zip` file in the project root containing all necessary files (including `.htaccess`).

## 2. Upload to cPanel

1. Log in to your **cPanel**.
2. Open **File Manager**.
3. Navigate to your `public_html` directory (or the subdomain directory where you want to host the app).
4. Click **Upload** and select the `deploy.zip` file you just created.
5. Once uploaded, right-click `deploy.zip` and select **Extract**.
6. Extract the files directly into the current directory.

## 3. Verify Configuration

The package includes a `.htaccess` file which is crucial for:
- **Routing**: Ensures that refreshing the page on a sub-route (e.g., `/game`) works correctly by redirecting to `index.html`.
- **Caching**: Sets appropriate cache headers for performance.
- **Security**: Adds basic security headers.

**Note:** If you don't see `.htaccess` in File Manager, make sure you have "Show Hidden Files" enabled in cPanel Settings.

## Troubleshooting

- **404 Errors on Refresh**: If you get a 404 error when refreshing a page, ensure the `.htaccess` file was correctly extracted and is present in the root of your site.
- **White Screen**: Check the browser console (F12) for errors. Ensure all files were uploaded correctly.
