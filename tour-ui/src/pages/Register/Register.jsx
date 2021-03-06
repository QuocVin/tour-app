import React, { createRef, useState } from 'react';
import {
    Button,
    CssBaseline,
    TextField,
    FormControlLabel,
    Checkbox,
    Link,
    Grid,
    Typography,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@material-ui/core';
import { useStyles } from './Register-styles';
import API, { endpoints } from '../../helpers/API';
import useSubmitForm from '../../helpers/CustomHooks'
import { useHistory } from 'react-router';
import { PublicRoutes } from '../../routes/public-route';

export default function Register() {
    const classes = useStyles();
    const avatar = createRef();
    const history = useHistory()
    const [open, setOpen] = useState(false);

    const register = async () => {
        const formData = new FormData();

        if (inputs.password === inputs.confirm_password) {
            for (let k in inputs) {
                if (k !== "confirm_password") formData.append(k, inputs[k]);
            }
        }

        if (avatar.current.files.length !== 0) {
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

    const { inputs, handleInputChange, handleSubmit } = useSubmitForm(register);

    const handleCloseDialog = () => {
        setOpen(false);
        const _path = PublicRoutes.Login.path;
        history.push(_path);
    };

    return (
        <div>
            <Container component="main" maxWidth="md">
                <CssBaseline />
                <div className={classes.paper}>
                    <Typography variant="h3">????ng k??</Typography>
                    <form className={classes.form} onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            {/* T??i kho???n */}
                            <Grid item xs={4}  >
                                <Grid item   >
                                    <Typography variant="h5">T??i kho???n</Typography>
                                    <Grid container xs={12} spacing={2}>
                                        <Grid item xs={12}>
                                            <TextField
                                                autoComplete="username"
                                                variant="outlined"
                                                required
                                                fullWidth
                                                name="username"
                                                label="username"
                                                type="text"
                                                id="username"
                                                value={inputs.username}
                                                onChange={handleInputChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                id="password"
                                                variant="outlined"
                                                required
                                                fullWidth
                                                name="password"
                                                label="Password"
                                                type="password"
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
                                                required
                                                fullWidth
                                                name="ConfirmPassword"
                                                label="Confirm password"
                                                type="password"
                                                autoComplete="current-password"
                                                value={inputs.confirm_password}
                                                onChange={handleInputChange}
                                                name="confirm_password"
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>

                            </Grid>

                            {/* Th??ng tin ng?????i d??ng */}
                            <Grid item xs={8}>
                                <Typography variant="h5">Th??ng tin ng?????i d??ng</Typography>
                                <Grid container xs={12} spacing={2}>
                                    {/* T??n */}
                                    <Grid item xs={6}>
                                        <TextField
                                            autoComplete="lname"
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="lastName"
                                            label="H???"
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
                                            label="T??n"
                                            autoFocus
                                            type="text"
                                            name="first_name"
                                            value={inputs.first_name}
                                            onChange={handleInputChange}
                                        />
                                    </Grid>

                                    {/* email + s??? ??i???n tho???i */}
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
                                            label="S??? ??i???n tho???i"
                                            type="number"
                                            id="phone"
                                            value={inputs.phone}
                                            onChange={handleInputChange}
                                        />
                                    </Grid>

                                    {/* ?????a ch??? */}
                                    <Grid item xs={12} >
                                        <TextField
                                            autoComplete="address"
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="address"
                                            label="?????a ch???"
                                            value={inputs.address}
                                            onChange={handleInputChange}
                                            name="address"
                                        />
                                    </Grid>

                                    {/* ???nh */}
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
                                                Ch???n ???nh
                                            </Button>
                                        </label>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            ????ng k??
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/Login" variant="body2">
                                    ???? c?? t??i kho???n? ????ng nh???p
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Container>
            <Dialog
                open={open}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">B???n ???? ????ng k?? th??nh c??ng</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Vui l??ng ????ng nh???p ????? ti???p t???c d???ch v???
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary" autoFocus>
                        ????ng nh???p
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
