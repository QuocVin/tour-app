import React, { createRef, useEffect, useState } from 'react';
import {
    Button,
    CssBaseline,
    TextField,
    Grid,
    Typography,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Snackbar,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { useStyles } from './CustomerNew-styles';
import API, { endpoints } from '../../helpers/API';
import useSubmitForm from '../../helpers/CustomHooks'
import { useHistory } from 'react-router';
import { ProtectRoutes } from '../../routes/protect-route';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


export default function CreateCustomer() {
    const classes = useStyles();
    const avatar = createRef();
    const history = useHistory()

    const [open, setOpen] = useState(false);
    const [openError, setOpenError] = useState(false);

    // api post tạo mới người dùng
    const create = async () => {
        const formData = new FormData();

        if (inputs.password === inputs.confirm_password) {
            for (let k in inputs) {
                if (k !== "confirm_password") formData.append(k, inputs[k]);
            }
        } else
            setOpenError(true)

        if (avatar.current.files.length != 0) {
            formData.append("avatar", avatar.current.files[0]);
        }
        formData.append("role", "NGUOI DUNG");

        for (var key of formData.keys()) {
            console.log(key, formData.get(key));
        }
        try {
            let res = await API.post(endpoints["user"], formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.info("res:", res)
            if (res)
                setOpen(true);
        } catch (err) {
            console.log("ERROR:\n", err);
        }
    };

    const { inputs, handleInputChange, handleSubmit } = useSubmitForm(create);

    const handleBlack = () => {
        const _path = ProtectRoutes.Customer.path;
        history.push(_path);
    };

     // xử lý sau khi thực hiện tạo người dùng thành công
     const handleCloseDialog = () => {
        setOpen(false);
        const _path = ProtectRoutes.Customer.path;
        history.push(_path);
    };
    const handleContinue = () => {
        setOpen(false);
        window.location.reload();
    };

    // xử lý sau khi hiện thông báo
    const handleCloseAlert = () => {
        setOpenError(false);
    };

    return (
        <Container maxWidth='lg'>
            <CssBaseline />
            <div className={classes.paper}>
                <Typography variant="h3">Tạo mới người dùng</Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {/* Tài khoản */}
                        <Grid item xs={4}  >
                            <Grid item   >
                                <Typography variant="h5">Tài khoản</Typography>
                                <Grid container xs={12} spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            autoComplete="username"
                                            variant="outlined"
                                            fullWidth
                                            type="text"
                                            id="username"
                                            name="username"
                                            label="username"
                                            required
                                            value={inputs.username}
                                            onChange={handleInputChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            id="password"
                                            variant="outlined"
                                            fullWidth
                                            name="password"
                                            label="Password"
                                            type="password"
                                            required
                                            autoComplete="current-password"
                                            value={inputs.password}
                                            onChange={handleInputChange}
                                            name="password"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            id="ConfirmPassword"
                                            variant="outlined"
                                            fullWidth
                                            name="ConfirmPassword"
                                            label="Confirm password"
                                            type="password"
                                            required
                                            autoComplete="current-password"
                                            value={inputs.confirm_password}
                                            onChange={handleInputChange}
                                            name="confirm_password"
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>

                        </Grid>

                        {/* Thông tin người dùng */}
                        <Grid item xs={8}>
                            <Typography variant="h5">Thông tin</Typography>
                            <Grid container xs={12} spacing={2}>
                                {/* Tên */}
                                <Grid item xs={6}>
                                    <TextField
                                        autoComplete="lname"
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="lastName"
                                        label="Họ"
                                        value={inputs.last_name}
                                        onChange={handleInputChange}
                                        name="last_name"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        autoComplete="fname"
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="firstName"
                                        label="Tên"
                                        autoFocus
                                        type="text"
                                        name="first_name"
                                        value={inputs.first_name}
                                        onChange={handleInputChange}
                                    />
                                </Grid>

                                {/* email + số điện thoại */}
                                <Grid item xs={6} >
                                    <TextField
                                        autoComplete="email"
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email"
                                        value={inputs.email}
                                        onChange={handleInputChange}
                                        name="email"
                                    />
                                </Grid>
                                <Grid item xs={6} >
                                    <TextField
                                        autoComplete="phone"
                                        variant="outlined"
                                        required
                                        fullWidth
                                        name="phone"
                                        label="Số điện thoại"
                                        type="number"
                                        id="phone"
                                        value={inputs.phone}
                                        onChange={handleInputChange}
                                    />
                                </Grid>

                                {/* Địa chỉ */}
                                <Grid item xs={12} >
                                    <TextField
                                        autoComplete="address"
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="address"
                                        label="Địa chỉ"
                                        value={inputs.address}
                                        onChange={handleInputChange}
                                        name="address"
                                    />
                                </Grid>

                                {/* ảnh */}
                                <Grid item xs={9} >
                                    <input
                                        accept="image/*"
                                        className={classes.input}
                                        id="contained-button-file"
                                        multiple
                                        type="file"
                                        ref={avatar}
                                    />
                                    <label htmlFor="contained-button-file">
                                        <Button variant="contained" color="primary"
                                            maxWidth component="span">
                                            Chọn ảnh
                                        </Button>
                                    </label>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid container spacing={5}>
                        <Grid item xs={4}>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                onClick={handleBlack}
                            >
                                Quay về
                            </Button>
                        </Grid>
                        <Grid item xs={8}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                Tạo mới
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Dialog
                open={open}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Thông báo</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn đã tạo mới nhân viên thành công
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary" autoFocus>
                        Quay về
                    </Button>
                    <Button onClick={handleContinue} color="primary" autoFocus>
                        Tạo mới
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={openError} autoHideDuration={6000} onClose={handleCloseAlert}>
                <Alert onClose={handleCloseAlert} severity="warning">
                    Lỗi xác nhận mật khẩu
                </Alert>
            </Snackbar>
        </Container>
    );
}
