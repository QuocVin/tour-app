import React, { useEffect, useState } from 'react';
import {
    Grid,
    Typography,
    Container,
    Button,
    DialogTitle,
    DialogContentText,
    DialogContent,
    DialogActions,
    Dialog,
    TextField,
    Snackbar,
} from '@material-ui/core';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import MuiAlert from '@material-ui/lab/Alert';
import DateFnsUtils from '@date-io/date-fns';
import { useStyles } from './NewsTourDetail-styles';
import { useHistory, useLocation } from 'react-router-dom';
import API, { endpoints } from '../../helpers/API';
import { useStore } from "react-redux";
import cookies from 'react-cookies';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function NewsTourDetail() {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const [open4, setOpen4] = useState(false);

    const { state } = useLocation();
    const history = useHistory();
    const [type, setType] = useState();
    const [tour, setTour] = useState([]);
    const [bookingInfo, setBookingInfo] = useState([]);
    const [checkStatic, setCheckStatic] = useState(false);

    const [people1, setPeople1] = useState(0);
    const [people2, setPeople2] = useState(0);
    const [address1, setAddress1] = useState();
    const [address2, setAddress2] = useState();

    const [loading, setLoading] = useState(false);

    const store = useStore();
    const auth = store.getState();
    let user = auth;
    if (cookies.load("user") != null) {
        user = cookies.load("user")
    };

    // lấy thời gian ngày hiện tại
    const current = new Date();
    const date = `${current.getFullYear()}-${current.getMonth() + 1}-${current.getDate()}`
    const dateBooking = useState(new Date(date));

    const [check, setCheck] = useState(false);
    const tourId = state?.newstour?.tour ? state?.newstour?.tour : state?.newstour?.tour_id;

    useEffect(() => {
        async function init() {
            setLoading(true)
            await fetchTour()
            state?.newstour?.static === "DANG MO" ? setCheckStatic(true) : setCheckStatic(false)
            if (user != null) {
                if (user.username != null)
                    await fetchCheckBooking()
            }
        }
        init()
    }, [])

    // lấy thông tin tour
    const fetchTour = async () => {
        setTimeout(() => {
            const _path = endpoints['tour-detail'].replace(":id", (state?.newstour?.tour ? `${state?.newstour?.tour}` : `${state?.newstour?.tour_id}`))
            API.get(_path).then(res => {
                setTour(res.data)
                setLoading(false)
                setType(res.data.type[0].name)
                setAddress1(res.data.address[0].name)
                setAddress2(res.data.address[1].name)
            })
        }, 500);
    }

    // kiểm tra khách hàng đã đặt tour chưa - chỉnh sửa số lượng ?
    const fetchCheckBooking = async () => {
        setTimeout(() => {
            const _path = endpoints['booking'] + endpoints['check-booking'] + `?tour=${tourId}&customer=${user.id}`;
            API.get(_path).then(res => {
                if (res.data.length === 0)
                    setCheck(false)
                else {
                    setCheck(true)
                    setBookingInfo(res.data)
                }
                setLoading(false)
            })
        }, 500);
    }

    // api post booking
    const booking = async () => {
        const formData = new FormData();
        if (people1 === 0 && people2 === 0)
            setOpen2(true)
        else {
            let pay = people1 * tour.price1 + people2 * tour.price2
            // const body = {
            //     "people1": people1,
            //     "people2": people2,
            //     "totalPrice": pay,
            //     "employee": `${state?.newstour?.employee}`,
            //     "customer": user.id,
            //     "tour": tour.id,
            //     "static": "DAT TOUR"
            // }
            formData.append("people1", people1);
            formData.append("people2", people2);
            formData.append("totalPrice", pay);
            formData.append("employee", `${state?.newstour?.employee}`);
            formData.append("customer", user.id);
            formData.append("tour", tour.id);
            formData.append("static", "DAT TOUR");
            formData.append("dateBooking", dateBooking);

            for (var key of formData.keys()) {
                console.log(key, formData.get(key));
            }

            try {
                const _path = endpoints["booking"]
                let res = await API.post(_path, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                if (res)
                    setOpen3(true)
            } catch (err) {
                console.log("ERROR:\n", err);
            }
        }

    }

    // api patch booking - thay đổi thông tin
    const changeBooking = async () => {
        try {
            if (people1 === 0 && people2 === 0)
                setOpen2(true)
            else {
                let pay = people1 * tour.price1 + people2 * tour.price2
                const body = {
                    "people1": people1,
                    "people2": people2,
                    "totalPrice": pay,
                    "static": "DAT TOUR",
                    "dateBooking": dateBooking,
                }
                const _path = endpoints['booking'] + `${bookingInfo[0].id}/`
                let res = await API.patch(_path, body)
                setOpen3(true)
            }
        } catch (err) {
            console.info(err)
        }
    }

    // api patch booking - hủy tour
    const cancleBooking = async () => {
        try {
            const body = {
                "static": "HUY TOUR",
            }
            const _path = endpoints['booking'] + `${bookingInfo[0].id}/`
            let res = await API.patch(_path, body)
            setOpen4(true)
        } catch (err) {
            console.info(err)
        }
    }

    // chọn nút hoàn thành
    const handleBooking_click = () => {
        booking();
        setOpen(false);
    };

    // chọn nút thay đổi
    const handleChange_click = () => {
        changeBooking();
        setOpen(false);
    };

    // chọn nút hủy đơn
    const handleCancle_click = () => {
        cancleBooking();
        setOpen(false);
    };

    // kiểm tra đăng nhập khi thực hiện booking
    const handlOpen_click = () => {
        if (cookies.load("user") != null) {
            setOpen(true);
            // console.info(bookingInfo[0].id)X
        } else {
            history.push('/login')
        }
    };

    // đóng cửa sổ thực hiện booking
    const handleClose_click = () => {
        setOpen(false);
    };

    // lấy thông tin số người tham gia
    const handleChangePeople1 = (e) => {
        setPeople1(e.target.value)
    };
    const handleChangePeople2 = (e) => {
        setPeople2(e.target.value)
    };

    // đóng thông báo sau khi thực hiện booking
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            setOpen2(false);
            setOpen3(false);
            setOpen4(false);
            window.location.reload();
        }
    };

    return (

        <Container maxWidth='lg'>
            <Typography className={classes.title} variant="h3">{`${state?.newstour?.title}`}</Typography>

            {loading ? <p>Loading ...</p> :
                (
                    <Grid container spacing={10}>
                        {/* thông tin về bài viết */}
                        <Grid item xs={8}>
                            <Grid container>
                                <img className={classes.img} src={`${state?.newstour?.image}`} alt={`${state?.newstour?.title}`} />
                            </Grid>
                            <Typography variant="body">Đăng ngày {`${state?.newstour?.dateCreate}`}</Typography>
                            <TextField
                                variant="outlined"
                                fullWidth
                                minRows={10}
                                multiline
                                readOnly
                                className={classes.descriptions}
                                value={`${state?.newstour?.descriptions}`}
                            />
                        </Grid>

                        {/* các thông tin về tour trong bài */}
                        <Grid item xs={4} className={classes.tour}>
                            <Grid container xs={12} spacing={2} className={classes.tourInfo}>
                                <Typography className={classes.tourTitle} variant="h5">Thông tin về tour du lịch</Typography>
                                {/* chọn tour để viết bài */}
                                <Grid item xs={12} >
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        readOnly
                                        label="Tiêu đề tour"
                                        value={tour.title + ''}
                                    />
                                </Grid>

                                {/* hình thức */}
                                <Grid item xs={8} >
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        readOnly
                                        label="Hình thức"
                                        value={type + ''}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container xs={12} spacing={2} className={classes.tourInfo}>
                                {/* ngày bắt đầu */}
                                <Grid item xs={6}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker
                                            disableToolbar
                                            variant="inline"
                                            format="dd/MM/yyyy"
                                            margin="normal"
                                            id="dateStart"
                                            label="Ngày bắt đầu"
                                            value={tour.dateStart}
                                            readOnly
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                        />
                                    </MuiPickersUtilsProvider>
                                </Grid>

                                {/* ngày kết thúc */}
                                <Grid item xs={6}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker
                                            disableToolbar
                                            variant="inline"
                                            format="dd/MM/yyyy"
                                            margin="normal"
                                            id="dateEnd"
                                            label="Ngày kết thúc"
                                            value={tour.dateEnd}
                                            readOnly
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                        />
                                    </MuiPickersUtilsProvider>
                                </Grid>

                                {/* điểm xuất phát */}
                                <Grid item xs={6} >
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        id="pointStart"
                                        label="Điểm xuất phát"
                                        readOnly
                                        value={address1 + ''}
                                    />
                                </Grid>

                                {/* điểm đến */}
                                <Grid item xs={6} >
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        id="pointEnd"
                                        label="Điểm đến"
                                        readOnly
                                        value={address2 + ''}
                                    />
                                </Grid>

                                {/* giá vé */}
                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        id="price1"
                                        readOnly
                                        label="Giá vé cho người lớn"
                                        value={tour.price1 + ' VNĐ'}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        id="price2"
                                        label="Giá vé cho trẻ em"
                                        readOnly
                                        value={tour.price2 + ' VNĐ'}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container xs={12} className={classes.booking}>
                                {checkStatic ?
                                    (<Button
                                        fullWidth
                                        variant="contained"
                                        className={classes.btnBooking}
                                        onClick={() => handlOpen_click()}>Đặt tour</Button>
                                    ) :
                                    (
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            className={classes.btnBooking}
                                            disabled
                                            >Đã đóng</Button>
                                    )
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                )
            }

            {/* hiện cửa sổ nhập thông tin */}
            < Dialog open={open} onClose={handleClose_click} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Thông tin đơn hàng</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="people1"
                        label="Số lượng người lớn"
                        type="number"
                        fullWidth
                        value={people1}
                        onChange={handleChangePeople1}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Số lượng trẻ em"
                        type="number"
                        fullWidth
                        value={people2}
                        onChange={handleChangePeople2}
                    />

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose_click} color="primary">Quay lại</Button>
                    {check ? (
                        <div>
                            <Button onClick={() => handleCancle_click()}>Hủy đơn hàng</Button>
                            <Button onClick={() => handleChange_click()}>Thay đổi</Button>
                        </div>
                    ) : (
                        <div>
                            <Button onClick={() => handleBooking_click()} color="primary">Hoàn thành</Button>
                        </div>
                    )}
                </DialogActions>
            </Dialog>

            {/* xử lý thông báo sau khi booking */}
            <Snackbar open={open2} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="warning">
                    Lỗi! Bạn phải nhập số người
                </Alert>
            </Snackbar>
            <Snackbar open={open3} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    Bạn đặt tour thành công
                </Alert>
            </Snackbar>
            <Snackbar open={open4} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="warning">
                    Bạn đã hủy tour
                </Alert>
            </Snackbar>

        </Container >



    );
}
