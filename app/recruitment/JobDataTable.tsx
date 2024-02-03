"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    SortingState,
    getSortedRowModel,
    ColumnFiltersState,
    getFilteredRowModel,
    VisibilityState,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    JobTableRowExtendable,
} from "@/app/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import {Button} from "@/app/components/ui/button"
import {cn} from "@/lib/utils";
import Image from "next/image";
import React, {useEffect, useRef, useState} from "react";
import {DataTablePagination} from "@/app/components/datatable/DataTablePagination";
import {extractContent} from "@/lib/utils/helpers";
import {list} from "postcss";
import {UploadFile} from "@/app/components/misc/FileUploads";


interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function JobDataTable<TData, TValue>({columns, data}: DataTableProps<TData, TValue>) {
    const [filterIsHovered, setFilterIsHovered] = useState(false);
    const [columnsIsHovered, setColumnsIsHovered] = useState(false)


    const handleFilterHover = () => {
        setFilterIsHovered(true)
    }
    const handleFilterNotHover = () => {
        setFilterIsHovered(false)
    }

    const handleColumnsHover = () => {
        setColumnsIsHovered(true)
    }
    const handleColumnsNotHover = () => {
        setColumnsIsHovered(false)
    }

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    const default_hides = () => {
        table.getColumn("job_id").toggleVisibility(false)
        table.getColumn("job_type").toggleVisibility(false)
    }
    useEffect(() => {
        default_hides()
    }, [])


    const [openRows, setOpenRows] = useState<list<number>>(null)
    const [openRow, setOpenRow] = useState<number>(null)
    const toggle_row = (row) => {
        let new_row = null
        if (openRow !== Number(row)) {
            new_row = Number(row)
        }
        console.log(new_row)
        setOpenRow(new_row)
        /*
        let new_rows: list<number> = []
        if (openRows !== null) {
            new_rows = openRows
        }

        if (new_rows.includes(Number(row))) { // removal case
            const i = new_rows.indexOf(Number(row))
            if (i !== -1) {
                new_rows.splice(i, 1)
            }
        } else { // addition case
            new_rows.push(Number(row))
        }
        console.log(new_rows)
        setOpenRows(new_rows.length === 0 ? null : new_rows);

         */
    }
    const fileInputRef = useRef(null);
    const handleDivClick = () => {
        fileInputRef.current.click();
    };
    const [uploadsIsHovered, setUploadsIsHovered] = useState(false)
    const handleUploadsHover = () => {
        setUploadsIsHovered(true)
    }
    const handleUploadsNotHover = () => {
        setUploadsIsHovered(false)
    }


    return (
        <div>
            <div className="text-sm w-full flex flex-row items-center justify-between select-none">
                <div className="px-4 bg-black hover:bg-gray-900 flex flex-row items-center justify-between"
                     onMouseEnter={handleFilterHover} onMouseLeave={handleFilterNotHover}>
                    <Image
                        src={"/icons/filter-dark.svg"}
                        alt="Logo"
                        height="25"
                        width="25"
                        className="relative"
                    />
                    <input
                        className={filterIsHovered ? "bg-gray-900 text-white h-10 w-96 px-2 placeholder-gray-900 border-none outline-none select-all" : "bg-black text-white h-10 w-96 px-2 placeholder-gray-900 border-none outline-none select-all"}
                        type="text"
                        name="name"
                        placeholder="Filter"
                        value={(table.getColumn("job_type")?.getFilterValue() as string) ?? ""}
                        onChange=
                            {
                                (event) => {
                                    if (window.scrollY !== 0) {
                                        window.scrollTo({
                                            top: 0,
                                            behavior: "smooth"
                                        });
                                    }
                                    table.getColumn("job_type")?.setFilterValue(event.target.value)
                                }
                            }

                    />
                </div>
                <div className="px-4 flex flex-row items-center justify-end">
                    <UploadFile key="Import" formats={['.json']} img="sm-upload" style="relative px-0.5 bg0-r-full"/>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild className="outline-none">
                            <button className="px-0.5 bg0-r-full">
                                <Image
                                    src={cn(columnsIsHovered ? "/icons/columns-light.svg" : "/icons/columns-dark.svg")}
                                    alt="columns"
                                    height="25"
                                    width="25"
                                    className="relative"
                                    onMouseEnter={handleColumnsHover}
                                    onMouseLeave={handleColumnsNotHover}
                                />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Hide columns</DropdownMenuLabel>
                            {table
                                .getAllColumns()
                                .filter(
                                    (column) => column.getCanHide()
                                )
                                .map((column) => {
                                    const column_title = extractContent(column.columnDef.header.toString(), 'title')
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize text-gray-400 hover:text-white cursor-pointer"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column_title}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="rounded-sm border-x-0 border-y border-gray-700 text-gray-400">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow className="border-gray-700 hover:bg-gray-900" key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    if (typeof header.column.columnDef['accessorKey'] === "undefined") {
                                        return (
                                            <TableHead className="cursor-default" key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    }
                                    return (
                                        <TableHead
                                            key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody className="text-gray-200">
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <JobTableRowExtendable className="border-gray-700 hover:bg-gray-900 cursor-pointer"
                                                       key={row.id}
                                                       extended={!!(openRow !== null && openRow === Number(row.id))}
                                                       job={data.find(job => job.job_id === Number(row.id))}
                                                       data-state={row.getIsSelected() && "selected"}
                                                       onClick={() => toggle_row(row.id)}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}

                                </JobTableRowExtendable>

                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="p-4 flex flex-row items-center justify-between">
                <div className="flex items-center justify-start space-x-2">
                    {table.getFilteredSelectedRowModel().rows.length > 0 && (
                        // If the condition is true
                        <p className="text-sm font-normal text-gray-700">{table.getFilteredSelectedRowModel().rows.length} of{" "}
                            {table.getFilteredRowModel().rows.length} row(s) selected.</p>
                    )}
                </div>
                <DataTablePagination table={table}/>
            </div>

        </div>
    )
}