import { useState } from "react";

const ProductsFilter = ({ setCategoryArray, categoryArray, data, title }) => {
  const [expand, setExpand] = useState(true);
  // const handleClose = () => {
  //   setOpenDrawer(false);
  // };

  const handleChange = (category) => {
    if (categoryArray?.includes(category)) {
      setCategoryArray((prev) => prev.filter((c) => c !== category));
    } else {
      setCategoryArray((prev) => [...prev, category]);
    }
  };

  return (
    <div className="flex flex-col justify-end w-full my-2  h-fit">
      <div className="w-full transition-all duration-300 ease-in-out ">
        <div
          onClick={() => setExpand(!expand)}
          className="flex cursor-pointer items-center justify-between w-full px-2 rounded-md bg-slate-600 "
        >
          <p className="my-2 text-xl font-semibold">{title}</p>
          <i
            className={`fa-solid ${expand ? "fa-angle-up" : "fa-angle-down"}`}
          ></i>
        </div>
        <div>
          <div
            // style={{
            //   height: `${expand ? "fit-content " : "0rem"}`,
            //   opacity: `${expand ? "1" : "0"}`,
            //   // transition: "all 0.3s ease-linear",
            // }}
            className={`  bg-[#23334de8] ${
              expand ? "h-full  " : "h-0 "
            } duration-200  `}
          >
            <div
              className={`${
                expand ? "opacity-100" : "opacity-0"
              } duration-200 transition-opacity space-y-2  p-1`}
            >
              {data?.map((category) => (
                <div
                  className="flex items-center my-1 space-x-4"
                  key={category?._id}
                >
                  <input
                    type="checkbox"
                    className="cursor-pointer"
                    onChange={() => handleChange(category?.name)}
                    checked={categoryArray?.includes(category?.name)}
                  />
                  <p className="font-normal text-lg">{category?.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsFilter;
