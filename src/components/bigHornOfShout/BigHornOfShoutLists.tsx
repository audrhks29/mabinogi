import React from "react";
import { Table } from "@tanstack/react-table";

import NonData from "@/components/shared/NonData";
import Pagination from "@/components/shared/ui/Pagination";
import DataTableHead from "@/components/shared/ui/DataTableHead";
import DataTableBody from "@/components/shared/ui/DataTableBody";
import TableSkeleton from "@/components/bigHornOfShout/TableSkeleton";

export default function BigHornOfShoutLists({
  data,
  table,
  isFetching,
}: {
  data: HornListTypes[] | [];
  table: Table<HornListTypes>;
  isFetching: boolean;
}) {
  return (
    <section className="flex flex-col gap-3 w-full">
      <table className="table table-xs md:table-sm">
        <colgroup>
          <col width="20%" />
          <col width="20%" />
        </colgroup>

        <DataTableHead table={table} />

        {isFetching && <TableSkeleton />}
        {!isFetching && data && <DataTableBody table={table} />}
        {!isFetching && !data && <NonData />}
      </table>

      {!isFetching && data && <Pagination table={table} />}
    </section>
  );
}
