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
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    TextareaAutosize
} from '@material-ui/core';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { useStyles } from './AdminTourNew-styles';
import API, { endpoints } from '../../helpers/API';
import useSubmitForm from '../../helpers/CustomHooks'
import { useHistory } from 'react-router';
import { ProtectRoutes } from '../../routes/protect-route';

export default function CreateTour(props) {
    const classes = useStyles();
    const avatar = createRef();
    const history = useHistory()
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [address, setAddress] = useState([]);
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
        }
        init()
    }, [])

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

    const handleDateStart = (date) => {
        setDateStart(date);
    };
    const handleDateEnd = (date) => {
        setDateEnd(date);
    };

    const create = async () => {
        const formData = new FormData();

        for (let k in inputs) {
            formData.append(k, inputs[k]);
        }

        // formData.append("role", "NGUOI DUNG");
        // nếu lưu ngày 10/10/2020 lỗi thì dùng tiếp hàm replace
        formData.append("dateStart", dateStart.toLocaleDateString('en-GB'));
        formData.append("dateEnd", dateEnd.toLocaleDateString('en-GB'));

        for (var key of formData.keys()) {
            console.log(key, formData.get(key));
        }
        // console.info('date', date)

        // try {
        //     let res = await API.post(endpoints["user"], formData, {
        //         headers: {
        //             "Content-Type": "multipart/form-data",
        //         },
        //     });
        //     console.info("res:", res)
        //     if (res)
        //         setOpen(true);
        // } catch (err) {
        //     console.log("ERROR:\n", err);
        // }
    };

    const { inputs, handleInputChange, handleSubmit } = useSubmitForm(create);

    // const handleCloseDialog = () => {
    //     setOpen(false);
    //     const _path = PublicRoutes.Login.path;
    //     history.push(_path);
    // };

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

    const handleBack = () => {
        const _path = ProtectRoutes.Tour.path;
        history.push(_path);
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
            {/* <Dialog
                open={open}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Bạn đã đăng ký thành công</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Vui lòng đăng nhập để tiếp tục dịch vụ
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary" autoFocus>
                        Đăng nhập
                    </Button>
                </DialogActions>
            </Dialog> */}
        </div>
    );
}
