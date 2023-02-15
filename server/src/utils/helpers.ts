export function RemoveKeyFromObj(obj: any, key: string) {
  const newObj = { ...obj };
  delete newObj[key];
  return newObj;
}
