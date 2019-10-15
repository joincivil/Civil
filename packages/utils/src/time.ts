export function getTimeSince(createdAt: string): string {
  const createdDate = Date.parse(createdAt);
  const currentDate = Date.now();
  let timeSinceSeconds = (currentDate - createdDate) / 1000;
  let timeSince;

  const years = Math.floor(timeSinceSeconds / (86400 * 365));
  timeSinceSeconds -= years * 3600 * 24;
  const months = Math.floor(timeSinceSeconds / (86400 * 30));
  timeSinceSeconds -= months * 3600 * 24;
  const weeks = Math.floor(timeSinceSeconds / (86400 * 7));
  timeSinceSeconds -= weeks * 3600 * 24;
  const days = Math.floor(timeSinceSeconds / 86400);
  timeSinceSeconds -= days * 3600 * 24;
  const hours = Math.floor(timeSinceSeconds / 3600);
  timeSinceSeconds -= hours * 3600;
  const mins = Math.floor(timeSinceSeconds / 60);

  if (years >= 1) {
    timeSince = years === 1 ? "1 year ago" : years + " years ago";
  } else if (years < 1 && months >= 1) {
    timeSince = months === 1 ? "1 month ago" : months + " months ago";
  } else if (months < 1 && weeks >= 1) {
    timeSince = weeks === 1 ? "1 week ago" : weeks + " weeks ago";
  } else if (weeks < 1 && days >= 1) {
    timeSince = days === 1 ? "1 day ago" : days + " days ago";
  } else if (days < 1 && hours >= 1) {
    timeSince = hours === 1 ? "1 hour ago" : hours + " hours ago";
  } else if (hours < 1 && mins > 1) {
    timeSince = mins + " mins ago";
  } else {
    timeSince = "1 min ago";
  }

  return timeSince;
}
