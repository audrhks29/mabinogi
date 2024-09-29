import { useEffect, useState } from "react";
import Image from "next/image";

import itemLists from "@/assets/auction/itemLists.json";

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  ArrowUpDownIcon,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ItemDetail from "./ItemDetail";

type SortingState = Array<{ id: string; desc: boolean }>;

export default function ItemLists({ category, searchKeyword }) {
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    // 검색어만 입력시
    if (searchKeyword && !category.detailCategory) {
      const filteredData = itemLists.filter(item => item.textName1.includes(searchKeyword));
      setData(filteredData);
    }

    // 카테고리만 클릭시
    else if (searchKeyword === "" && category.detailCategory) {
      const filteredData = itemLists.filter(item => item.category_detail === category.detailCategory);
      setData(filteredData);
    }

    // 검색어 입력 및 카테고리 클릭
    else if (searchKeyword !== "" && category.detailCategory) {
      const filteredData = itemLists.filter(
        item => item.category_detail === category.detailCategory && item.textName1.includes(searchKeyword),
      );
      setData(filteredData);
    }
    // 초기화
    else {
      setData([]);
    }
  }, [category, searchKeyword]);

  const columns = [
    {
      accessorKey: "textName1",
      header: ({ column }) => (
        <div className="flex gap-3 align-middle justify-center items-center">
          <span className="font-bold cursor-pointer">아이템</span>
          <button onClick={() => column.toggleSorting()}>
            <ArrowUpDownIcon className="w-4 h-4" />
          </button>
        </div>
      ),

      cell: props => {
        const rowData = props.row.original;

        return (
          <div className="flex items-center">
            <Image src={rowData.img} width={30} height={30} alt={rowData.textName1} />
            <span className="ml-2">{props.getValue()}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "date",
      header: ({ column }) => (
        <div className="flex gap-3 align-middle justify-center items-center">
          <span className="font-bold cursor-pointer">남은 시간</span>
          <button onClick={() => column.toggleSorting()}>
            <ArrowUpDownIcon className="w-4 h-4" />
          </button>
        </div>
      ),
      cell: props => <p>{props.getValue()}</p>,
    },
    {
      accessorKey: "amount",
      header: "갯수",
      cell: props => <p>{props.getValue()}</p>,
    },
    {
      accessorKey: "cost",
      header: ({ column }) => (
        <div className="flex gap-3 align-middle justify-center items-center">
          <span className="font-bold cursor-pointer">가격</span>
          <button onClick={() => column.toggleSorting()}>
            <ArrowUpDownIcon className="w-4 h-4" />
          </button>
        </div>
      ),
      cell: props => {
        const rowData = props.row.original;

        return (
          <div>
            <p>개당 : {props.getValue().toLocaleString()} Gold</p>
            <p>전체 : {(props.getValue() * rowData.amount).toLocaleString()} Gold</p>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <Card className="p-3">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHead key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.map(row => (
            <Dialog key={row.id}>
              <DialogTrigger asChild>
                <TableRow className="cursor-pointer">
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              </DialogTrigger>

              <ItemDetail row={row} />
            </Dialog>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-center items-center pt-6 pb-3">
        <ul className="flex gap-3">
          <Button
            className="w-7 h-7 p-0 cursor-pointer"
            variant="outline"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.firstPage()}>
            <ChevronFirst className="w-5 h-5" />
          </Button>

          <Button
            className="w-7 h-7 p-0 cursor-pointer"
            variant="outline"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.setPageIndex(table.getState().pagination.pageIndex - 10)}>
            <ChevronsLeft className="w-5 h-5" />
          </Button>

          <Button
            className="w-7 h-7 p-0 cursor-pointer"
            variant="outline"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}>
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="flex items-center">
            [{table.getState().pagination.pageIndex + 1}/{table.getPageCount()}]
          </div>

          <Button
            className="w-7 h-7 p-0 cursor-pointer"
            variant="outline"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}>
            <ChevronRight className="w-5 h-5" />
          </Button>

          <Button
            className="w-7 h-7 p-0 cursor-pointer"
            variant="outline"
            disabled={!table.getCanNextPage()}
            onClick={() => {
              if (table.getState().pagination.pageIndex + 10 > table.getPageCount()) {
                table.setPageIndex(table.getPageCount() - 1);
              } else {
                table.setPageIndex(table.getState().pagination.pageIndex + 10);
              }
            }}>
            <ChevronsRight className="w-5 h-5" />
          </Button>

          <Button
            className="w-7 h-7 p-0 cursor-pointer"
            variant="outline"
            disabled={!table.getCanNextPage()}
            onClick={() => table.lastPage()}>
            <ChevronLast className="w-5 h-5" />
          </Button>
        </ul>
      </div>
    </Card>
  );
}
