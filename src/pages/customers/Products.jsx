import React, { useEffect, useState } from "react";
import { fetchData } from "../../api/FetchData";
import { useQuery } from "react-query";
import ProductsFilter from "../../components/ProductsFilter";
import ProductCard from "../../components/ProductCard";
import ProductCardSkeleton from "../../skeleton/ProductCardSkeleton";
const Products = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [categoryArray, setCategoryArray] = useState([]);
  const [vendorArray, setVendorArray] = useState([]);
  const { data, isLoading, refetch } = useQuery(
    "all-products",
    () =>
      fetchData(
        `customer/products?categories=${JSON.stringify(
          categoryArray
        )}&vendors=${JSON.stringify(vendorArray)}`
      ),
    {
      refetchOnMount: false,
      staleTime: 30000,
    }
  );

  const { data: vendors } = useQuery(
    "vendors",
    () => fetchData("customer/products/vendor"),
    {
      staleTime: 30000,
    }
  );
  const { data: categories } = useQuery(
    "categories",
    () => fetchData("admin/category"),
    {
      staleTime: 30000,
    }
  );
  useEffect(() => {
    refetch();
  }, [categoryArray, refetch, vendorArray]);
  return (
    <div
      style={{
        height: "calc(100vh - 115px)",
      }}
      className={`relative flex flex-col flex-1 p-2 space-y-3 overflow-x-hidden ${
        openDrawer ? "overflow-y-hidden" : "overflow-y-scroll"
      } scroll lg:flex-row lg:space-x-3 lg:p-3 `}
    >
      <div
        onClick={() => setOpenDrawer(true)}
        className="border rounded-md cursor-pointer border-slate-700 w-fit lg:hidden"
      >
        <p className="px-3 py-1">Filters</p>
      </div>
      <div className="border border-slate-700   h-fit flex-col space-y-2 bg-slate-700 p-2  hidden   lg:flex w-[15rem]">
        <ProductsFilter
          categoryArray={categoryArray}
          setCategoryArray={setCategoryArray}
          data={categories}
          title={"Categories"}
        />
        <ProductsFilter
          categoryArray={vendorArray}
          setCategoryArray={setVendorArray}
          data={vendors}
          title={"Vendors"}
        />
      </div>
      <div className="flex flex-1 duration-300 ease-in-out translate-all lg:flex-1 ">
        <div className="grid w-full justify-items-center ms:grid-cols- sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4">
          {(data?.length === 0 || data === undefined) && !isLoading && (
            <p className=" text-4xl italic font-semibold text-center w-full grid col-span-5 justify-center items-center">
              No Products Found
            </p>
          )}
          {isLoading ? (
            Array.from({ length: 20 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))
          ) : (
            <>
              {data?.length !== 0 &&
                data?.map((product) => (
                  <ProductCard
                    key={product?._id}
                    title={product?.title}
                    picture={product?.picture}
                    salesPrice={product?.salesPrice}
                    regularPrice={product?.regularPrice}
                    productId={product?._id}
                    handleWishList={() => handleWishList(product?._id)}
                  />
                ))}
            </>
          )}
        </div>

        <div
          style={{
            height: "calc(100vh - 115px)",
            transition: "all 0.3s ease-in-out",
            transform: `${openDrawer ? "translateX(0%)" : "translateX(-100%)"}`,
          }}
          className="border-r border-slate-700  absolute  overflow-y-scroll scroll  lg:hidden  top-0 left-0 bg-[#202B3D] p-1  w-[16rem]"
        >
          <div className="transition-all my-2 border-b-2 border-slate-800/40 py-2  duration-300 ease-in-out  px-4 flex items-center justify-between   lg:hidden">
            <p className="text-lg font-semibold">Filters</p>
            <i
              onClick={() => setOpenDrawer(false)}
              className="text-lg cursor-pointer fa-solid w-8 h-8 border-2 rounded-full flex justify-center  fa-xmark"
            ></i>
          </div>
          <ProductsFilter
            categoryArray={categoryArray}
            setCategoryArray={setCategoryArray}
            data={categories}
            title={"Categories"}
          />
          <ProductsFilter
            categoryArray={vendorArray}
            setCategoryArray={setVendorArray}
            data={vendors}
            title={"Vendors"}
          />
        </div>
      </div>
    </div>
  );
};

export default Products;
