import React, { useState } from 'react';
import {
    Button,
    CssBaseline,
    TextField,
    Link,
    Grid,
    Typography,
    Container,
} from '@material-ui/core';
import useSubmitForm from '../../helpers/CustomHooks';
import API, { endpoints } from '../../helpers/API';
import cookies from 'react-cookies';
import { Redirect } from 'react-router';
import { useDispatch } from 'react-redux';
import { useStyles } from "./Login-styles";

export default function Login(props) {
    const classes = useStyles();
    const [isLogged, setLogged] = useState(false);
    const dispatch = useDispatch();

    const login = async () => {
        try {
            const info = await API.get(endpoints['oauth2-info']);

            const res = await API.post(endpoints['login'], {
                client_id: info.data.client_id,
                client_secret: info.data.client_secret,
                username: inputs.username,
                password: inputs.password,
                grant_type: "password",
            })

            cookies.save("access_token", res.data.access_token)

            let user = await API.get(endpoints['current-user'], {
                headers: {
                    Authorization: `Bearer ${cookies.load("access_token")}`
                }
            })

            cookies.save("user", user.data);
            dispatch({
                "type": "login",
                "payload": user.data
            })
            setLogged(true);
        } catch (err) {
            console.info(err)
        }
    }

    const { inputs, handleInputChange, handleSubmit } = useSubmitForm(login);

    if (isLogged)
        return <Redirect to="/" />
    else
        return (
            <Container component="main" maxWidth="xs" >
                <CssBaseline />
                <div className={classes.paper}>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <form className={classes.form} onSubmit={handleSubmit}>
                        <TextField
                            name="username"
                            label="username"
                            id="username"
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            autoComplete="current-username"
                            autoFocus
                            value={inputs.username}
                            onChange={handleInputChange}
                        />
                        <TextField
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            value={inputs.password}
                            onChange={handleInputChange}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Đăng nhâp
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link href="/Register" variant="body2">
                                    {"Bạn chưa có tài khoản? Đăng ký"}
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Container>
        );
}