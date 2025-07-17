import js from "@eslint/js";
import next from "eslint-config-next";
import tseslint from "@typescript-eslint/eslint-plugin";
import reactPlugin from "eslint-plugin-react";

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  {
    ignores: [
      "node_modules",
      ".next",
      "out",
      "lib/generated/**",
      "*.d.ts",
      "prisma/migrations/**",
      "public/**",
    ],
  },
  js.configs.recommended,
  ...next(),
  {
    plugins: {
      "@typescript-eslint": tseslint,
      "react": reactPlugin,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "error",
      "react/react-in-jsx-scope": "off",
      "no-console": "warn",
      "no-unused-vars": "warn",
    },
  },
]; 