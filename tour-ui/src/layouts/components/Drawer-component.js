import {
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Avatar,
    Typography,
} from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import { ProtectRoutes, ProtectRoutesDrawer, EmpRoutesDrawer } from "../../routes/protect-route"
import { useStore } from "react-redux";
import cookies from 'react-cookies';
import API, { endpoints } from '../../helpers/API';
import { getAuthLS, LS_KEY } from '../../helpers/localStorage';

const rolePaths = {
    EMPLOYEE: 'NHAN VIEN',
    ADMIN: 'QUAN LY',
}

export default function ({ classes, open }) {
    const check = getAuthLS(LS_KEY.AUTH_TOKEN)
    const history = useHistory();
    // if (check === rolePaths.EMPLOYEE) {
    //     const [childDrawer, setChildDrawer] = React.useState(
    //         Object.values(EmpRoutesDrawer)
    //     ); 
    // }
    // if (check === rolePaths.ADMIN) {
    //     const [childDrawer, setChildDrawer] = React.useState(
    //         Object.values(ProtectRoutesDrawer)
    //     );
    // }
    const [childDrawer, setChildDrawer] = React.useState(
        Object.values(ProtectRoutesDrawer)
    );

    const store = useStore();
    const auth = store.getState();
    let user = auth;
    if (cookies.load("user") != null) {
        user = cookies.load("user")
    };

    // chọn avatar chuyển trang
    const handleGoProfile = (userId) => {
        const _pathAPI = endpoints['user'] + endpoints['employee'] + `?id=${userId}`;
        API.get(_pathAPI).then(res => {
            const _pathPage = ProtectRoutes.EmployeeDetail.path.replace(":id", userId)
            history.push(_pathPage, {
                userId: res.data[0].id,
            })
        })
    }

    // chọn mục trên drawer
    const handleItem_click = ({ id, path }) => {
        if (id === "back") {
            const latest = history.location.pathname.split("/").pop();
            history.replace(history.location.pathname.replace(`/${latest}`, ""));
        } else if (path) {
            history.push(path);
        } else {
            history.goBacK();
        }
    };

    return (
        <Drawer
            className={classes.drawer}
            anchor="left"
            variant="persistent"
            open={open}
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <Toolbar />
            <div className={classes.drawerContainer}>
                {/* <Avatar alt={user.username} className={classes.avatar} onClick={() => handleGoProfile(user.id)}
                    src={user.avatar.includes('http://127.0.0.1:8000') ? user.avatar : `http://127.0.0.1:8000${user.avatar}`} />
                <div className={classes.role} >
                    <Typography variant="body">{user.role}</Typography>
                </div> */}
                <List>
                    {childDrawer.map((route, idx) => {
                        const icon = route.bigIcon ? (
                            <route.bigIcon
                                fill="#3f51b5"
                                stroke="#3f51b5"
                                width={24}
                                height={24}
                            />
                        ) : (
                            <route.icon color="primary" />
                        );

                        return (
                            <div key={route.id + idx}>
                                <ListItem button onClick={() => handleItem_click(route)} >
                                    <ListItemIcon>{icon}</ListItemIcon>
                                    <ListItemText primary={route.label} />
                                </ListItem>
                                <Divider />
                            </div>
                        );
                    })}
                </List>
            </div>
        </Drawer>
    );

}

