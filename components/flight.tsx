'use client'

import { formatDatetime, statusColorMap } from "@/config/site";
import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/breadcrumbs";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
import { Divider } from "@nextui-org/divider";
import { FlightIcon, PinIcon } from "./icons";
import {Progress} from "@nextui-org/progress";

export default function FlightInfo({ data }: any): JSX.Element {
  function statusProgress(status: string): number{
    switch(status.toLowerCase()){
      case 'delayed':
        return 5;
      case 'departed':
        return 60;
      default:
        return 20;
    }
    

  }
  return (
    <div>
      <Breadcrumbs>
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem>Flight {data.id}</BreadcrumbItem>
      </Breadcrumbs>
      <br /><br />

      <Card className="max-w-[400px] px-2">
        <CardHeader className="flex gap-3 py-8">

          <div className="flex flex-row justify-between	w-full">
            <div className="flex flex-col justify-between h-20">
              <p className="text-md">Flight Details</p>
              <div className="flex flex-row justify-start w-full  gap-4">
                <div className="flex flex-col">
                  <p className="text-sm">Flight</p>
                  <p className="text-sm text-primary">{data['flightNumber']}</p>
                </div>

                <div className="flex flex-col">
                  <p className="text-sm">Scheduled</p>
                  <p className="text-sm">{formatDatetime(data['departureTime']).split(', ')[1]}</p>
                </div>

              </div>
            </div>
            <Chip className="capitalize" size="sm" variant="flat" color={statusColorMap[data.status.split(' ').join('').toLowerCase()]}>
              {data['status']}
            </Chip>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="py-8">
          <div className="flex flex-col">
            <div className="mx-8 mb-4">
              <Progress  color="default" size="sm" aria-label="Loading..." value={statusProgress(data['status'])} />
            </div>
            <div className="flex flex-row justify-evenly">
              <div className="flex flex-col items-center">
                <PinIcon></PinIcon>
                <p className="text-sm">{data['origin']}</p>
                <p className="text-sm">{formatDatetime(data['departureTime'])}</p>
              </div>
              <div className="flex flex-col items-center">
                <FlightIcon></FlightIcon>
                <p className="text-sm">{data['airline']}</p>
                <p className="text-sm">({data['flightNumber']})</p>
              </div>
              <div className="flex flex-col items-center">
                <PinIcon></PinIcon>
                <p className="text-sm">{data['destination']}</p>
              </div>
            </div>
          </div>

        </CardBody>

      </Card>
    </div>
  );
}