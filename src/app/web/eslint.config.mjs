import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

// eslint-config-next 16 ships native flat configs, so the FlatCompat wrapper
// that bridged the old .eslintrc-style `extends` is no longer needed.
const eslintConfig = [
  // `next lint` applied these ignores implicitly. Now that lint runs through
  // the ESLint CLI directly, they have to be declared or build output gets linted.
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "coverage/**",
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },

  // `next lint` only ever scanned src/, so the CommonJS build config files at
  // the package root were never linted. `eslint .` does scan them, and
  // require()/module.exports is the correct style for them.
  {
    files: ["*.config.js", "*.config.mjs", "jest.setup.js"],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];

export default eslintConfig;
