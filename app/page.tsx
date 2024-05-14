"use client";

import React, { useEffect, useCallback, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/table";
import { Spinner } from "@nextui-org/spinner";
import { Chip } from "@nextui-org/chip";
import { Input } from "@nextui-org/input";
import { formatDatetime, siteConfig, statusColorMap } from "@/config/site";
import { useAsyncList, AsyncListData } from "@react-stately/data";
import { SearchIcon } from "@/components/icons";
import { useRouter } from 'next/navigation';

type Flight = {
  id: string;
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  status: string;
	[key: string]: any;
};

async function fetchData(signal: AbortSignal | null): Promise<Flight[]> {
  try {
    let res = await fetch(siteConfig.apiFlights, {
      signal,
    });
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    alert(`Error: ${error}`);
    console.log(error);
    throw error;
  }
}

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [filterValue, setFilterValue] = useState("");

  let list: AsyncListData<Flight> = useAsyncList<Flight>({
    async load({ signal }) {
      let json = await fetchData(signal);
      setIsLoading(false);
      return {
        items: json,
      };
    },
    async sort({ items, sortDescriptor }) {
			const { column, direction } = sortDescriptor;
      return {
        items: items.sort((a, b) => {
					
          let first = a[column??''] ?? '';
          let second = b[column??''] ?? '';

          const isDateTimeString = (value: any): boolean => {
            return typeof value === "string" && !isNaN(Date.parse(value));
          };

          if (isDateTimeString(first) && isDateTimeString(second)) {
            first = new Date(first);
            second = new Date(second);
          }

          let cmp = first < second ? -1 : 1;
          if (first === second) cmp = 0;

          if (direction === "descending") {
            cmp *= -1;
          }
          return cmp;
        }),
      };
    },
  });

  const renderCell = useCallback((row: Flight, columnKey: keyof Flight) => {
    const cellValue = row[columnKey];

    switch (columnKey) {
      case "flightNumber":
        return <span className="text-primary">{row.flightNumber}</span>;

      case "status":
        const statusKey = row.status.split(" ").join("").toLowerCase() as keyof typeof statusColorMap;
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[statusKey]}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );

      case "departureTime":
        return <div>{formatDatetime(row.departureTime)}</div>;

      default:
        return cellValue;
    }
  }, []);

  const filteredItems = list.items.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(filterValue.toLowerCase())
    )
  );

  const onSearchChange = useCallback((value: string) => {
    setFilterValue(value);
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      let json = await fetchData(null);
      json.forEach((item) => {
        list.update(item.id, item);
      });
    }, 30 * 1000);
    return () => clearInterval(interval);
  }, [list]);

  return (
    <section className="">
      <Input
        isClearable
        className="w-full sm:max-w-[24%]"
        placeholder="Search Flight number"
        startContent={<SearchIcon />}
        value={filterValue}
        onClear={onClear}
        onValueChange={onSearchChange}
      />
      <br />
      <Table
        isHeaderSticky
        aria-label="Example table with client side sorting"
        sortDescriptor={list.sortDescriptor}
        onSortChange={list.sort}
        selectionMode="single"
        onRowAction={(key) => router.push(`/flights/${String(key)}`)}
        classNames={{
          base: "max-h-[550px] overflow-scroll",
          table: "min-h-[400px]",
        }}
      >
        <TableHeader>
          <TableColumn key="flightNumber">
            <b>Flight number</b>
          </TableColumn>
          <TableColumn key="airline">
            <b>Airline</b>
          </TableColumn>
          <TableColumn key="origin">
            <b>Origin</b>
          </TableColumn>
          <TableColumn key="destination">
            <b>Destination</b>
          </TableColumn>
          <TableColumn key="departureTime" allowsSorting>
            <b>Departure time</b>
          </TableColumn>
          <TableColumn key="status" allowsSorting>
            <b>Status</b>
          </TableColumn>
        </TableHeader>
        <TableBody
          items={filteredItems}
          isLoading={isLoading}
          loadingContent={<Spinner label="Loading..." />}
        >
          {(item) => (
            <TableRow key={item.id} className="cursor-pointer">
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey as keyof Flight)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  );
}
