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

export default function ({ classes, open, setOpen, mainRef }) {
    const trigger = useScrollTrigger({ target: mainRef });
    const history = useHistory();
    const store = useStore();
    const auth = store.getState();

    let user = auth;
    if (cookies.load("user") != null) {
        user = cookies.load("user")
    };
    
    const signOut = () => {
        clearAuthLS();
    }

    const handleLogout_click = () => {
        cookies.remove("user");
        cookies.remove("access_token");
        signOut();
        history.push('/');
        // window.location.reload();
    };

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
                    <div className="block-left">
                        <IconButton
                            size="small"
                            className="menu-icon"
                            onClick={() => setOpen((pre) => !pre)}
                        >
                            {open ? <ArrowBackIosIcon /> : <MenuIcon />}
                        </IconButton>
                        <Button>
                            <Typography variant="h5" noWrap className="logo-text" onClick={() => handleLogin_click('/')}>
                                NHU TRANG TOUR
                            </Typography>
                        </Button>
                    </div>

                    <div className="block-right " >
                        {userComponet}
                    </div>
                </Toolbar>
            </AppBar>
        </Slide>
    );
}