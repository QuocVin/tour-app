import DashboardPage from "../pages/Dashboard";
import HomeIcon from "@material-ui/icons/Home";

import CustomerPage from "../pages/Customer";
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
    Employee: ['', ProtectRouteNames.Employee].join('/'),


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
    Employee: {
        exact: true,
        id: ProtectRouteNames.Employee,
        label: "Employee",
        path: AdminPaths.Employee,
        component: EmployeePage,
        icon: HomeIcon
    },
}