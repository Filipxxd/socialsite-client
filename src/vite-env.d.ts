/// <reference types="vite/client" />
/// <reference types="vite/types/importMeta.d.ts" />

type ImportMetaEnv = {
  VITE_API_URL: string;
}

type ImportMeta = {
  readonly env: ImportMetaEnv;
}