import React, { useEffect, useState } from 'react';
import {
    Grid,
    Typography,
    Container,
    Button,
    TextField,
    CssBaseline,
    Snackbar,
} from '@material-ui/core';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import MuiAlert from '@material-ui/lab/Alert';
import DateFnsUtils from '@date-io/date-fns';
import { useStyles } from './AdminTourDetail-styles';
import API, { endpoints } from '../../helpers/API';
import useSubmitForm from '../../helpers/CustomHooks'
import { useHistory, useLocation } from 'react-router';
import { ProtectRoutes } from '../../routes/protect-route';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function CreateTour(props) {
    const classes = useStyles();
    const history = useHistory()
    const { state } = useLocation();

    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);

    const [loading, setLoading] = useState(false)
    const [checkStatus, setCheckStatus] = useState(false)

    const [tour, setTour] = useState([]);
    const [typeTour, setTypeTour] = useState();
    const [address1, setAddress1] = useState();
    const [address2, setAddress2] = useState();
    const [descriptions, setDescriptions] = useState('');
    const hanleChangeDes = (e) => {
        setDescriptions(e.target.value);
    }

    // lấy thời gian ngày hiện tại
    const current = new Date();
    const date = `${current.getFullYear()}-${current.getMonth() + 1}-${current.getDate()}`
    const [dateStart, setDateStart] = useState(new Date(date));
    const [dateEnd, setDateEnd] = useState(new Date(date));

    useEffect(() => {
        async function init() {
            setLoading(true)
            await fetchTour()
        }
        init()
    }, [])

    // lấy dữ liệu tour đã chọn
    const fetchTour = async () => {
        setTimeout(() => {
            const _path = endpoints['tour'] + `${state?.tourId}/`
            API.get(_path).then(res => {
                setTour(res.data);
                setTypeTour(res.data.type[0].name)
                setAddress1(res.data.address[0].name)
                setAddress2(res.data.address[1].name)
                setDateStart(res.data.dateStart)
                setDateEnd(res.data.dateEnd)
                setDescriptions(res.data.descriptions)
                res.data.static === "DANG MO" ? setCheckStatus(true) : setCheckStatus(false)
            })
            setLoading(false)
        }, 500);
    }

    // api post tạo mới tour
    const changeInfo = async () => {
        const formData = new FormData();

        formData.append("static", "DANG MO");
        formData.append("descriptions", descriptions);
        if (inputs.title)
            formData.append("title", inputs.title);

        for (var key of formData.keys()) {
            console.log(key, formData.get(key));
        }

        try {
            const _path = endpoints["tour"] + `${state?.tourId}/`
            let res = await API.patch(_path, formData, {
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

    // đóng bài viết
    const closeTour = async () => {
        const formData = new FormData();
        formData.append("static", "DA DONG");
        try {
            const _path = endpoints["tour"] + `${state?.tourId}/`
            let res = await API.patch(_path, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (res)
                setOpen2(true);
        } catch (err) {
            console.log("ERROR:\n", err);
        }
    }

    // mở bài viết
    const openTour = async () => {
        const formData = new FormData();
        formData.append("static", "DANG MO");
        try {
            const _path = endpoints["tour"] + `${state?.tourId}/`
            let res = await API.patch(_path, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (res)
                setOpen3(true);
        } catch (err) {
            console.log("ERROR:\n", err);
        }
    }

    const { inputs, handleInputChange, handleSubmit } = useSubmitForm(changeInfo);

    // chọn nút quay về
    const handleBack = () => {
        const _path = ProtectRoutes.Tour.path;
        history.push(_path);
    };

    // chọn nút đóng tour
    const handleCloseTour = () => {
        closeTour();
    };

    // chọn nút mở tour
    const handleOpenTour = () => {
        openTour();
    };



    // xử lý sau khi hiện thông báo
    const handleCloseAlert = () => {
        setOpen(false);
        setOpen2(false);
        setOpen3(false);
        window.location.reload();
    };

    return (
        <div>
            <Container component="main" maxWidth="lg">
                <CssBaseline />
                <div className={classes.paper}>
                    <Typography variant="h3">Thông tin tour du lịch</Typography>
                    <form className={classes.form} onSubmit={handleSubmit}>
                        {loading ? <p>loading. . .</p> :
                            <Grid container spacing={2}>
                                {/* các thông tin về tour */}
                                <Grid item xs={5}  >
                                    <Grid container xs={12} spacing={2}>
                                        {/* tiêu đề */}
                                        <Grid item xs={12}>
                                            <Typography variant="body">Tiêu đề bài viết</Typography>
                                            <TextField
                                                variant="outlined"
                                                fullWidth
                                                label={tour.title}
                                                id="title"
                                                name="title"
                                                value={inputs.title}
                                                onChange={handleInputChange}
                                            />
                                        </Grid>

                                        {/* type - không cho thay đổi */}
                                        <Grid item xs={7}>
                                            <Typography variant="body">Hình thức du lịch</Typography>
                                            <TextField
                                                variant="outlined"
                                                fullWidth
                                                readOnly
                                                value={typeTour}
                                            />
                                        </Grid>

                                        {/* static - thay đổi qua cập nhập */}
                                        <Grid item xs={5}>
                                            <Typography variant="body">Trạng thái</Typography>
                                            <TextField
                                                variant="outlined"
                                                fullWidth
                                                readOnly
                                                value={tour.static}
                                            />
                                        </Grid>

                                        {/* ngày bắt đầu - không cho thay đổi */}
                                        <Grid item xs={6}>
                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                <KeyboardDatePicker
                                                    disableToolbar
                                                    variant="inline"
                                                    format="dd/MM/yyyy"
                                                    margin="normal"
                                                    id="dateStart"
                                                    label="Ngày bắt đầu"
                                                    value={dateStart}
                                                    readOnly
                                                    KeyboardButtonProps={{
                                                        'aria-label': 'change date',
                                                    }}
                                                />
                                            </MuiPickersUtilsProvider>
                                        </Grid>

                                        {/* ngày kết thúc - không cho thay đổi */}
                                        <Grid item xs={6}>
                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                <KeyboardDatePicker
                                                    disableToolbar
                                                    variant="inline"
                                                    format="dd/MM/yyyy"
                                                    margin="normal"
                                                    id="dateEnd"
                                                    label="Ngày kết thúc"
                                                    value={dateEnd}
                                                    readOnly
                                                    KeyboardButtonProps={{
                                                        'aria-label': 'change date',
                                                    }}
                                                />
                                            </MuiPickersUtilsProvider>
                                        </Grid>

                                        {/* giá vé - không cho thay đổi */}
                                        <Grid item xs={6}>
                                            <Typography variant="body">Giá vé cho người lớn</Typography>
                                            <TextField
                                                variant="outlined"
                                                fullWidth
                                                readOnly
                                                value={tour.price1 + ' VNĐ'}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body">Giá vé cho trẻ em</Typography>
                                            <TextField
                                                variant="outlined"
                                                fullWidth
                                                readOnly
                                                value={tour.price2 + " VNĐ"}
                                            />
                                        </Grid>

                                        {/* điểm xuất phát - không cho thay đổi */}
                                        <Grid item xs={6} >
                                            <Typography variant="body">Điểm xuất phát</Typography>
                                            <TextField
                                                variant="outlined"
                                                fullWidth
                                                readOnly
                                                value={address1}
                                            />
                                        </Grid>

                                        {/* điểm đến - không cho thay đổi */}
                                        <Grid item xs={6} >
                                            <Typography variant="body">Điểm đến</Typography>
                                            <TextField
                                                variant="outlined"
                                                fullWidth
                                                readOnly
                                                value={address2}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {/* mô tả chi tiết */}
                                <Grid item xs={7}>
                                    <Grid container xs={12} spacing={2}>
                                        <Typography variant="body">Mô tả bài viết</Typography>
                                        <TextField
                                            variant="outlined"
                                            fullWidth
                                            id="descriptions"
                                            name="descriptions"
                                            value={descriptions}
                                            onChange={hanleChangeDes}
                                            minRows={21}
                                            multiline
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        }

                        {/* nút xử lý */}
                        <Grid container xs={12} spacing={2}>
                            <Grid item xs={3}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                    onClick={handleBack}
                                >
                                    Quay về
                                </Button>
                            </Grid>
                            <Grid item xs={3}>
                                {checkStatus ?
                                    (
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            className={classes.submit}
                                            onClick={handleCloseTour}
                                        >
                                            Đóng tour
                                        </Button>
                                    ) :
                                    (
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            className={classes.submit}
                                            onClick={handleOpenTour}
                                        >
                                            Mở tour
                                        </Button>
                                    )
                                }

                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                >
                                    Cập nhập
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Container>

            {/* xử lý thông báo */}
            <Snackbar open={open} autoHideDuration={6000} onClose={handleCloseAlert}>
                <Alert onClose={handleCloseAlert} severity="success">
                    Bạn đã cập nhập thành công
                </Alert>
            </Snackbar>
            <Snackbar open={open2} autoHideDuration={6000} onClose={handleCloseAlert}>
                <Alert onClose={handleCloseAlert} severity="warning">
                    Bạn đã đóng tour
                </Alert>
            </Snackbar>
            <Snackbar open={open3} autoHideDuration={6000} onClose={handleCloseAlert}>
                <Alert onClose={handleCloseAlert} severity="success">
                    Bạn đã mở tour
                </Alert>
            </Snackbar>
        </div>
    );
}
