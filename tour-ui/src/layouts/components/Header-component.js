import {
    AppBar,
    IconButton,
    Toolbar,
    Typography,
    Slide,
    useScrollTrigger,
    Button,
    Avatar,
} from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router";
import MenuIcon from "@material-ui/icons/Menu";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos"
import { useStore } from "react-redux";
import cookies from 'react-cookies';
import { clearAuthLS } from '../../helpers/localStorage'
import { getAuthLS, LS_KEY } from '../../helpers/localStorage';

const rolePaths = {
    EMPLOYEE: 'NHAN VIEN',
    ADMIN: 'QUAN LY',
}
export default function ({ classes, open, setOpen, mainRef }) {
    const trigger = useScrollTrigger({ target: mainRef });
    const history = useHistory();
    const store = useStore();
    const auth = store.getState();

    // const check = 'KHACH';
    const check = getAuthLS(LS_KEY.AUTH_TOKEN)

    //   xử lý ẩn hiện btn drawer
    const hiddenBtn = (check) => {
        if (check === rolePaths.EMPLOYEE || check === rolePaths.ADMIN) {
            return (
                <div className="block-left">
                    <IconButton
                        size="small"
                        className="menu-icon"
                        onClick={() => setOpen((pre) => !pre)}
                    >
                        {open ? <ArrowBackIosIcon /> : <MenuIcon />}
                    </IconButton>

                    <Button>
                        <Typography variant="h5" noWrap className="logo-text" onClick={() => handleLogin_click('/Admin/NewsTour')}>
                            MANAGE TOUR
                        </Typography>
                    </Button>
                </div>
            );
        } else
            return (
                <div className="block-left">
                    <Button>
                        <Typography variant="h5" noWrap className="logo-text" onClick={() => handleLogin_click('/')}>
                            NHU TRANG TOUR
                        </Typography>
                    </Button>
                </div >
            );
    }

    let user = auth;
    if (cookies.load("user") != null) {
        user = cookies.load("user")
    };

    // xóa token tại localStorage khi đăng xuất
    const signOut = () => {
        clearAuthLS();
    }

    // chọn đăng xuất
    const handleLogout_click = () => {
        cookies.remove("user");
        cookies.remove("access_token");
        signOut();
        history.push('/');
        // window.location.reload();
    };

    // chuyển trang khi chọn đăng nhập
    const handleLogin_click = (path) => {
        history.push(path);
    }

    let userComponet = <>
        <Button onClick={() => handleLogin_click('/Login')} > <Typography variant="subtitle1" style={{ textTransform: 'none' }}>Đăng nhập</Typography> </Button>
        <Button onClick={() => handleLogin_click('/Register')} > <Typography variant="subtitle1" style={{ textTransform: 'none' }}>Đăng Ký</Typography> </Button>
    </>
    if (user != null) {
        if (user.username != null)
            userComponet = <>
                <Button>
                    <Avatar onClick={() => handleLogin_click('/Profile')} alt={user.username}
                        src={user.avatar.includes('http://127.0.0.1:8000') ? user.avatar : `http://127.0.0.1:8000${user.avatar}`} />
                </Button>
                <Button onClick={handleLogout_click}> <Typography variant="subtitle1" style={{ textTransform: 'none' }}>Đăng xuất</Typography> </Button>
            </>
    }

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    {hiddenBtn(check)}

                    <div className="block-right " >
                        {userComponet}
                    </div>
                </Toolbar>
            </AppBar>
        </Slide>
    );
}