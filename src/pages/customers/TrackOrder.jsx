import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { fetchData } from "../../api/FetchData";
import Button from "../../components/Button";
import { TRACK_ORDER_DATA as trackOrderFields } from "../../utils/CustomData";
import { INVOICE_TABLE_DATA as productsTableFields } from "../../utils/CustomData";
import Table from "../../components/Table";
import { formatTimestamp } from "../../utils/DateConvert";
import Timeline from "../../components/Timeline";

const TrackOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = orderId
    ? useQuery(
        ["order", orderId],
        () => fetchData(`customer/order/${orderId}`),
        {
          staleTime: Infinity,
          refetchOnMount: false,
        }
      )
    : { data: null, isLoading: false, isError: false };

  if (!orderId) {
    return (
      <div className="flex flex-1 justify-center items-center flex-col ">
        <p className="text-4xl italic font-semibold">
          Please Select an Order First{" "}
        </p>
        <Button
          title={"Select Order"}
          onClick={() => navigate("/customer/orders")}
          className={
            "px-2 py-1 bg-yellow-500  rounded-md my-2 hover:bg-yellow-600"
          }
        />
      </div>
    );
  }

  return (
    <div
      style={{
        height: "calc(100vh - 115px)",
      }}
      className="flex flex-1 flex-col p-4  overflow-hidden  overflow-y-scroll  scroll"
    >
      <p className="text-4xl font-semibold">Track Order</p>
      <div className="my-2 bg-slate-700 rounded-md border border-slate-700 shadow-md  shadow-slate-700">
        {trackOrderFields?.map((field, index) => (
          <div
            key={field?.field + index}
            className={`grid grid-cols-2  divide-x-[2px] divide-slate-600 ${
              index % 2 === 0 ? "bg-transparent" : "bg-slate-800"
            } `}
          >
            <div className="p-3 ">
              <p className="text-lg font-semibold italic">{field?.head}</p>
            </div>
            <div className="p-3">
              <p>
                {data && field?.field === "createdAt"
                  ? formatTimestamp(data?.[field?.field])
                  : data?.[field?.field]}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col my-2">
        <p className="text-2xl font-semibold text-center italic mb-4 bg-slate-700 p-2">
          Order Status
        </p>

        <Timeline orderStatus={data?.orderStatus} />
      </div>
      <div className="flex flex-col my-4">
        <p className="text-2xl font-semibold text-center italic mb-4 bg-slate-700 p-2">
          Products
        </p>
        <Table header={productsTableFields} data={data?.carts} />
      </div>
    </div>
  );
};

export default TrackOrder;
