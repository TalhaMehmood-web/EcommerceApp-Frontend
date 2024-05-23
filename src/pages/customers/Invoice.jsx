import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { fetchData } from "../../api/FetchData";
import { formatTimestamp } from "../../utils/DateConvert";
import Button from "../../components/Button";
import { INVOICE_TABLE_DATA } from "../../utils/CustomData";
const Invoice = () => {
  const { invoiceId } = useParams();
  const { data, isLoading } = useQuery(
    ["invoice", invoiceId],
    () => fetchData(`customer/invoice/${invoiceId}`),
    {
      refetchOnMount: false,
    }
  );

  return (
    <div
      style={{
        height: "calc(100vh - 115px)",
      }}
      className="flex flex-1 flex-col overflow-y-scroll overflow-x-hidden scroll   px-10 py-4"
    >
      <div className="flex w-full justify-between">
        <p className="text-4xl font-semibold ">Invoice</p>
        <Button
          title={"Download Invoice"}
          onClick={() => window.print()}
          className={
            "px-2  text-slate-200 py-1 border border-slate-600 rounded-md hover:bg-slate-700 focus:bg-slate-700"
          }
        />
      </div>
      <div className="bg-slate-700 rounded-md my-5 p-5 grid grid-cols-4 gap-2 ">
        <div className="flex flex-col space-y-6">
          <div className="flex space-x-4">
            <p className="font-bold text-[13px]">InvoiceNo :</p>
            <p className="text-slate-300 text-[12.8px]">
              #{data?.checkout?.invoiceNo}
            </p>
          </div>
          <div className="flex space-x-4  ">
            <p className="font-bold text-[13px]">Invoice Date :</p>
            <p className="text-slate-300 text-[12.8px]">
              {formatTimestamp(data?.checkout?.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex flex-col  space-y-10  ">
          <div className="">
            <p className="font-bold text-[13px]">Sold By :</p>
            <p className="text-slate-300 text-[12.8px]">Buy It </p>
            <p className="text-slate-300 text-[12.8px]">
              Akhtar Brothers Karyana Store
            </p>
          </div>
          <div className="flex items-center space-x-3 ">
            <div>
              <p className="font-bold text-[13px]">Order Number :</p>
              <p className="text-slate-300 text-[12.8px]">
                {data?.orderNumber}
              </p>
            </div>
            <div>
              <p className="font-bold text-[13px]">Order Date :</p>
              <p className="text-slate-300 text-[12.8px]">
                {formatTimestamp(data?.checkout?.createdAt)}
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-3 flex flex-col">
          <p className="text-[13px] font-bold">Billing Address :</p>
          <p className="text-slate-300 text-[13px]">
            {data?.checkout?.shippingAddress?.customerName},
          </p>
          <p className="text-slate-300 text-[13px]">
            {data?.checkout?.shippingAddress?.address}
          </p>
          <p className="text-slate-300 text-[13px]">
            {data?.checkout?.shippingAddress?.email}
          </p>
          <p className="text-slate-300 text-[13px]">
            {data?.checkout?.shippingAddress?.phoneNumber}
          </p>
        </div>
        <div className="space-y-3 flex flex-col">
          <p className="text-[13px] font-bold">Shipping Address :</p>
          <p className="text-slate-300 text-[13px]">
            {data?.checkout?.shippingAddress?.customerName},
          </p>
          <p className="text-slate-300 text-[13px]">
            {data?.checkout?.shippingAddress?.address}
          </p>
          <p className="text-slate-300 text-[13px]">
            {data?.checkout?.shippingAddress?.email}
          </p>
          <p className="text-slate-300 text-[13px]">
            {data?.checkout?.shippingAddress?.phoneNumber}
          </p>
        </div>
      </div>
      <div className="w-full ">
        <div className="w-full relative overflow-auto scroll">
          <table className="w-full table-auto ">
            <thead className="">
              <tr className="bg-slate-700 ">
                {INVOICE_TABLE_DATA?.map((header) => (
                  <th
                    className={`py-3 px-2 text-base text-slate-400 font-semibold whitespace-nowrap ${
                      header?.field === "productTitle" && "text-start"
                    } `}
                  >
                    {header?.head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.checkout?.carts?.map((cart, index) => (
                <tr
                  className={` border-b border-slate-600 ${
                    index % 2 === 0 ? "bg-slate-600/20" : "bg-transparent"
                  }`}
                >
                  {INVOICE_TABLE_DATA?.map((field) => (
                    <th className="py-2 border-r px-3 border-slate-700 whitespace-nowrap text-sm font-normal text-slate-200">
                      {field?.field === "productPicture" && (
                        <img
                          className="w-12 h-12 border border-slate-700 rounded-md mx-auto"
                          src={cart[field?.field]}
                        />
                      )}
                      {field?.field !== "productPicture" && (
                        <p
                          className={`${
                            field.field === "productTitle" && "text-start "
                          }`}
                        >
                          {cart[field?.field]}
                        </p>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="w-full flex justify-between py-3 px-12 text-slate-300 bg-slate-700">
          <p>Subtotal</p>
          <p>${data?.checkout?.totalPrice}</p>
        </div>
        <div className="w-full flex justify-between py-3 px-12 text-slate-300 border-y border-slate-600">
          <p>Shipping Cost</p>
          <p>${data?.checkout?.shippingCost}</p>
        </div>
        <div className="w-full flex justify-between py-3 px-12 text-slate-300 bg-slate-700">
          <p>Grand Total</p>
          <p>${data?.checkout?.grandTotal}</p>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
