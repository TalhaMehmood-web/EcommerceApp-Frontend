import ChatBox from "../../components/ChatBox";
import { useQuery } from "react-query";
import { fetchData } from "../../api/FetchData";
import { ORDER_TABLE_DATA } from "../../utils/CustomData";
import Button from "../../components/Button";
import { formatTimestamp } from "../../utils/DateConvert";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
const Orders = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery(
    "orders",
    () => fetchData("customer/orders"),
    {
      refetchOnMount: false,
      staleTime: Infinity,
    }
  );

  return (
    <div
      style={{
        height: "calc(100vh - 115px)",
      }}
      className="relative flex flex-col flex-1 overflow-x-hidden overflow-y-scroll scroll "
    >
      <div className="flex flex-1 overflow-x-hidden ">
        <div className="flex flex-col flex-1 p-5 overflow-x-hidden ">
          <h1 className="mb-2 text-xl">Your orders</h1>

          <div className="flex flex-1">
            {data?.length === 0 ? (
              <div className="flex items-center justify-center flex-1 text-4xl italic font-bold ">
                No Orders Placed yet
              </div>
            ) : (
              <div className="w-full overflow-auto h-fit scroll">
                <table className="w-full border table-auto scroll border-slate-700">
                  <thead className="bg-slate-700 ">
                    <tr>
                      {ORDER_TABLE_DATA?.map((header, index) => (
                        <th
                          key={index}
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
                            {ORDER_TABLE_DATA?.map((item, rowIndex) => {
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
                            key={order?._id}
                            className={`${
                              index % 2 === 0
                                ? "bg-transparent"
                                : "bg-slate-600/30"
                            }`}
                          >
                            {ORDER_TABLE_DATA?.map((header, index) => (
                              <td
                                key={order?._id + header?.field + index}
                                className={`p-3 text-sm 0 whitespace-nowrap ${
                                  header?.type === "number" && "text-center"
                                } ${
                                  header?.field === "orderNumber"
                                    ? "text-blue-500"
                                    : "text-slate-10"
                                } `}
                              >
                                {header.field !== "createdAt" &&
                                  header.field !== "invoice" &&
                                  header.field !== "trackOrder" &&
                                  header?.prefix + order[header?.field]}
                                {header.field === "createdAt" &&
                                  formatTimestamp(order[header?.field])}
                                {header?.field === "invoice" && (
                                  <Button
                                    type={"button"}
                                    onClick={() =>
                                      navigate(
                                        `/customer/invoice/${order?.invoiceId}`
                                      )
                                    }
                                    title={"Invoice"}
                                    className={
                                      "bg-indigo-600 px-2 py-1 rounded-md hover:bg-indigo-600/70"
                                    }
                                  />
                                )}
                                {header?.field === "trackOrder" && (
                                  <Button
                                    type={"button"}
                                    onClick={() =>
                                      navigate(
                                        `/customer/track-order/${order?._id}`
                                      )
                                    }
                                    title={"Track Order"}
                                    className={
                                      "bg-indigo-600 px-2 py-1 rounded-md hover:bg-indigo-600/70"
                                    }
                                  />
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
            )}
          </div>
        </div>
      </div>

      <ChatBox />
    </div>
  );
};

export default Orders;
