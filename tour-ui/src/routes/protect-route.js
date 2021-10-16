import DashboardPage from "../pages/Dashboard";
import HomeIcon from "@material-ui/icons/Home";

import CustomerPage from "../pages/Customer";
import InfoCusPage from "../pages/CustomerDetail";
import CreateCusPage from "../pages/CustomerNew";

import EmployeePage from "../pages/Employee";
import EmpNewPage from "../pages/EmployeeNew";
import EmpDetailPage from "../pages/EmployeeDetail";


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
    CustomerDetail: {
        exact: true,
        id: ProtectRouteNames.CustomerDetail,
        label: "Info Customer",
        path: AdminPaths.CustomerDetail,
        component: InfoCusPage,
        icon: HomeIcon
    },
    // CustomerNew: {
    //     exact: true,
    //     id: ProtectRouteNames.CustomerNew,
    //     label: "Customer new",
    //     path: AdminPaths.CustomerNew,
    //     component: DashboardPage,
    //     icon: HomeIcon
    // },
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
        label: "Employee",
        path: AdminPaths.EmployeeDetail,
        component: EmpDetailPage,
        icon: HomeIcon
    },
}