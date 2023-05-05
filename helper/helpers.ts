export const isValid = (formBody) => {
  const { eventName, location, startDate, endDate, hotels, artists, topic } =
    formBody;
  if (
    !eventName ||
    !location ||
    !startDate ||
    !endDate ||
    !hotels ||
    !artists ||
    !topic
  ) {
    return false;
  }
  return true;
};
