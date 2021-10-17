import DashboardPage from "../pages/Dashboard";
import HomeIcon from "@material-ui/icons/Home";

import CustomerPage from "../pages/Customer";
import InfoCusPage from "../pages/CustomerDetail";
import CreateCusPage from "../pages/CustomerNew";

import EmployeePage from "../pages/Employee";
import EmpNewPage from "../pages/EmployeeNew";
import EmpDetailPage from "../pages/EmployeeDetail";

import ManageTourPage from "../pages/AdminTour";
import ManageTourNewPage from "../pages/AdminTourNew";

import ManageNewsPage from "../pages/AdminNews";
import ManageNewsCrePage from "../pages/AdminNewsCre";
import NewsTourDetailPage from "../pages/AdminNewsDetail";



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

    NewsTour: 'NewsTour',
    NewsTourCre: 'NewsTourCre',
    NewsTourDetail: 'NewsTourDetail',

}

export const AllRouteNames = {
    ...ProtectRouteNames
}

export const AdminPaths = {
    Dashboard: ['', ProtectRouteNames.Dashboard].join('/'),
    Customer: ['', ProtectRouteNames.Customer].join('/'),
    CustomerNew: ['', ProtectRouteNames.Customer, NEDRoutes.New].join('/'),
    CustomerDetail: ['', ProtectRouteNames.Customer, NEDRoutes.Detail].join('/'),
    Employee: ['', ProtectRouteNames.Employee].join('/'),
    EmployeeNew: ['', ProtectRouteNames.Employee, NEDRoutes.New].join('/'),
    EmployeeDetail: ['', ProtectRouteNames.Employee, NEDRoutes.Detail].join('/'),
    Tour: ['', ProtectRouteNames.Tour].join('/'),
    TourNew: ['', ProtectRouteNames.TourNew, NEDRoutes.New].join('/'),
    // TourDetail: ['', ProtectRouteNames.Employee, NEDRoutes.Detail].join('/'),

    NewsTour: ['', ProtectRouteNames.NewsTour].join('/'),
    NewsTourCre: ['', ProtectRouteNames.NewsTourCre, NEDRoutes.New].join('/'),
    NewsTourDetail: ['', ProtectRouteNames.NewsTourDetail, NEDRoutes.Detail].join('/'),

}

export const ProtectRoutes = {
    Dashboard: {
        exact: true,
        id: ProtectRouteNames.Dashboard,
        label: "Dashboard",
        path: AdminPaths.Dashboard,
        component: DashboardPage,
        icon: HomeIcon
    },
    Customer: {
        exact: true,
        id: ProtectRouteNames.Customer,
        label: "Customer",
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
    Employee: {
        exact: true,
        id: ProtectRouteNames.Employee,
        label: "Employee",
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
    Tour: {
        exact: true,
        id: ProtectRouteNames.Tour,
        label: "Tour",
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

    NewsTour: {
        exact: true,
        id: ProtectRouteNames.NewsTour,
        label: "NewsTour",
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
        component: NewsTourDetailPage,
        icon: HomeIcon
    },
}