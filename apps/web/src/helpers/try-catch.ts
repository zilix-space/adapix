export async function tryCatch<T>(
  promise: Promise<T>,
): Promise<{ error: null, data: T } | { error: Error; data: undefined }> {
  try {
    const data = await promise;
    return { error: null, data };
  } catch (error) {
    if (error instanceof Error) {
      return { error, data: undefined };
    }
    
    return { error: new Error('Unknown error'), data: undefined };
  }
}