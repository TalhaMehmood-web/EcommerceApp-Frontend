import React from "react";
import { useQuery } from "react-query";
import { fetchData } from "../../api/FetchData";
import { CUSTOMERS_COLUMNS as COLUMNS } from "../../utils/CustomData";
import GlobalFilter from "../../components/GlobalFilter";
import { useMemo } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import { formatTimestamp } from "../../utils/DateConvert";
const AllCustomers = () => {
  const { data, isLoading } = useQuery(
    "all-customer",
    () => fetchData("admin/all-customers"),
    {
      staleTime: Infinity,
      refetchOnMount: false,
    }
  );

  const columns = useMemo(() => COLUMNS, []);
  const tableData = useMemo(() => data || [], [data]);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    setPageSize,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data: tableData,
      initialState: { pageSize: 7 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );
  const { globalFilter, pageIndex, pageSize = 7 } = state;
  return (
    <div className="flex flex-1 flex-col overflow-x-hidden p-4 ">
      <div className="">
        <p className="text-4xl font-semibold">Customers</p>
        <div className="flex sm:flex-row flex-col justify-between sm:space-y-0 space-y-5  sm:items-center ">
          <GlobalFilter
            filter={globalFilter}
            setFilter={setGlobalFilter}
            placeHolder={"Search Customer.."}
          />
          <div className="flex items-center justify-between  sm:justify-start ">
            <select
              name="pageSize"
              id="pageSize"
              value={pageSize}
              className="bg-slate-800 outline-none p-2 rounded-md cursor-pointer"
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              <option disabled value={""}>
                Select page Size
              </option>
              {[7, 10, 20, 30, 50, 70, 100].map((size) => (
                <option key={size} value={size}>
                  Show {size} entries
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="overflow-auto w-full">
        <table {...getTableProps()} className="w-full table-auto">
          <thead className="bg-slate-700">
            {headerGroups?.map((headerGroup, index) => (
              <tr
                {...headerGroup.getHeaderGroupProps()}
                key={index}
                className="border-y border-slate-800"
              >
                {headerGroup?.headers?.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={column.id}
                    className="py-2 px-3 text-start text-slate-500 font-semibold whitespace-nowrap"
                  >
                    <div className="flex items-center  uppercase text-[13px] font-bold">
                      <p className="text-[12px]"> {column.render("Header")}</p>
                      <i
                        className={`fa-solid ml-3 text-[10px]
                  ${
                    column.isSorted
                      ? column.isSortedDesc
                        ? "fa-sort-up"
                        : "fa-sort-down"
                      : "fa-sort"
                  }`}
                      ></i>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          {data?.length !== 0 && data && (
            <tbody {...getTableBodyProps()}>
              {page?.map((row, rowIndex) => {
                prepareRow(row);
                return (
                  <tr
                    {...row?.getRowProps()}
                    key={rowIndex}
                    className={`border-y border-slate-700 h-fit ${
                      rowIndex % 2 === 0 ? "bg-slate-800" : "bg-transparent"
                    } `}
                  >
                    {row?.cells?.map((cell, cellIndex) => (
                      <td
                        {...cell?.getCellProps()}
                        key={cellIndex}
                        className={` py-[6px] whitespace-nowrap border-r px-2 border-slate-700/40 ${
                          (cell?.column.id === "salesPrice" ||
                            typeof cell?.value === "number") &&
                          "text-center"
                        } `}
                      >
                        {cell?.column.id === "picture" ? (
                          <img
                            className="w-12 h-12 object-cover mx-auto border border-slate-700 rounded-full  "
                            src={cell.value}
                            alt="Product"
                          />
                        ) : (
                          <p className={`text-sm  `}>
                            {cell.column.id === "lastOrderDate" &&
                              formatTimestamp(cell.value)}
                            {cell.column.id !== "lastOrderDate" && cell.value}
                          </p>
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>
      </div>
      <div className="p-4 flex justify-between items-center border-y border-slate-700 ">
        <div className="">
          <p>
            {pageIndex * pageSize + 1} to{" "}
            {Math.min((pageIndex + 1) * pageSize, data?.length)} items of{" "}
            {data?.length}
          </p>
        </div>
        <div>
          <button
            className={`px-2 py-1 text-sm mx-3 font-semibold rounded-md ${
              !canPreviousPage
                ? "cursor-not-allowed opacity-50 bg-red-600"
                : "cursor-pointer bg-green-500 opacity-100"
            }`}
            disabled={!canPreviousPage}
            onClick={() => previousPage()}
          >
            Previous
          </button>
          <button
            className={`px-2 py-1 text-sm font-semibold rounded-md ${
              !canNextPage
                ? "cursor-not-allowed opacity-50 bg-red-600"
                : "cursor-pointer bg-green-500 opacity-100"
            }`}
            disabled={!canNextPage}
            onClick={() => nextPage()}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllCustomers;
