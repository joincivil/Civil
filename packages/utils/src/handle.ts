export function isValidHandle(handle: string): boolean {
  const handleRegex = /^(\w){4,15}/;
  return handleRegex.test(handle);
}
