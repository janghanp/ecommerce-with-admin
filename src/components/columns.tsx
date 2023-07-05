"use client";

import { ColumnDef } from "@tanstack/react-table";

import CellAction from "@/src/components/cell-action";

export type BillboardColumn = {
    id: string;
    label: string;
    createdAt: string;
};

export type CategoryColumn = {
    id: string;
    name: string;
    billboardLabel: string;
    createdAt: string;
};

export type SizeColumn = {
    id: string;
    name: string;
    value: string;
    createdAt: string;
};

export const billboardColumns: ColumnDef<BillboardColumn>[] = [
    {
        accessorKey: "label",
        header: "Label",
    },
    {
        accessorKey: "createdAt",
        header: "Date",
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} type="billboard" />,
    },
];

export const categoryColumns: ColumnDef<CategoryColumn>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "billboard",
        header: "Billboard",
        cell: ({ row }) => row.original.billboardLabel,
    },
    {
        accessorKey: "createdAt",
        header: "Date",
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} type="category" />,
    },
];

export const sizeColumns: ColumnDef<SizeColumn>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "value",
        header: "Value",
    },
    {
        accessorKey: "createdAt",
        header: "Date",
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} type="size" />,
    },
];
