import { flexRender, Table } from "@tanstack/react-table";
import { usePathname } from "next/navigation";
import React from "react";

type DataTableBodyProps = {
  table: Table<ItemListsTypes> | Table<HornListTypes>;
};

export default function DataTableBody({ table }: DataTableBodyProps) {
  const pathName = usePathname();
  const isAuctionPage = pathName.includes("auction");

  return (
    <tbody className="text-center">
      {table?.getRowModel()?.rows?.map(row => (
        <React.Fragment key={row.id}>
          <tr
            className="cursor-pointer hover:bg-base-200"
            onClick={() => {
              if (isAuctionPage)
                (document.getElementById(`itemDetail_modal_${row.id}`) as HTMLDialogElement).showModal();
            }}>
            {row.getVisibleCells().map((cell: any) => (
              <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
            ))}
          </tr>
        </React.Fragment>
      ))}
    </tbody>
  );
}
