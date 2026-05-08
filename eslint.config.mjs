import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Downgraded from error: Prisma query builders and migrated service code
      // legitimately use `any` for dynamic where/orderBy/data shapes.
      "@typescript-eslint/no-explicit-any": "warn",
      // Allow unused vars prefixed with _ (common in catch blocks and params)
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    },
  },
]);

export default eslintConfig;
