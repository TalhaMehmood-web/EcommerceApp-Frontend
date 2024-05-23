import React from "react";

const Table = ({ header, data }) => {
  return (
    <div className="relative overflow-x-auto scroll">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 table-auto scroll">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {header?.map((head, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-3 whitespace-nowrap"
              >
                {head.head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.map((item, index) => (
            <tr
              key={item?._id}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            >
              {header?.map((head, rowIndex) => (
                <td key={item?._id + rowIndex} className="px-6 py-2">
                  {typeof item[head.field] === "string" &&
                  item[head.field].includes("http") ? (
                    <img
                      className="w-12 h-12 border border-slate-700 rounded-md p-1"
                      src={item[head.field]}
                      alt=""
                    />
                  ) : (
                    <p className="whitespace-nowrap">{item[head.field]}</p>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
