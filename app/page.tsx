"use client"
import React, { useEffect } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from "@nextui-org/table";
import { Spinner } from "@nextui-org/spinner";
import { Chip } from "@nextui-org/chip";
import { Input } from "@nextui-org/input";
import { formatDatetime, siteConfig, statusColorMap } from "@/config/site";

import { useAsyncList } from "@react-stately/data";
import { SearchIcon } from "@/components/icons";
import { useRouter } from 'next/navigation'

export default function Home() {
	const router = useRouter()

	const [isLoading, setIsLoading] = React.useState(true);

	async function fetchData(signal: AbortSignal | null) {
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
			throw error;  // Rethrow the error after logging it
		}
	}

	let list = useAsyncList({

		async load({ signal }) {
			let json = await fetchData(signal);
			setIsLoading(false);
			return {
				items: json,
			};
		},
		async sort({ items, sortDescriptor }) {
			return {
				items: items.sort((a, b) => {
					let first = a[sortDescriptor.column];
					let second = b[sortDescriptor.column];

					const isDateTimeString = (value) => {
						return !isNaN(Date.parse(value));
					};

					if (isDateTimeString(first) && isDateTimeString(second)) {
						first = new Date(first);
						second = new Date(second);
					}

					let cmp = (first < second) ? -1 : 1;

					if (sortDescriptor.direction === "descending") {
						cmp *= -1;
					}
					return cmp;
				}),
			};
		},


	});

	const [selectionBehavior, setSelectionBehavior] = React.useState("toggle");


	const renderCell = React.useCallback((row, columnKey) => {
		const cellValue = row[columnKey];

		switch (columnKey) {

			case "flightNumber":
				return (
					<span className="text-primary">
						{row.flightNumber}
					</span>
				);


			case "status":
				return (
					<Chip className="capitalize" color={statusColorMap[row.status.split(' ').join('').toLowerCase()]} size="sm" variant="flat">
						{cellValue}
					</Chip>
				);

			case "departureTime":
				return (
					<div>
						{formatDatetime(row.departureTime)}
					</div>
				);

			default:
				return cellValue;

		}

	});
	const [filterValue, setFilterValue] = React.useState("");

	const filteredItems = list.items.filter(item => {
		return Object.values(item).some(value =>
			value.toString().toLowerCase().includes(filterValue.toLowerCase())
		);
	});

	const onSearchChange = React.useCallback((value) => {
		if (value) {
			console.log(value)
			setFilterValue(value);

		} else {
			setFilterValue("");
		}
	}, []);

	const onClear = React.useCallback(() => {
		setFilterValue("")

	}, [])

	useEffect(() => {
		const interval = setInterval(async () => {
			let json = await fetchData(null);
			json.forEach((item: any) => {
				list.update(item.id, item);
			})
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
				onClear={() => onClear()}
				onValueChange={onSearchChange}
			/>
			<br />
			<Table
				isHeaderSticky
				aria-label="Example table with client side sorting"
				sortDescriptor={list.sortDescriptor}
				onSortChange={list.sort}
				selectionMode="single"
				selectionBehavior={selectionBehavior}
				onRowAction={(key: any) => router.push(`/flights/${key}`)}
				classNames={{
					base: "max-h-[550px] overflow-scroll",
					table: "min-h-[400px]",
				}}
			>
				<TableHeader  >
					<TableColumn key="flightNumber">
						<b>Flight number</b>
					</TableColumn>
					<TableColumn key="airline" >
						<b>Airline</b>
					</TableColumn>
					<TableColumn key="origin" >
						<b>Origin</b>
					</TableColumn>
					<TableColumn key="destination" >
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
						<TableRow key={item.name} className="cursor-pointer">
							{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
						</TableRow>
					)}
				</TableBody>
			</Table>

		</section>
	);
}
