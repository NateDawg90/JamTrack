export const isValid = (formBody) => {
  const { eventName, location } = formBody;
  if (!eventName || !location) {
    return false;
  }
  return true;
};
