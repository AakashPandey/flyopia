
import FlightInfo from "@/components/flight";
import { siteConfig } from "@/config/site";

async function getData(id: string) {
  const res = await fetch(`${siteConfig.apiFlights}/${id}`)
  if (!res.ok) {
    throw new Error(`Failed to fetch data ${res.status} ${res.statusText}`)
  }

  return res.json()
}

export default async function FlightInfoServer({ params }: { params: { id: string } }) {
  try {
    const data = await getData(params.id);
    console.log(data);
    return (<FlightInfo data={data} />);
  } catch (error) {
    console.error(`Error in FlightInfoServer:`, error);
    return (<h2 className="text-center mt-[15%]">Failed to load flight information. Please try again later.</h2>);
  }

}
