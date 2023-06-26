import React, { useEffect, useState } from 'react'

import { useHasPermission } from '../../hook/permissiondHook';
import { deleteCartService, getAllCartsService } from '../../services/cart';
import { Alert, Confirm } from '../../layouts/admin/utils/alert';
import { Actions } from './additionalTable/Actions';
import AddButtonLink from '../../components/form/AddButtunLink';
import { Outlet } from 'react-router-dom';
import { PaginateDataTable } from '../../components/PaginateDataTable';

export const CartTable = () => { 
  const hasPerm = useHasPermission("create_cart");
const [EditeUserId, setEditeUserId] = useState(null);
const [curentPage, setCurentPage] = useState(1); //صفحه حاضر
const [pagesCount, setPagesCount] = useState(0); //کل صفحات
const [countOnPage, setCountOnPage] = useState(20);
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);
const [forceRender, setForceRender] = useState(false);
const [searchChar, setSearchChar] = useState("");
 useEffect(() => {
  getAllUsers(curentPage, countOnPage, searchChar);
}, []);

const getAllUsers = async (page, count, char) => {
  try {
    setLoading(true);
    const res = await getAllCartsService(page, count, char);
    if ((res.status = 200)) setData(res.data.data);
   
  } catch (err) {
  } finally {
    setLoading(false);
  }
};

const handleDeleteCart = async (itemId) => {
  if (await Confirm("حذف", "آیا از حذف مطمین هستید؟")) {
    try {
      const res = await deleteCartService(itemId);
      if (res.status === 200) {
        Alert("انجام شد", res.data.message, "success");
        getAllUsers(curentPage, countOnPage, searchChar);
      }
    } catch (err) {}
  }
};
const handelSearch = async (char) => {
  setSearchChar(char);
  getAllUsers(1, countOnPage, char);
};
const searchParams = {
  title: "جستجو",
  placeholdert: "قسمتی از شماره تماس را وارد نمایید",
  searchField: "user.phone",
};

const dataInf = [
  { field: "id", title: "#" },
  {
    field: null,
    title: "نام",
    elements: (item) => `${item.user.first_name || ""} ${item.user.last_name || ""}`,
  },
  {
    field: null,
    title: "شماره همراه",
    elements: (item) => `${item.user.phone || ""} `,
  },
  // { field: "phone", title: "شماره تلفن" },
  // { field: "email", title: "ایمیل" },


  // {
  //   field: null,
  //   title: "جنسیت",
  //   elements: (item) => (item.gender ? "آقا" : "خانم"),
  // },
  {
    field: null,
    title: "عملیات",
    elements: (item) => (
      <Actions item={item} handleDeleteCart={handleDeleteCart} />
    ),
  },
];
return (
  <>
  { console.log(data)}
  <PaginateDataTable
    initData={data}
    dataInf={dataInf}
    searchParams={searchParams}
    loading={loading}
    pagesCount={pagesCount}
    curentPage={curentPage}
    setCurentPage={setCurentPage}
    handelSearch={handelSearch}
  >
    { hasPerm && <>
    <AddButtonLink href="/carts/add-cart" />
    <Outlet context={{ setData }} />
    </>}
  </PaginateDataTable>
</>
)
}
