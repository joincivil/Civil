export function getTimeSince(createdAt: string): string {
  const createdDate = Date.parse(createdAt);
  const currentDate = Date.now();
  let timeSinceSeconds = (currentDate - createdDate) / 1000;
  let timeSince;

  const years = Math.floor(timeSinceSeconds / (86400 * 365));
  timeSinceSeconds -= years * 3600 * 24;
  const weeks = Math.floor(timeSinceSeconds / (86400 * 7));
  timeSinceSeconds -= weeks * 3600 * 24;
  const days = Math.floor(timeSinceSeconds / 86400);
  timeSinceSeconds -= days * 3600 * 24;
  const hours = Math.floor(timeSinceSeconds / 3600);
  timeSinceSeconds -= hours * 3600;
  const mins = Math.floor(timeSinceSeconds / 60);

  if (years >= 1) {
    timeSince = years + "y ago";
  } else if (years < 1 && weeks >= 1) {
    timeSince = weeks + "w ago";
  } else if (weeks < 1 && days >= 1) {
    timeSince = days + "d ago";
  } else if (days < 1 && hours >= 1) {
    timeSince = hours + "h ago";
  } else {
    timeSince = mins + "m ago";
  }

  return timeSince;
}
