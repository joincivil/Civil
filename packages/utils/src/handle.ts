export function isValidHandle(handle: string): boolean {
  if (handle.length < 4 || handle.length > 15) {
    return false;
  }
  const handleRegex = /^(\w){4,15}$/;
  return handleRegex.test(handle);
}
