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
    CssBaseline,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Snackbar,
} from '@material-ui/core';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import MuiAlert from '@material-ui/lab/Alert';
import DateFnsUtils from '@date-io/date-fns';
import { useStyles } from './AdminTourNew-styles';
import API, { endpoints } from '../../helpers/API';
import useSubmitForm from '../../helpers/CustomHooks'
import { useHistory } from 'react-router';
import { ProtectRoutes } from '../../routes/protect-route';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function CreateTour(props) {
    const classes = useStyles();
    const history = useHistory()
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [textError, setTextError] = useState('');

    const [address, setAddress] = useState([]);
    const [type, setType] = useState([]);
    const [loading, setLoading] = useState(false)


    // lấy thời gian ngày hiện tại
    const current = new Date();
    const date = `${current.getFullYear()}-${current.getMonth() + 1}-${current.getDate()}`
    const [dateStart, setDateStart] = useState(new Date(date));
    const [dateEnd, setDateEnd] = useState(new Date(date));

    useEffect(() => {
        async function init() {
            // setLoading(true)
            await fetchAddress()
            await fetchType()
        }
        init()
    }, [])

    // lấy dữ liệu về address
    const fetchAddress = async () => {
        setLoading(true)
        setTimeout(() => {
            const _path = endpoints['address']
            API.get(_path).then(res => {
                setAddress(res.data);
                setLoading(false)
            })
        }, 500);
    }

    // lấy dữ liệu về type
    const fetchType = async () => {
        setLoading(true)
        setTimeout(() => {
            const _path = endpoints['type']
            API.get(_path).then(res => {
                setType(res.data);
                setLoading(false)
            })
        }, 500);
    }

    // xử lý lấy dữ liệu date
    const handleDateStart = (date) => {
        setDateStart(date);
    };
    const handleDateEnd = (date) => {
        setDateEnd(date);
    };

    // api post tạo mới tour
    const create = async () => {
        const formData = new FormData();
        let type1 = [inputs["type"]]
        let address3 = [
            inputs["address1"], inputs["address2"]
        ]
        formData.append("type", type1);
        formData.append("address", address3);

        formData.append("static", "DANG MO");
        formData.append("descriptions", inputs["descriptions"]);
        formData.append("title", inputs["title"]);
        formData.append("price1", inputs["price1"]);
        formData.append("price2", inputs["price2"]);

        formData.append("dateStart", dateStart.toLocaleDateString('ko-KR').replace(". ", "-").replace(". ", "-").replace(".", ""));
        formData.append("dateEnd", dateEnd.toLocaleDateString('ko-KR').replace(". ", "-").replace(". ", "-").replace(".", ""));

        // for (var key of formData.keys()) {
        //     console.log(key, formData.get(key));
        // }

        if (formData.get('type') == "" || inputs["address1"] == null || inputs["address2"] == null) {
            setOpenError(true);
            setTextError('Lỗi! Bạn phải chọn cả 2 địa chỉ và hình thức');
        } else if (formData.get('price1') < 0 || formData.get('price2') < 0) {
            setOpenError(true);
            setTextError('Giá tour phải là số dương');
        } else if (dateStart.getTime() < current.getTime()) {
            setOpenError(true);
            setTextError('Lỗi! Ngày được chọn là ngày đã ở quá khứ');
        } else if (dateEnd.getTime() < dateStart.getTime()) {
            setOpenError(true);
            setTextError('Lỗi! Ngày kết thúc đến trước ngày khởi hành');
        } else {
            try {
                let res = await API.post(endpoints["tour"], formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                if (res)
                    setOpen(true);
            } catch (err) {
                console.log("ERROR:\n", err);
            }
        }
    };

    const { inputs, handleInputChange, handleSubmit } = useSubmitForm(create);

    // chọn nút quay về trên cửa số thông báo
    const handleCloseDialog = () => {
        setOpen(false);
        const _path = ProtectRoutes.Tour.path;
        history.push(_path);
    };

    // chọn nút tiếp tục trên cửa số thông báo
    const handleContinue = () => {
        setOpen(false);
        window.location.reload();
    };

    // đóng mở select address
    const handleClose1 = () => {
        setOpen1(false);
    };
    const handleOpen1 = () => {
        setOpen1(true);
    };
    const handleClose2 = () => {
        setOpen2(false);
    };
    const handleOpen2 = () => {
        setOpen2(true);
    };
    const handleClose3 = () => {
        setOpen3(false);
    };
    const handleOpen3 = () => {
        setOpen3(true);
    };

    // nhấn nút quay về
    const handleBack = () => {
        const _path = ProtectRoutes.Tour.path;
        history.push(_path);
    };

    // đóng thông báo sau khi xem lỗi error1
    const handleCloseError = (event, reason) => {
        if (reason === 'clickaway') {
            setOpenError(false);
        }
    };

    return (
        <div>
            <Container component="main" maxWidth="lg">
                <CssBaseline />
                <div className={classes.paper}>
                    <Typography variant="h3">Thông tin tour du lịch</Typography>
                    <form className={classes.form} onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            {/* các thông tin về tour */}
                            <Grid item xs={5}  >
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

                                    {/* type */}
                                    <Grid item xs={7}>
                                        <FormControl className={classes.formControl}>
                                            <InputLabel id="type-label">Hình thức</InputLabel>
                                            <Select
                                                labelId="type-label"
                                                id="type"
                                                name="type"
                                                open={open3}
                                                onClose={handleClose3}
                                                onOpen={handleOpen3}
                                                value={inputs.type}
                                                onChange={handleInputChange}
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                {type.map((a, idx) =>
                                                    <MenuItem value={a.id} key={idx}>{a.name}</MenuItem>
                                                )}
                                            </Select>
                                        </FormControl>
                                    </Grid>

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
                                                value={dateStart}
                                                onChange={handleDateStart}
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
                                                value={dateEnd}
                                                onChange={handleDateEnd}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date',
                                                }}
                                            />
                                        </MuiPickersUtilsProvider>
                                    </Grid>

                                    {/* giá vé */}
                                    <Grid item xs={6}>
                                        <TextField
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="price1"
                                            type="number"
                                            name="price1"
                                            label="Giá vé cho người lớn"
                                            value={inputs.price1}
                                            onChange={handleInputChange}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="price2"
                                            name="price2"
                                            label="Giá vé cho trẻ em"
                                            type="number"
                                            value={inputs.price2}
                                            onChange={handleInputChange}
                                        />
                                    </Grid>

                                    {/* điểm xuất phát */}
                                    <Grid item xs={6} >
                                        <FormControl className={classes.formControl}>
                                            <InputLabel id="address1-label">Điểm xuất phát</InputLabel>
                                            <Select
                                                labelId="address1-label"
                                                id="address1"
                                                name="address1"
                                                open={open1}
                                                onClose={handleClose1}
                                                onOpen={handleOpen1}
                                                value={inputs.address1}
                                                onChange={handleInputChange}
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                {address.map((a, idx) =>
                                                    <MenuItem value={a.id} key={idx}>{a.name}</MenuItem>
                                                )}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    {/* điểm đến */}
                                    <Grid item xs={6} >
                                        <FormControl className={classes.formControl}>
                                            <InputLabel id="address2-label">Điểm đến</InputLabel>
                                            <Select
                                                labelId="address2-label"
                                                id="address2"
                                                name="address2"
                                                open={open2}
                                                onClose={handleClose2}
                                                onOpen={handleOpen2}
                                                value={inputs.address2}
                                                onChange={handleInputChange}
                                            // required
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                {address.map((a, idx) =>
                                                    <MenuItem value={a.id} key={idx}>{a.name}</MenuItem>
                                                )}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/* mô tả chi tiết */}
                            <Grid item xs={7}>
                                <Grid container xs={12} spacing={2}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="descriptions"
                                        name="descriptions"
                                        label="Mô tả chi tiết"
                                        value={inputs.descriptions}
                                        onChange={handleInputChange}
                                        minRows={13}
                                        multiline
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

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
                        Bạn đã tạo mới tour du lịch thành công
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

            {/* xử lý thông báo khi tạo tour không thành công */}
            <Snackbar open={openError} autoHideDuration={6000} onClose={handleCloseError}>
                <Alert onClose={handleCloseError} severity="warning">
                    {textError}
                </Alert>
            </Snackbar>
        </div>
    );
}
