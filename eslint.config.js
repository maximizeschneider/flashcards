import next from "eslint-config-next";
import globals from "globals";

export default [
  ...next,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      "@next/next/no-html-link-for-pages": "off",
    },
  },
];
