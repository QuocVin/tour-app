import DashboardPage from "../pages/Dashboard";
import HomeIcon from "@material-ui/icons/Home";

import CustomerPage from "../pages/Customer";
import PeopleIcon from '@material-ui/icons/People';
import InfoCusPage from "../pages/CustomerDetail";
import CreateCusPage from "../pages/CustomerNew";

import EmployeePage from "../pages/Employee";
import PersonIcon from '@material-ui/icons/Person';
import EmpNewPage from "../pages/EmployeeNew";
import EmpDetailPage from "../pages/EmployeeDetail";

import ManageTourPage from "../pages/AdminTour";
import PermMediaIcon from '@material-ui/icons/PermMedia';
import ManageTourNewPage from "../pages/AdminTourNew";
import ManageTourDetailPage from "../pages/AdminTourDetail";

import ManageNewsPage from "../pages/AdminNews";
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import ManageNewsCrePage from "../pages/AdminNewsCre";
import ManageNewsDetailPage from "../pages/AdminNewsDetail";



const NEDRoutes = {
    New: "new",
    Detail: ":id"
}

export const ProtectRouteNames = {
    Dashboard: 'Admin',
    Customer: 'Customer',
    CustomerNew: 'CustomerNew',
    CustomerDetail: 'CustomerDetail',

    Employee: 'Employee',
    EmployeeNew: 'EmployeeNew',
    EmployeeDetail: 'EmployeeDetail',

    Tour: 'Tour',
    TourNew: 'TourNew',
    TourDetail: 'ManageTourDetail',

    NewsTour: 'NewsTour',
    NewsTourCre: 'NewsTourCre',
    NewsTourDetail: 'ManageNewsDetail',

}

export const AllRouteNames = {
    ...ProtectRouteNames
}

export const AdminPaths = {
    Dashboard: ['', ProtectRouteNames.Dashboard].join('/'),
    Customer: ['/Admin', ProtectRouteNames.Customer].join('/'),
    CustomerNew: ['/Admin', ProtectRouteNames.Customer, NEDRoutes.New].join('/'),
    CustomerDetail: ['/Admin', ProtectRouteNames.Customer, NEDRoutes.Detail].join('/'),
    Employee: ['/Admin', ProtectRouteNames.Employee].join('/'),
    EmployeeNew: ['/Admin', ProtectRouteNames.Employee, NEDRoutes.New].join('/'),
    EmployeeDetail: ['/Admin', ProtectRouteNames.Employee, NEDRoutes.Detail].join('/'),

    Tour: ['/Admin', ProtectRouteNames.Tour].join('/'),
    TourNew: ['/Admin', ProtectRouteNames.TourNew, NEDRoutes.New].join('/'),
    TourDetail: ['/Admin', ProtectRouteNames.TourDetail, NEDRoutes.Detail].join('/'),

    NewsTour: ['/Admin', ProtectRouteNames.NewsTour].join('/'),
    NewsTourCre: ['/Admin', ProtectRouteNames.NewsTourCre, NEDRoutes.New].join('/'),
    NewsTourDetail: ['/Admin', ProtectRouteNames.NewsTourDetail, NEDRoutes.Detail].join('/'),

}

// t???t c??? c??c route trong protect
export const ProtectRoutes = {
    Dashboard: {
        exact: true,
        id: ProtectRouteNames.Dashboard,
        label: "Trang qu???n tr???",
        path: AdminPaths.Dashboard,
        component: DashboardPage,
        icon: HomeIcon
    },
    Employee: {
        exact: true,
        id: ProtectRouteNames.Employee,
        label: "Qu???n tr??? nh??n s???",
        path: AdminPaths.Employee,
        component: EmployeePage,
        icon: HomeIcon
    },
    EmployeeNew: {
        exact: true,
        id: ProtectRouteNames.EmployeeNew,
        label: "EmployeeNew",
        path: AdminPaths.EmployeeNew,
        component: EmpNewPage,
        icon: HomeIcon
    },
    EmployeeDetail: {
        exact: true,
        id: ProtectRouteNames.EmployeeDetail,
        label: "EmployeeDetail",
        path: AdminPaths.EmployeeDetail,
        component: EmpDetailPage,
        icon: HomeIcon
    },
    Customer: {
        exact: true,
        id: ProtectRouteNames.Customer,
        label: "Qu???n tr??? kh??ch h??ng",
        path: AdminPaths.Customer,
        component: CustomerPage,
        icon: HomeIcon
    },
    CustomerNew: {
        exact: true,
        id: ProtectRouteNames.CustomerNew,
        label: "Customer new",
        path: AdminPaths.CustomerNew,
        component: CreateCusPage,
        icon: HomeIcon
    },
    CustomerDetail: {
        exact: true,
        id: ProtectRouteNames.CustomerDetail,
        label: "Info Customer",
        path: AdminPaths.CustomerDetail,
        component: InfoCusPage,
        icon: HomeIcon
    },
    Tour: {
        exact: true,
        id: ProtectRouteNames.Tour,
        label: "Qu???n tr??? tour",
        path: AdminPaths.Tour,
        component: ManageTourPage,
        icon: HomeIcon
    },
    TourNew: {
        exact: true,
        id: ProtectRouteNames.TourNew,
        label: "TourNew",
        path: AdminPaths.TourNew,
        component: ManageTourNewPage,
        icon: HomeIcon
    },
    TourDetail: {
        exact: true,
        id: ProtectRouteNames.TourDetail,
        label: "TourDetail",
        path: AdminPaths.TourDetail,
        component: ManageTourDetailPage,
        icon: HomeIcon
    },
    NewsTour: {
        exact: true,
        id: ProtectRouteNames.NewsTour,
        label: "Qu???n tr??? b??i vi???t",
        path: AdminPaths.NewsTour,
        component: ManageNewsPage,
        icon: HomeIcon
    },
    NewsTourCre: {
        exact: true,
        id: ProtectRouteNames.NewsTourCre,
        label: "NewsTourCre",
        path: AdminPaths.NewsTourCre,
        component: ManageNewsCrePage,
        icon: HomeIcon
    },
    NewsTourDetail: {
        exact: true,
        id: ProtectRouteNames.NewsTourDetail,
        label: "NewsTourDetail",
        path: AdminPaths.NewsTourDetail,
        component: ManageNewsDetailPage,
        icon: HomeIcon
    },
}

// c??c route hi???n tr??n drawer cho admin
export const ProtectRoutesDrawer = {
    Dashboard: {
        exact: true,
        id: ProtectRouteNames.Dashboard,
        label: "Trang qu???n tr???",
        path: AdminPaths.Dashboard,
        component: DashboardPage,
        icon: HomeIcon
    },
    Employee: {
        exact: true,
        id: ProtectRouteNames.Employee,
        label: "Qu???n tr??? nh??n s???",
        path: AdminPaths.Employee,
        component: EmployeePage,
        icon: PersonIcon
    },
    Customer: {
        exact: true,
        id: ProtectRouteNames.Customer,
        label: "Qu???n tr??? kh??ch h??ng",
        path: AdminPaths.Customer,
        component: CustomerPage,
        icon: PeopleIcon
    }, Tour: {
        exact: true,
        id: ProtectRouteNames.Tour,
        label: "Qu???n tr??? tour",
        path: AdminPaths.Tour,
        component: ManageTourPage,
        icon: PermMediaIcon
    },
    NewsTour: {
        exact: true,
        id: ProtectRouteNames.NewsTour,
        label: "Qu???n tr??? b??i vi???t",
        path: AdminPaths.NewsTour,
        component: ManageNewsPage,
        icon: LibraryBooksIcon
    },
}

// c??c route hi???n tr??n drawer cho nh??n vi??n
export const EmpRoutesDrawer = {
    Customer: {
        exact: true,
        id: ProtectRouteNames.Customer,
        label: "Qu???n tr??? kh??ch h??ng",
        path: AdminPaths.Customer,
        component: CustomerPage,
        icon: PeopleIcon
    }, Tour: {
        exact: true,
        id: ProtectRouteNames.Tour,
        label: "Qu???n tr??? tour",
        path: AdminPaths.Tour,
        component: ManageTourPage,
        icon: PermMediaIcon
    },
    NewsTour: {
        exact: true,
        id: ProtectRouteNames.NewsTour,
        label: "Qu???n tr??? b??i vi???t",
        path: AdminPaths.NewsTour,
        component: ManageNewsPage,
        icon: LibraryBooksIcon
    },
}

// c??c route cho ph??p nh??n vi??n truy c???p trong protet
export const EmployeeRoutes = {
    EmployeeDetail: {
        exact: true,
        id: ProtectRouteNames.EmployeeDetail,
        label: "EmployeeDetail",
        path: AdminPaths.EmployeeDetail,
        component: EmpDetailPage,
        icon: HomeIcon
    },
    Customer: {
        exact: true,
        id: ProtectRouteNames.Customer,
        label: "Qu???n tr??? kh??ch h??ng",
        path: AdminPaths.Customer,
        component: CustomerPage,
        icon: HomeIcon
    },
    CustomerNew: {
        exact: true,
        id: ProtectRouteNames.CustomerNew,
        label: "Customer new",
        path: AdminPaths.CustomerNew,
        component: CreateCusPage,
        icon: HomeIcon
    },
    CustomerDetail: {
        exact: true,
        id: ProtectRouteNames.CustomerDetail,
        label: "Info Customer",
        path: AdminPaths.CustomerDetail,
        component: InfoCusPage,
        icon: HomeIcon
    },
    Tour: {
        exact: true,
        id: ProtectRouteNames.Tour,
        label: "Qu???n tr??? tour",
        path: AdminPaths.Tour,
        component: ManageTourPage,
        icon: HomeIcon
    },
    TourNew: {
        exact: true,
        id: ProtectRouteNames.TourNew,
        label: "TourNew",
        path: AdminPaths.TourNew,
        component: ManageTourNewPage,
        icon: HomeIcon
    },
    TourDetail: {
        exact: true,
        id: ProtectRouteNames.TourDetail,
        label: "TourDetail",
        path: AdminPaths.TourDetail,
        component: ManageTourDetailPage,
        icon: HomeIcon
    },
    NewsTour: {
        exact: true,
        id: ProtectRouteNames.NewsTour,
        label: "Qu???n tr??? b??i vi???t",
        path: AdminPaths.NewsTour,
        component: ManageNewsPage,
        icon: HomeIcon
    },
    NewsTourCre: {
        exact: true,
        id: ProtectRouteNames.NewsTourCre,
        label: "NewsTourCre",
        path: AdminPaths.NewsTourCre,
        component: ManageNewsCrePage,
        icon: HomeIcon
    },
    NewsTourDetail: {
        exact: true,
        id: ProtectRouteNames.NewsTourDetail,
        label: "NewsTourDetail",
        path: AdminPaths.NewsTourDetail,
        component: ManageNewsDetailPage,
        icon: HomeIcon
    },
}