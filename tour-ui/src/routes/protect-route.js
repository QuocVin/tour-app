import DashboardPage from "../pages/Dashboard";
import HomeIcon from "@material-ui/icons/Home";

import CustomerPage from "../pages/Customer";
import CreateCusPage from "../pages/CustomerDetail";

import EmployeePage from "../pages/Employee";


const NEDRoutes = {
    New: "new",
    Detail: ":id"
}

export const ProtectRouteNames = {
    Dashboard: 'Admin',
    Customer: 'Customer',
    Employee: 'Employee',


}

export const AllRouteNames = {
    ...ProtectRouteNames
}

export const AdminPaths = {
    Dashboard: ['', ProtectRouteNames.Dashboard].join('/'),
    Customer: ['', ProtectRouteNames.Customer].join('/'),
    CustomerDetail: ['', ProtectRouteNames.Customer, NEDRoutes.Detail].join('/'),
    CustomerNew: ['', ProtectRouteNames.Customer, NEDRoutes.New].join('/'),
    Employee: ['', ProtectRouteNames.Employee].join('/'),
    EmployeeDetail: ['', ProtectRouteNames.Employee, NEDRoutes.Detail].join('/'),
    EmployeeNew: ['', ProtectRouteNames.Employee, NEDRoutes.New].join('/'),

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
    // CustomerDetail: {
    //     exact: true,
    //     id: ProtectRouteNames.Customer,
    //     label: "Customer",
    //     path: AdminPaths.Customer,
    //     component: CustomerPage,
    //     icon: HomeIcon
    // },
    CustomerNew: {
        exact: true,
        id: ProtectRouteNames.Customer + 'new',
        label: "New customer",
        path: AdminPaths.CustomerNew,
        component: CreateCusPage,
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
}