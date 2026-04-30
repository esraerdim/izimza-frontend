
export const devError = (scope: string, error: unknown) => {
  if (import.meta.env.DEV) {
    console.error(`[${scope}]`, error)
  }
}
