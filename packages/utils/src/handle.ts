export function isValidHandle(handle: string): boolean {
  const handleRegex = /^(\w){1,15}/;
  return handleRegex.test(handle);
}
