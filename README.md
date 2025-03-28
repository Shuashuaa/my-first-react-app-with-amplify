[![ci-test](https://github.com/shuashuaa/my-first-react-app/actions/workflows/test.yml/badge.svg)](https://github.com/shuashuaa/my-first-react-app/actions/workflows/test.yml.yml)
[![Netlify Status](https://api.netlify.com/api/v1/badges/8cf7b954-67c1-4533-b3b5-fa74f47286a4/deploy-status)](https://app.netlify.com/sites/my-first-react-app/deploys)

# React + TypeScript + Vite + Amplify

### Application Flowchart

<img width="49%" src="./public/flowchart/amplify-react-app.png" />
<img width="49%" src="./public/flowchart/amplify-s3-react-app.png" />

<hr>
<br>

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

<br>

# Installation Process for React19, Vite and TailwindCSS.
> via https://ui.shadcn.com/docs/installation/vite
```
npm create vite@latest
```
but instead of using what shadcn/ui provides for tailwindcss we must use the ff: instead. (for now)
> Tailwindcss4 is not yet optimized overall
```
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```
then follow althrought.

# Development Lambda API Implementation

### .env
> local dev
```
VITE_API_KEY=
```
<br>

### `Netlify` environment variables 
> prod
```
VITE_API_KEY=
```
<br>

### `Github` Secrets
> API key created in `AWS Secrets Manager`
```
API_KEY
```

```
To ensure the API key is securely handled and accessible during both the `build process` and `runtime`.

npm create vite@latest
typescript
npm create amplify latest
enter

why hindi gumamit ng amplify/react-ui, limited.
getCurrentUser from aws-amplify to fetch the authenticated user's data
fetchUserAttributes from aws-amplify to fetch the user's attributes
authentication of users is from cognito - signIn, signUp and signOut,
insertion and getting of s3 files are configured with bucket policy,
authentication for the file saving on s3 is also handled by the auth,
@aws-amplify/ui-react-storage to display the images cloud-connect component.

point out:
everytime amplify is installed, and deployed from GitHub, it creates a congnito userpool, identitypool as well as s3 bucket.

deployment:
- must have a package-lock.json

to do-
safe the name of the file along with the inserted data and fetch it on the ui afterwards
```