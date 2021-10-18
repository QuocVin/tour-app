import React, { createRef, useEffect, useState } from 'react';
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
import { useStyles } from './AdminNewsDetail-styles';
import API, { endpoints } from '../../helpers/API';
import useSubmitForm from '../../helpers/CustomHooks'
import { useHistory, useLocation } from 'react-router';
import { ProtectRoutes } from '../../routes/protect-route';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function NewsDetail() {
    const classes = useStyles();
    const history = useHistory()
    const image = createRef();
    const { state } = useLocation();

    const [tour, setTour] = useState([]);
    const [type, setType] = useState();
    const [address1, setAddress1] = useState();
    const [address2, setAddress2] = useState();

    const [news, setNews] = useState([]);
    const [descriptions, setDescriptions] = useState('');
    const hanleChangeDes = (e) => {
        setDescriptions(e.target.value);
    }

    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [loading, setLoading] = useState(false)

    // lấy thời gian ngày hiện tại
    const [check, setCheck] = useState(false);
    const current = new Date();
    const date = `${current.getFullYear()}-${current.getMonth() + 1}-${current.getDate()}`
    const [dateEnd, setDateEnd] = useState(new Date(date));
    const handleDateEnd = (date) => {
        setDateEnd(date);
        setCheck(true)
    };

    useEffect(() => {
        async function init() {
            await fetchNews()
            await fetchTourInNews()
        }
        init()
    }, [])

    // lấy thông tin bài viết đã chọn
    const fetchNews = async () => {
        setTimeout(() => {
            setLoading(true)
            const _path = endpoints['news-tour'] + `${state?.newsId}/`
            API.get(_path).then(res => {
                setNews(res.data);
                setDateEnd(res.data.dateEnd)
                setDescriptions(res.data.descriptions)
            })
        }, 500);
    }

    // lấy thông tin tour trong bài viết
    const fetchTourInNews = async () => {
        setTimeout(() => {
            const _path = endpoints['tour'] + `${state?.tourId}/`
            API.get(_path).then(res => {
                setTour(res.data);
                setType(res.data.type[0].name)
                setAddress1(res.data.address[0].name)
                setAddress2(res.data.address[1].name)
            })
            setLoading(false)
        }, 500);
    }

    // api patch thay đổi thông tin bài viết
    const changeInfo = async () => {
        const formData = new FormData();

        for (let k in inputs) {
            formData.append(k, inputs[k]);
        }
        formData.append("descriptions", descriptions);
        formData.append("static", "DANG MO");
        if (image.current.files.length != 0) {
            formData.append("image", image.current.files[0]);
        }

        if (check) {
            formData.append("dateEnd", dateEnd.toLocaleDateString('ko-KR').replace(". ", "-").replace(". ", "-").replace(".", ""));
        }

        for (var key of formData.keys()) {
            console.log(key, formData.get(key));
        }

        try {
            const _path = endpoints["news-tour"] + `${state?.newsId}/`
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
    const closeNews = async () => {
        const formData = new FormData();
        formData.append("static", "DA DONG");
        try {
            const _path = endpoints["news-tour"] + `${state?.newsId}/`
            let res = await API.patch(_path, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.info("res:", res)
            if (res)
                setOpen2(true);
        } catch (err) {
            console.log("ERROR:\n", err);
        }
    }

    const { inputs, handleInputChange, handleSubmit } = useSubmitForm(changeInfo);

    // chọn nút quay lại
    const handleBack = () => {
        const _path = ProtectRoutes.NewsTour.path;
        history.push(_path);
    };

    // chọn nút đóng bài viết
    const handleCloseNews = () => {
        closeNews();
    };

    // xử lý sau khi hiện thông báo
    const handleCloseAlert = () => {
        setOpen(false);
        setOpen2(false);
        window.location.reload();
    };

    return (
        <div>
            <Container component="main" maxWidth="lg">
                <CssBaseline />
                <div className={classes.paper}>
                    <Typography variant="h3">Thông tin bài viết</Typography>
                    <form className={classes.form} onSubmit={handleSubmit}>
                        {loading ? <p>loading. . .</p> :
                            <Grid container spacing={2}>
                                {/* các thông tin về bài viết */}
                                <Grid item xs={8}  >
                                    <Grid container xs={12} spacing={2}>
                                        {/* tiêu đề */}
                                        <Typography variant="body">Tiêu đề bài viết</Typography>
                                        <Grid item xs={12}>
                                            <TextField
                                                variant="outlined"
                                                fullWidth
                                                label={news.title}
                                                id="title"
                                                name="title"
                                                value={inputs.title}
                                                onChange={handleInputChange}
                                            />
                                        </Grid>

                                        {/* trạng thái bài viêt */}
                                        <Grid item xs={12} spacing={2}>
                                            <Typography variant="body">Trạng thái bài viết</Typography>
                                            <Grid item xs={4} spacing={2}>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    readOnly
                                                    id="title"
                                                    name="title"
                                                    value={news.static}
                                                />
                                            </Grid>
                                        </Grid>

                                        {/* ngày kết thúc */}
                                        <Grid item xs={4}>
                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                <KeyboardDatePicker
                                                    disableToolbar
                                                    variant="inline"
                                                    format="dd/MM/yyyy"
                                                    margin="normal"
                                                    id="dateEnd"
                                                    label="Ngày kết thúc"
                                                    value={dateEnd}
                                                    onChange={handleDateEnd}
                                                    KeyboardButtonProps={{
                                                        'aria-label': 'change date',
                                                    }}
                                                />
                                            </MuiPickersUtilsProvider>
                                        </Grid>

                                        {/* chọn ảnh */}
                                        <Grid item xs={4}>
                                            <input
                                                accept="image/*"
                                                className={classes.input}
                                                id="contained-button-file"
                                                multiple
                                                type="file"
                                                ref={image}
                                            />
                                            <label htmlFor="contained-button-file">
                                                <Button variant="contained" color="primary"
                                                    maxWidth component="span">
                                                    chọn ảnh
                                                </Button>
                                            </label>
                                        </Grid>

                                        {/* mô tả */}
                                        <Grid item xs={12}>
                                            <Typography variant="body">Mô tả bài viết</Typography>
                                            <TextField
                                                variant="outlined"
                                                fullWidth
                                                id="descriptions"
                                                minRows={15}
                                                multiline
                                                value={descriptions}
                                                onChange={hanleChangeDes}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {/* các thông tin về tour trong bài */}
                                <Grid item xs={4}>
                                    <Grid container xs={12} spacing={2}>
                                        <Typography variant="h5">Thông tin tour trong bài viết</Typography>
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
                                    <Grid container xs={12} spacing={2}>
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

                                        {/* mô tả */}
                                        <Grid item xs={12}>
                                            <TextField
                                                variant="outlined"
                                                fullWidth
                                                readOnly
                                                minRows={8}
                                                multiline
                                                label="Mô tả"
                                                value={tour.descriptions + ''}
                                            />
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
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                    onClick={handleCloseNews}
                                >
                                    Đóng bài viết
                                </Button>
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
                    Bạn đã đóng bài viết
                </Alert>
            </Snackbar>
        </div>
    );
}
