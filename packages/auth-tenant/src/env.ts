export function env(name: string): string | undefined {
  return process.env[name];
}

export function isProduction(): boolean {
  return env("NODE_ENV") === "production";
}
