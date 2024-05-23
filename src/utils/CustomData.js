export const inventoryArray = [
    {
        title: "Pricing",
        icon: "fa-tag",
    },
    {
        title: "Restock",
        icon: "fa-cube",
    },
    {
        title: "Shipping",
        icon: "fa-truck",
    },
    {
        title: "Global Delivery",
        icon: "fa-globe",
    },
    {
        title: "Attributes",
        icon: "fa-sliders",
    },
];
export const deliveryArray = [
    {
        title: "World Wide Delivery",
        render: "Only available with Shipping method :",
        span: " Fulfilled by Phoenix"
    },
    {
        title: "Selected Countries",
        render: "FormInput",
        span: null
    },
    {
        title: "Local Delivery",
        render: "Deliver to your country of residence ",
        span: "Change profile address"
    }
]
export const PRODUCTS_COLUMNS = [
    {
        Header: "Sr. No",
        accessor: (_, index) => index + 1,
        disableFilters: false
    },
    {
        Header: "Product Name",
        accessor: "title"
    },
    {
        Header: "Picture",
        accessor: "picture"
    },
    {
        Header: "Price",
        accessor: "salesPrice"
    },
    {
        Header: "Category",
        accessor: "categoryTitle"
    },
    {
        Header: "Tags",
        accessor: "tags"
    },
    {
        Header: "Vendor",
        accessor: "vendor"
    },
    {
        Header: "Published On",
        accessor: "createdAt"
    }
];
export const CUSTOMERS_COLUMNS = [
    {
        Header: "Sr. No",
        accessor: (_, index) => index + 1,
        disableFilters: false
    },
    {
        Header: "Picture",
        accessor: "picture"
    },
    {
        Header: "Customer Name",
        accessor: "name"
    },
    {
        Header: "Email",
        accessor: "email"
    },
    {
        Header: "Country",
        accessor: "country"
    },
    {
        Header: "City",
        accessor: "city"
    },
    {
        Header: "Total Spent",
        accessor: "totalSpent"
    },
    {
        Header: "Orders",
        accessor: "orders"
    },
    {
        Header: "Last Order",
        accessor: "lastOrderDate"
    }
];
export const CUSTOMER_ROUTES = [
    {
        title: "Home",
        navigate: "/customer/home"
    },
    {
        title: "Products",
        navigate: "/customer/products"
    },
    {
        title: "Wishlist",
        navigate: "/customer/wishlist"
    },
    {
        title: "Carts",
        navigate: "/customer/carts"
    },
    {
        title: "Shipping Info",
        navigate: "/customer/shipping-info"
    },
    {
        title: "Checkout",
        navigate: "/customer/checkout"
    },
    {
        title: "Orders",
        navigate: "/customer/orders"
    },
    {
        title: "Track Order",
        navigate: "/customer/track-order"
    },
    {
        title: "Chats",
        navigate: "/customer/chats"
    },

]
export const WISHLIST_TABLE_DATA = [
    {
        header: "Picture",
        field: "picture",
    },
    {
        header: "Product Name",
        field: "title",
    },
    {
        header: "Regular Price",
        field: "regularPrice",
    },
    {
        header: "Sales Price",
        field: "salesPrice",
    },
    {
        header: "Category",
        field: "categoryTitle",
    },
    {
        header: "Stock Quantity",
        field: "stockQuantity",
    },
    {
        header: "Delete",
        field: "icon",
    },
    {
        header: "Add To Cart",
        field: "button",
    },
];
export const PRODUCT_DETAILS_DATA = [
    {
        title: "Description",
        route: "description"
    },
    {
        title: "Review and Rating",
        route: "ratings"
    }
]
export const CARTS_TABLE = [

    {
        head: "Picture",
        field: "picture"
    },
    {
        head: "Product Name",
        field: "productTitle"
    },
    {
        head: "$ Price",
        field: "regularPrice"
    },
    {
        head: "Quantity",
        field: "quantity"
    },
    {
        head: "$ Total Price",
        field: "totalPrice"
    }, {
        head: "Delete",
        field: "delete-icon"
    }, {
        head: "Edit",
        field: "edit-icon"
    },

]
export const DELIVERY_OPTIONS = [
    {
        name: "free-shipping",
        title: "Free Shipping",
        price: 0,
        footer: "Get Free Shipped products in Time!",
    },
    {
        name: "standard-shipping",
        title: "Standard Shipping",
        price: 10,
        footer: "Get timely delivery with economy shipping.",
    },
    {
        name: "two-days-shipping",
        title: "Two Days Shipping",
        price: 20,
        footer: "Everything faster with minimum shipping fee.",
    },
    {
        name: "one-day-shipping",
        title: "One Day Shipping",
        price: 30,
        footer: "Highest priority shipping at the lowest cost.",
    },
];
export const PAYMENT_OPTIONS = [
    "Visa",
    "Discover",
    "MasterCard",
    "American Express",
    "Debit Card",
    "Credit Card",
];

export const CHECKOUT_TABLE_DATA = [
    {
        head: "",
        field: "checkbox",
    },
    {
        head: "Picture",
        field: "picture"
    },
    {
        head: "Product Name",
        field: "productTitle"
    },
    {
        head: "Quantity",
        field: "quantity"
    },
    {
        head: "$ Total Price",
        field: "totalPrice"
    }
]
export const ORDER_TABLE_DATA = [
    {
        head: "Order No.",
        field: "orderNumber",
        prefix: "#"
    },
    {
        head: "Invoice Number",
        field: "invoiceNo",
        prefix: ""
    }, {
        head: "Delivery Type",
        field: "deliveryType",
        prefix: ""
    },
    {
        head: "Shipping Cost",
        field: "shippingCost",
        type: "number",
        prefix: ""
    }, {
        head: "Payment Status",
        field: "paymentStatus",
        prefix: ""
    },
    {
        head: "Order Status",
        field: "orderStatus",
        prefix: ""
    },
    {
        head: "Total Cost",
        field: "total",
        type: "number",
        prefix: ""
    },
    {
        head: "Placed On",
        field: "createdAt",
        prefix: ""
    }, {
        head: "Invoice",
        field: "invoice",
        // prefix: ""
    }, {
        head: "Track Order",
        field: "trackOrder",

    }
]
export const INVOICE_TABLE_DATA = [
    {
        head: "Sr No",
        field: "Sr No"
    },
    {
        head: "Picture",
        field: "productPicture",
    },
    {
        head: "Product Title",
        field: "productTitle",
    },

    {
        head: "Vendor",
        field: "vendor"
    },
    {
        head: "Quantity",
        field: "quantity",
    },
    {
        head: "$Price",
        field: "regularPrice",
    }, {
        head: "$Total",
        field: "itemsTotal"
    }

]
export const ADMIN_ORDER_TABLE_DATA = [
    {
        head: "Order",
        field: "orderNumber"
    },
    {
        head: "$ Total",
        field: "total",
    },
    {
        head: "Customer",
        field: "customerName",
    },
    {
        head: "Profile Picture",
        field: "picture",
    },
    {
        head: "Payment Status",
        field: "paymentStatus",
    }, {
        head: "Order Status",
        field: "orderStatus"
    }
    , {
        head: "Delivery Type",
        field: "deliveryType"
    }
    , {
        head: "Date/Time",
        field: "date"
    }, {
        head: "Update Status",
        field: "status"
    }

]
export const TRACK_ORDER_DATA = [
    {
        head: "Order ID",
        field: "orderNumber",

    },
    {
        head: "Total Products",
        field: "totalProducts",

    },
    {
        head: "Total Quantity",
        field: "totalQuantity",

    },
    {
        head: "Total Price (dollars)",
        field: "totalPrice",


    },
    {
        head: "Placed At ",
        field: "createdAt",

    },

]