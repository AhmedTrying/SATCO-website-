/*
 * @satco/shared — one source of truth for content shapes.
 *
 * Consumed as TypeScript source (no build step): satco-web and satco-admin list
 * it in `transpilePackages`. Zod schemas are a separate entry (`@satco/shared/schemas`)
 * so the type-only site build never pulls zod into its bundle.
 */

export * from "./types";
export * from "./content";
export * from "./cms";
