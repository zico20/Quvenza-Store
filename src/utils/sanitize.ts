/**
 * Strip HTML tags and dangerous characters from user-supplied strings.
 * Applied to all text fields written to the database (names, descriptions, slugs).
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/<[^>]*>/g, '')   // strip HTML tags
    .replace(/[<>'"]/g, '')    // strip remaining dangerous chars
    .trim();
}
