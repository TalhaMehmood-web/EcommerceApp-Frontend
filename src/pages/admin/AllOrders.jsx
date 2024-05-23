import React, { useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import { fetchData } from "../../api/FetchData";
import { ADMIN_ORDER_TABLE_DATA } from "../../utils/CustomData";
import Skeleton from "react-loading-skeleton";
import { formatTimestamp } from "../../utils/DateConvert";
import Button from "../../components/Button";
import { useSocketContext } from "../../context/SocketContext";
import Modal from "../../components/Modal";
const AllOrders = () => {
  const { socket } = useSocketContext();
  const queryClient = useQueryClient();
  const { isLoading, data } = useQuery(
    "all-orders",
    () => fetchData("admin/orders"),
    {
      refetchOnMount: false,
      staleTime: Infinity,
    }
  );
  // console.log(data);
  useEffect(() => {
    socket?.on("order", (order) => {
      queryClient.setQueryData("all-orders", (prevData) => {
        return [order, ...prevData];
      });
    });
    return () => {
      socket?.off("order");
    };
  }, [socket, queryClient]);
  return (
    <div className="flex flex-1 overflow-x-hidden ">
      <div className="w-full ">
        <div className="p-5 ">
          <h1 className="mb-2 text-xl">Your orders</h1>

          <div className="w-full rounded-lg shadow ">
            <table className="w-full border table-auto scroll scroll-smooth border-slate-700">
              <thead className="bg-slate-700 ">
                <tr>
                  {ADMIN_ORDER_TABLE_DATA?.map((header, index) => (
                    <th
                      key={index + header?.field}
                      className="w-20 p-3 text-slate-300 font-bold  text-[12px] tracking-wide text-left whitespace-nowrap  "
                    >
                      {header?.head.toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="">
                {isLoading ? (
                  <>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <tr className={``} key={index}>
                        {ADMIN_ORDER_TABLE_DATA?.map((_, rowIndex) => {
                          return (
                            <td
                              className="px-2 py-2 border-r border-slate-700 "
                              key={rowIndex + index}
                            >
                              <Skeleton className="w-full h-[2.2rem]" />
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </>
                ) : (
                  <>
                    {data?.map((order, index) => (
                      <tr
                        key={order?._id + index}
                        className={`${
                          index % 2 === 0 ? "bg-transparent" : "bg-slate-600/30"
                        }`}
                      >
                        {ADMIN_ORDER_TABLE_DATA?.map((header) => (
                          <td
                            key={header?.field + order?._id}
                            className="px-2 text-sm font-normal border-r whitespace-nowrap border-slate-700/70 text-slate-200"
                          >
                            {header.field === "picture" && (
                              <img
                                className="object-cover w-12 h-12 mx-auto rounded-full"
                                src={order[header?.field]}
                                alt=""
                              />
                            )}
                            {header.field !== "picture" &&
                              header.field !== "date" &&
                              header.field !== "status" && (
                                <p
                                  className={`${
                                    header?.field === "orderNumber" &&
                                    "text-blue-500"
                                  }  `}
                                >
                                  {(header.field === "orderNumber" ? "#" : "") +
                                    order[header?.field]}
                                </p>
                              )}
                            {header.field === "date" && (
                              <p>{formatTimestamp(order[header?.field])}</p>
                            )}
                            {header.field === "status" && (
                              <Modal title={"Update Status"} />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* <ChatBox /> */}
    </div>
  );
};

export default AllOrders;
