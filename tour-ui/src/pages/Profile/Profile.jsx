import React, { createRef, useEffect, useState } from 'react';
import {
    makeStyles,
    Grid,
    Typography,
    Divider,
    Container,
    Button,
    DialogTitle,
    DialogContentText,
    DialogContent,
    DialogActions,
    Dialog,
    TextField,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    ListSubheader,
    List,
    ListItem,
    ListItemText,
    Box,
    CssBaseline,
    FormControlLabel,
    Checkbox,
    Paper,
    Table,
    TableCell,
    TableBody,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
} from '@material-ui/core';
import useSubmitForm from '../../helpers/CustomHooks'
import API, { endpoints } from '../../helpers/API';
import { useStyles } from './Profile-styles';
import { useStore } from "react-redux";
import cookies from 'react-cookies';
import { useHistory } from 'react-router';
import { PublicRoutes } from '../../routes/public-route';

const columns = [
    { id: 'stt', label: 'STT', maxWidth: 20, align: 'center', },
    {
        id: 'static1',
        label: 'Trạng thái',
        minWidth: 100,
        align: 'center',
    },
    {
        id: 'people1',
        label: 'Người lớn',
        minWidth: 100,
        align: 'right',
    },
    {
        id: 'people2',
        label: 'Trẻ em',
        minWidth: 100,
        align: 'right',
    },
    {
        id: 'total',
        label: 'Tổng tiền',
        minWidth: 150,
        align: 'right',
        format: (value) => value.toFixed(2),
    },
];

function createData(stt, static1, people1, people2, total, tourId, employeeId) {
    return { stt, static1, people1, people2, total, tourId, employeeId };
}

export default function NewsTourDetail() {
    const classes = useStyles();
    const history = useHistory();
    const [open, setOpen] = useState(false);
    const avatar = createRef();
    const [loading, setLoading] = useState(false)

    const [booking, setBooking] = useState([]);

    const store = useStore();
    const auth = store.getState();
    let user = auth;
    if (cookies.load("user") != null) {
        user = cookies.load("user")
    };

    useEffect(() => {
        async function init() {
            setLoading(true)
            await fetchBooking()
        }
        init()
    }, [])

    const fetchBooking = async () => {
        setTimeout(() => {
            const _path = endpoints['booking'] + endpoints['booking-current-user'] + `?customer=${user.id}`
            API.get(_path).then(res => {
                setBooking(res.data)
                setLoading(false)
                // console.info('tour: ', res.data)
                setBooking(
                    res.data.map((b, idx) =>
                        createData(idx + 1, b.static, b.people1 + ' người', b.people2 + ' bé', b.totalPrice + ' VNĐ', b.tour_id, b.employee_id),
                    )
                );
            })
        }, 500);
    }

    const changeInfo = async () => {
        const formData = new FormData();

        for (let k in inputs) {
            formData.append(k, inputs[k]);
        }

        if (avatar.current.files.length != 0) {
            formData.append("avatar", avatar.current.files[0]);
        }

        for (var key of formData.keys()) {
            console.log(key, formData.get(key));
        }
        try {
            const _path = endpoints["user"] + `${user.id}/`
            let res = await API.patch(_path, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (res) {
                cookies.save("user", res.data);
                setOpen(true);
            }
            console.info("res:", res.data)
            console.info("user:", user.avatar)
        } catch (err) {
            console.log("ERROR:\n", err);
        }
    };

    const { inputs, handleInputChange, handleSubmit } = useSubmitForm(changeInfo);

    const changeStaticBooking = async (bookingId) => {
        const formData = new FormData();

        formData.append("static", "DAT TOUR");

        try {
            const _path = endpoints["booking"] + bookingId
            // let res = await API.patch(_path, formData, {
            //     headers: {
            //         "Content-Type": "multipart/form-data",
            //     },
            // });
            console.info("_path:", _path)

        } catch (err) {
            console.log("ERROR:\n", err);
        }
    };

    // chuyển về trang đăng tin tức tour đã booking
    const handleChooseBooking = (tourId, employeeId) => {
        const _pathAPI = endpoints['news-tour'] + endpoints['have-tour'] + `?tour=${tourId}&employee=${employeeId}`;
        API.get(endpoints['news-tour']).then(res => {
            const _pathPage = PublicRoutes.NewsTourDetail.path.replace(":id", res.data.results[0].id)
            history.push(_pathPage, {
                newstour: res.data.results[0],
            })
        })
    }

    // chuyển trang
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const abc = () => {
        console.info(inputs.last_name)
    }

    const handleCloseDialog = () => {
        setOpen(false);
        user = cookies.load("user")
        // window.location.reload();
    };

    return (
        <Grid container spacing={10}>
            {/* thông tin người dùng */}
            <Grid item xs={5}>
                <Typography variant="h3" onClick={abc}>Thông tin người dùng</Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    {/* <form className={classes.form} > */}
                    <Grid container spacing={2}>
                        {/* Thông tin người dùng */}
                        <Grid item xs={12}>
                            <Typography variant="h5">Thông tin người dùng</Typography>
                            <Grid container xs={12} spacing={2}>
                                {/* Tên */}
                                <Grid item xs={6}>
                                    <Typography variant="caption">Họ</Typography>
                                    <TextField
                                        autoComplete="lname"
                                        variant="outlined"
                                        fullWidth
                                        id="lastName"
                                        name="last_name"
                                        label={user.last_name}
                                        value={inputs.last_name}
                                        onChange={handleInputChange}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="caption">Tên</Typography>
                                    <TextField
                                        autoComplete="fname"
                                        variant="outlined"
                                        fullWidth
                                        id="firstName"
                                        autoFocus
                                        type="text"
                                        name="first_name"
                                        label={user.first_name}
                                        value={inputs.first_name}
                                        onChange={handleInputChange}
                                    />
                                </Grid>

                                {/* email + số điện thoại */}
                                <Grid item xs={6} >
                                    <Typography variant="caption">Email</Typography>
                                    <TextField
                                        autoComplete="email"
                                        variant="outlined"
                                        fullWidth
                                        id="email"
                                        name="email"
                                        type="email"
                                        label={user.email}
                                        value={inputs.email}
                                        onChange={handleInputChange}
                                    />
                                </Grid>
                                <Grid item xs={6} >
                                    <Typography variant="caption">Số điện thoại</Typography>
                                    <TextField
                                        autoComplete="phone"
                                        variant="outlined"
                                        fullWidth
                                        name="phone"
                                        type="number"
                                        id="phone"
                                        label={user.phone}
                                        value={inputs.phone}
                                        onChange={handleInputChange}
                                    />
                                </Grid>

                                {/* Địa chỉ */}
                                <Grid item xs={12} >
                                    <Typography variant="caption">Địa chỉ</Typography>
                                    <TextField
                                        autoComplete="address"
                                        variant="outlined"
                                        fullWidth
                                        id="address"
                                        name="address"
                                        label={user.address}
                                        value={inputs.address}
                                        onChange={handleInputChange}
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
                                            Avatar
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
                        Cập nhập
                    </Button>
                    {/* <Button color="primary" autoFocus>
            Sign Up
          </Button> */}

                </form>

            </Grid>

            {/* lịch sử giao dịch */}
            <Grid item xs={7}>
                <Typography variant="h3">Lịch sử giao dịch</Typography>
                <Paper className={classes.root}>
                    <TableContainer className={classes.container}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{ minWidth: column.minWidth }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody >
                                {booking.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align} onClick={() => handleChooseBooking(row.tourId, row.employeeId)}>
                                                        {column.format && typeof value === 'number' ? column.format(value) : value}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 20]}
                        component="div"
                        count={booking.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>

            </Grid>
            <Dialog
                open={open}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Thông báo</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn đã thành công cập nhập thông tin
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" autoFocus onClick={handleCloseDialog}>
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    )
}