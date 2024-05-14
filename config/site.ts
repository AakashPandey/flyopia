export type SiteConfig = typeof siteConfig;
type StatusColor = "primary" | "warning" | "success" | "default";

export const statusColorMap: Record<string, StatusColor> = {
  ontime: "primary",
  delayed: "warning",
  boarding: "success",
  departed: "default",
};

export function formatDatetime(datetimeString: string | number | Date) {
  const dateTime = new Date(datetimeString);
  const month = dateTime.toLocaleString("en-us", { month: "long" });
  const date = dateTime.getDate();
  let hours = dateTime.getHours();
  const minutes = dateTime.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const timeString = `${hours}:${minutes < 10 ? "0" : ""}${minutes} ${ampm}`;
  const formattedDatetime = `${month} ${date}, ${timeString}`;

  return formattedDatetime;
}

export const siteConfig = {
  name: "Flyopia",
  description: "A Travelopia take home test",
  navItems: [],
  navMenuItems: [],
  links: {
    github: "https://github.com/aakashpandey/flyopia",
    twitter: "https://twitter.com/getnextui",
    docs: "https://nextui.org",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
  apiFlights: "https://flight-status-mock.core.travelopia.cloud/flights",
};
