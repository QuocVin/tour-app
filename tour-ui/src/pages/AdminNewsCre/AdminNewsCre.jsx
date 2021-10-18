import React, { createRef, useEffect, useState } from 'react';
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
    CssBaseline,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from '@material-ui/core';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { useStyles } from './AdminNewsCre-styles';
import API, { endpoints } from '../../helpers/API';
import useSubmitForm from '../../helpers/CustomHooks'
import { useHistory } from 'react-router';
import { useStore } from "react-redux";
import cookies from 'react-cookies';
import { ProtectRoutes } from '../../routes/protect-route';

export default function CreateNews() {
    const classes = useStyles();
    const history = useHistory()
    const image = createRef();
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [tourChoosed, setTourChoosed] = useState([]);
    const [checkedTour, setCheckedTour] = useState(false);
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(false)

    // lấy thông tin nhân viên
    const store = useStore();
    const auth = store.getState();
    let user = auth;
    if (cookies.load("user") != null) {
        user = cookies.load("user")
    };


    // lấy thời gian ngày hiện tại
    const current = new Date();
    const date = `${current.getFullYear()}-${current.getMonth() + 1}-${current.getDate()}`
    const [dateEnd, setDateEnd] = useState(new Date(date));
    const handleDateEnd = (date) => {
        setDateEnd(date);
    };

    useEffect(() => {
        async function init() {
            await fetchTour()
        }
        init()
    }, [])

    const fetchTour = async () => {
        setLoading(true)
        setTimeout(() => {
            const _path = endpoints['tour']
            API.get(_path).then(res => {
                setTours(res.data);
            })
            setLoading(false)
        }, 500);
    }

    const create = async () => {
        const formData = new FormData();

        for (let k in inputs) {
            formData.append(k, inputs[k]);
        }

        formData.append("static", "DANG MO");
        formData.append("tour", tourChoosed.id);
        formData.append("employee", user.id);
        if (image.current.files.length != 0) {
            formData.append("image", image.current.files[0]);
        }
        formData.append("dateEnd", dateEnd.toLocaleDateString('ko-KR').replace(". ", "-").replace(". ", "-").replace(".", ""));

        for (var key of formData.keys()) {
            console.log(key, formData.get(key));
        }

        try {
            let res = await API.post(endpoints["news-tour"], formData, {
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

    // chọn nút quay về trên cửa số thông báo
    const handleCloseDialog = () => {
        setOpen(false);
        const _path = ProtectRoutes.NewsTour.path;
        history.push(_path);
    };

    // chọn nút tiếp tục trên cửa số thông báo
    const handleContinue = () => {
        setOpen(false);
        window.location.reload();
    };

    // chọn tour để viết bài
    const handleChooseTour = (e) => {
        setTourChoosed(e.target.value);
        setCheckedTour(true)
    };

    // đóng mở select tour
    const handleClose1 = () => {
        setOpen1(false);
    };
    const handleOpen1 = () => {
        setOpen1(true);
    };

    // chọn nút quay lại
    const handleBack = () => {
        const _path = ProtectRoutes.NewsTour.path;
        history.push(_path);
    };

    return (
        <div>
            <Container component="main" maxWidth="lg">
                <CssBaseline />
                <div className={classes.paper}>
                    <Typography variant="h3">Tạo mới tin du lịch</Typography>
                    <form className={classes.form} onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            {/* các thông tin về bài viết */}
                            <Grid item xs={8}  >
                                <Grid container xs={12} spacing={2}>
                                    {/* tiêu đề */}
                                    <Grid item xs={12}>
                                        <TextField
                                            variant="outlined"
                                            required
                                            fullWidth
                                            label="Tiêu đề bài viết"
                                            id="title"
                                            name="title"
                                            value={inputs.title}
                                            onChange={handleInputChange}
                                        />
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
                                        <TextField
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="descriptions"
                                            minRows={15}
                                            multiline
                                            label="Mô tả bài viết"
                                            name="descriptions"
                                            value={inputs.descriptions}
                                            onChange={handleInputChange}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/* các thông tin về tour đã chọn */}
                            <Grid item xs={4}>
                                <Grid container xs={12} spacing={2}>
                                    <Typography variant="h5">Thông tin tour trong bài viết</Typography>
                                    {/* chọn tour để viết bài */}
                                    <Grid item xs={12} >
                                        <FormControl className={classes.formControl}>
                                            <InputLabel id="address1-label">tour . . .</InputLabel>
                                            <Select
                                                labelId="address1-label"
                                                id="address1"
                                                open={open1}
                                                onClose={handleClose1}
                                                onOpen={handleOpen1}
                                                value={tourChoosed}
                                                onChange={handleChooseTour}
                                                fullWidth
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                {tours.map((a, idx) =>
                                                    <MenuItem value={a} key={idx}>{a.title}</MenuItem>
                                                )}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                {checkedTour ?
                                    <Grid container xs={12} spacing={2}>
                                        {/* ngày bắt đầu */}
                                        <Grid item xs={6}>
                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                <KeyboardDatePicker
                                                    disableToolbar
                                                    variant="inline"
                                                    format="dd/MM/yyyy"
                                                    margin="normal"
                                                    id="tourChoosed-dateStart"
                                                    label="Ngày bắt đầu"
                                                    value={tourChoosed.dateStart}
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
                                                    id="tourChoosed-dateEnd"
                                                    label="Ngày kết thúc"
                                                    value={tourChoosed.dateEnd}
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
                                                id="price1"
                                                readOnly
                                                minRows={8}
                                                multiline
                                                label="Mô tả"
                                                value={tourChoosed.descriptions}
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
                                                value={tourChoosed.address[0].name}
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
                                                value={tourChoosed.address[1].name}
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
                                                value={tourChoosed.price1 + ' VNĐ'}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                variant="outlined"
                                                fullWidth
                                                id="price2"
                                                label="Giá vé cho trẻ em"
                                                readOnly
                                                value={tourChoosed.price2 + ' VNĐ'}
                                            />
                                        </Grid>
                                    </Grid>
                                    : <div></div>
                                }

                            </Grid>
                        </Grid>

                        {/* nút xử lý */}
                        <Grid container xs={12} spacing={2}>
                            <Grid item xs={5}>
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
                            <Grid item xs={7}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                >
                                    Tạo tour
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Container>

            {/* xử lý sau khi tạo mới tin thành công */}
            <Dialog
                open={open}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Thông báo</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn đã tạo mới tin du lịch thành công
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} autoFocus>
                        Quay về
                    </Button>
                    <Button onClick={handleContinue} color="primary" autoFocus>
                        Tiếp tục
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
