import React, { useMemo } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import { useQuery } from "react-query";
import { fetchData } from "../../api/FetchData";
import { PRODUCTS_COLUMNS as COLUMNS } from "../../utils/CustomData";
import GlobalFilter from "../../components/GlobalFilter";
import Button from "../../components/Button";
import { formatTimestamp } from "../../utils/DateConvert";

const AllProducts = () => {
  const { data, isLoading } = useQuery(
    "products",
    () => fetchData("admin/products"),
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

  if (isLoading) {
    return <div>loading</div>;
  }

  return (
    <div
      style={{
        height: "calc(100vh - 130px)",
      }}
      className="flex flex-col flex-1 p-4 overflow-x-hidden "
    >
      <div className="">
        <p className="text-4xl font-semibold">Products</p>
        <div className="flex flex-col justify-between space-y-5 sm:flex-row sm:space-y-0 sm:items-center ">
          <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
          <div className="flex items-center justify-between sm:justify-start ">
            <select
              name="pageSize"
              id="pageSize"
              value={pageSize}
              className="p-2 rounded-md outline-none cursor-pointer bg-slate-800"
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
            <div className="ml-3">
              <Button
                className={
                  "bg-blue-600 hover:bg-blue-500 focus:bg-blue-500 p-2 rounded-md"
                }
                title={"Add Product"}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full overflow-auto scroll ">
        <table {...getTableProps()} className="w-full table-auto scroll ">
          <thead className=" bg-slate-700">
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
                    className="px-3 py-4 font-semibold text-start text-slate-500 whitespace-nowrap"
                  >
                    <div className="flex items-center uppercase text-[13px] font-bold">
                      <p> {column.render("Header")}</p>
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
                        className={` py-[6px] whitespace-nowrap ${
                          (cell?.column.id === "salesPrice" ||
                            typeof cell?.value === "number") &&
                          "text-center"
                        } `}
                      >
                        {cell?.column.id === "picture" ? (
                          <img
                            className="object-cover w-12 h-12 mx-auto border rounded-md border-slate-700 "
                            src={cell.value}
                            alt="Product"
                          />
                        ) : (
                          <p
                            className={`text-sm ${
                              (cell?.column.id === "title" ||
                                cell?.column.id === "vendor") &&
                              "text-blue-600"
                            } `}
                          >
                            {cell.column.id === "title" &&
                              cell.value.split(" ").splice(0, 5).join(" ") +
                                "..."}
                            {cell.column.id === "tags" && (
                              <div className="flex ">
                                {cell.value[0].split(",").map((tag, index) => (
                                  <p
                                    className="border  h-fit whitespace-nowrap  px-1 mx-1 text-[10px] text-slate-300 rounded-md bg-slate-700 border-slate-800"
                                    key={index}
                                  >
                                    {tag.toUpperCase()}
                                  </p>
                                ))}
                              </div>
                            )}
                            {cell.column.id === "createdAt" &&
                              formatTimestamp(cell.value)}
                            {cell.column.id !== "title" &&
                              cell.column.id !== "tags" &&
                              cell.column.id !== "createdAt" &&
                              cell.value}
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
      <div className="flex items-center justify-between p-4 border-t border-slate-700 ">
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

export default AllProducts;
