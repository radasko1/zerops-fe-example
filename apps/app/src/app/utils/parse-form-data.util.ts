export function parseFormData(data: any): any {
  if (typeof data === 'string') {
    return data.trim().replace(/\s+/g, ' '); // Trim and normalize spaces
  } else if (Array.isArray(data)) {
    return data.map(parseFormData);
  } else if (typeof data === 'object' && data !== null) {
    const trimmedObject: { [key: string]: any } = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        trimmedObject[key] = parseFormData(data[key]);
      }
    }
    return trimmedObject;
  } else {
    return data; // Return non-string, non-array, non-object values as-is
  }
}
