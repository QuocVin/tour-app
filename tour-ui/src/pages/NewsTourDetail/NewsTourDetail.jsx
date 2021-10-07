import React, { useEffect, useState } from 'react';
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
} from '@material-ui/core';
import {
    useHistory, useLocation
} from 'react-router-dom';
import API, { endpoints } from '../../helpers/API';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useStore } from "react-redux";
import cookies from 'react-cookies';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 500,
        backgroundColor: theme.palette.background.paper,
    },
    item: {
        backgroundColor: "gainsboro",
        marginBottom: "10px",
    },
    media: {
        height: 140,
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

export default function NewsTourDetail() {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const { state } = useLocation();
    const history = useHistory();
    const [tour, setTour] = useState([]);
    const [bookingInfo, setBookingInfo] = useState([]);

    const [people1, setPeople1] = useState();
    const [people2, setPeople2] = useState();
    const [check, setCheck] = useState(false);

    const [loading, setLoading] = useState(false)

    const store = useStore();
    const auth = store.getState();
    let user = auth;
    if (cookies.load("user") != null) {
        user = cookies.load("user")
    };

    useEffect(() => {
        async function init() {
            setLoading(true)
            await fetchTour()
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
            const _path = endpoints['tour-detail'].replace(":id", `${state?.newstour?.tour}`)
            API.get(_path).then(res => {
                setTour(res.data)
                setLoading(false)
                // console.info('tour: ', res.data)
            })
        }, 500);
    }

    // kiểm tra khách hàng đã đặt tour chưa - chỉnh sửa số lượng ?
    const fetchCheckBooking = async () => {
        setTimeout(() => {
            const _path = endpoints['booking'] + endpoints['check-booking'] + `?tour=${state?.newstour?.tour}&customer=${user.id}`;
            API.get(_path).then(res => {
                setLoading(false)
                // console.info('res.data', res.data[0].static)
                if (res.data.length == 0)
                    setCheck(false)
                else {
                    // if (res.data[0].static == "HUY TOUR")
                    //     setCheck(false)
                    // else
                    setCheck(true)
                    setBookingInfo(res.data)
                    console.info('res.data', res.data)
                }
            })
        }, 500);
    }

    // api post booking
    const booking = async () => {
        try {
            let pay = people1 * tour.price1 + people2 * tour.price2
            const body = {
                "people1": people1,
                "people2": people2,
                "totlePrice": pay,
                "employee": `${state?.newstour?.employee}`,
                "customer": user.id,
                "tour": tour.id
            }
            let res = await API.post(endpoints['booking'], body)
        } catch (err) {
            console.info(err)
        }
    }

    // api patch booking - thay đổi thông tin
    const changeBooking = async () => {
        try {
            let pay = people1 * tour.price1 + people2 * tour.price2
            const body = {
                "people1": people1,
                "people2": people2,
                "totlePrice": pay,
                "static": "DAT TOUR"
            }
            const _path = endpoints['booking'] + `${bookingInfo[0].id}/`
            let res = await API.patch(_path, body)
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
            // console.info(bookingInfo[0].id)
        } else {
            history.push('/login')
        }
    };

    const handleClose_click = () => {
        setOpen(false);
    };

    const handleChangePeople1 = (e) => {
        setPeople1(e.target.value)
    };

    const handleChangePeople2 = (e) => {
        setPeople2(e.target.value)
    };

    return (

        <Container maxWidth='lg'>
            <h1>{`${state?.newstour?.title}`}</h1>

            {loading ? <p>Loading ...</p> :
                (

                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <div>Đăng ngày {`${state?.newstour?.dateCreate}`}</div>
                            <img src={`${state?.newstour?.image}`} alt={`${state?.newstour?.title}`} />

                        </Grid>
                        <Grid item xs={6}>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography className={classes.heading}>Mô tả</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                        {`${state?.newstour?.descriptions}`}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>

                            <List
                                component="nav"
                                aria-labelledby="nested-list-subheader"
                                subheader={
                                    <ListSubheader component="div" color="primary" id="nested-list-subheader">
                                        Thông tin
                                    </ListSubheader>
                                }
                                className={classes.root}
                            >
                                <ListItem button>
                                    <ListItemText secondary="Giá vé người lớn: " />
                                    <ListItemText primary={`${tour.price1} VNĐ`} />
                                </ListItem>
                                <ListItem button>
                                    <ListItemText secondary="Giá vé trẻ em: " />
                                    <ListItemText primary={`${tour.price2} VNĐ`} />
                                </ListItem>
                                <ListItem button >
                                    <ListItemText secondary="Đặt đến ngày: " />
                                    <ListItemText primary={tour.dateEnd} />
                                </ListItem>

                            </List>
                            {/* {check ? (
                                <div>
                                    <Button onClick={() => handlOpen_click()}>Bạn đã đặt tour này</Button>
                                </div>
                            ) : (
                                <div>

                                </div>
                            )} */}
                            <Button onClick={() => handlOpen_click()}>Đặt tour</Button>

                            < Dialog open={open} onClose={handleClose_click} aria-labelledby="form-dialog-title">
                                <DialogTitle id="form-dialog-title">Thông tin đơn hàng</DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        To subscribe to this website, please enter your email address here. We will send updates
                                        occasionally.
                                    </DialogContentText>
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

                        </Grid>

                    </Grid>


                )
            }




        </Container >



    );
}
