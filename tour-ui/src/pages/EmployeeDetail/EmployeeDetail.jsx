import React, { createRef, useEffect, useState } from 'react';
import {
    Button,
    CssBaseline,
    TextField,
    FormControlLabel,
    Checkbox,
    Link,
    Grid,
    Box,
    Typography,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { useStyles } from './EmployeeDetail-style';
import API, { endpoints } from '../../helpers/API';
import useSubmitForm from '../../helpers/CustomHooks'
import { useHistory, useLocation } from 'react-router';
import { ProtectRoutes } from '../../routes/protect-route';
import { PublicRoutes } from '../../routes/public-route';
import AppTable from '../../components/Table';

const columns = [
    { id: 'stt', label: 'STT', maxWidth: 20, align: 'center', },
    {
        id: 'title',
        label: 'Tiêu đề',
        minWidth: 100,
        align: 'left',
    },
    {
        id: 'descriptions',
        label: 'Mô tả',
        minWidth: 200,
        align: 'left',
    },
    {
        id: 'dateCreate',
        label: 'Ngày tạo',
        minWidth: 100,
        align: 'right',
    },
    {
        id: 'dateEnd',
        label: 'Ngày hết hạn',
        minWidth: 150,
        align: 'right',
    },
    {
        id: 'static1',
        label: 'trạng thái',
        minWidth: 150,
        align: 'center',
    },
];

const columnsBooking = [
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

function createData(stt, title, descriptions, dateCreate, dateEnd, static1,) {
    return { stt, title, descriptions, dateCreate, dateEnd, static1, };
}

function createBooking(stt, static1, people1, people2, total, tourId, employeeId) {
    return { stt, static1, people1, people2, total, tourId, employeeId };
}

export default function InfoCustomer() {
    const classes = useStyles();
    const avatar = createRef();
    const history = useHistory()
    const { state } = useLocation();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false)

    const [title, setTitle] = useState('')
    const [booking, setBooking] = useState([]);
    const [news, setNews] = useState([]);

    useEffect(() => {
        async function init() {
            setLoading(true)
            await fetchNews()
            await fetchBooking()
            setLoading(false)
        }
        init()
    }, [])

    const fetchNews = () => {
        const _pathAPI = endpoints['news-tour'] + endpoints['search-title'] + `?employee=${state?.user.id}&title=${title}`;
        API.get(_pathAPI).then(res => {
            setNews(
                res.data.map((b, idx) =>
                    createData(idx + 1, b.title, b.descriptions, b.dateCreate, b.dateEnd, b.static)
                )
            )
        })
    }

    const fetchBooking = () => {
        const _pathAPI = endpoints['booking'] + endpoints['current-employee'] + `?employee=${state?.user.id}`;
        API.get(_pathAPI).then(res => {
            setBooking(
                res.data.map((b, idx) =>
                    createBooking(idx + 1, b.static, b.people1 + ' người', b.people2 + ' bé', b.totalPrice + ' VNĐ', b.tour_id, b.employee_id),
                )
            )
        })
    }

    const create = async () => {
        const formData = new FormData();

        if (inputs.password === inputs.confirm_password) {
            for (let k in inputs) {
                if (k !== "confirm_password") formData.append(k, inputs[k]);
            }
        }

        formData.append("avatar", avatar.current.files[0]);
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

    const { inputs, handleInputChange, handleSubmit } = useSubmitForm(create);

    const handleBlack = () => {
        const _path = ProtectRoutes.Employee.path;
        history.push(_path);
    };

    // xử lý chuyển trang khi chọn bài viết
    const handleChooseNews = () => {
        // const _pathAPI = endpoints['user'] + endpoints['employee'] + `?id=${userId}`;
        // API.get(_pathAPI).then(res => {
        //     const _pathPage = ProtectRoutes.EmployeeDetail.path.replace(":id", userId)
        //     history.push(_pathPage, {
        //         user: res.data[0],
        //     })
        // })
        console.info('chưa xử lý')
    };

    // xử lý khi chọn giao dịch khách hàng để tránh bị lỗi
    const handleChooseBooking = () => {
        console.info('đã chọn')
    };

    // chức năng tìm kiếm nhân viên theo email
    const handleChangeEmail = (e) => {
        setTitle(e.target.value)
    };
    const handleSearch = () => {
        fetchNews()
    };

    // xử lý nut enter khi tìm kiếm
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    // chọn nút tạo mới
    const handleCreate = () => {
        const _path = ProtectRoutes.NewsTourCre.path;
        history.push(_path);
    };


    return (
        <Container maxWidth='lg'>
            <CssBaseline />
            <Typography variant="h3">Nhân viên {state?.user.username}</Typography>
            <Grid container xs={12} spacing={1}>
                {/* thông tin người dùng */}
                <Grid item xs={4}>
                    <Typography variant="h5">Thông tin</Typography>
                    <form className={classes.form} onSubmit={handleSubmit}>
                        {/* <form className={classes.form} > */}
                        <Grid container spacing={2}>
                            {/* Thông tin người dùng */}
                            <Grid item xs={12}>
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
                                            label={state?.user.last_name}
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
                                            label={state?.user.first_name}
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
                                            label={state?.user.email}
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
                                            label={state?.user.phone}
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
                                            label={state?.user.address}
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

                        {/* nút xử lý quay về hoặc thực hiện cập nhập */}
                        <Grid container spacing={5}>
                            <Grid item xs={4}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                    onClick={handleBlack}
                                >
                                    Quay về
                                </Button>
                            </Grid>
                            <Grid item xs={8}>
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
                </Grid>

                {/* lịch sử hoạt động */}
                <Grid item xs={8}>
                    <Typography variant="h4">Lịch sử hoạt động</Typography>

                    {/* các giao dịch liên quan */}
                    <Typography variant="h5">Các giao dịch với khách hàng</Typography>
                    {loading ? <p>Loading ...</p> :
                        <AppTable columns={columnsBooking} data={booking} handleChoose={handleChooseBooking} />
                    }
                </Grid>
            </Grid>

            <Typography variant="h5">Các bài viết đã đăng</Typography>
            {/* tìm kiếm */}
            <Grid container xs={12} spacing={2}>
                <Grid item xs={5}>
                    <TextField
                        autoComplete="username"
                        variant="outlined"
                        fullWidth
                        name="title"
                        label="tiêu đề bài viết . . ."
                        type="text"
                        id="title"
                        value={title}
                        onChange={handleChangeEmail}
                        onKeyDown={handleKeyDown}
                    />
                </Grid>
                <Grid item xs={2}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={handleSearch}
                    >
                        <SearchIcon />
                    </Button>
                    <Button
                        // fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={handleCreate}
                    >
                        Tạo mới
                    </Button>
                </Grid>
            </Grid>
            {/* các bài viết đã đăng */}
            <Grid container xs={12}>
                <Grid item>
                    {loading ? <p>Loading ...</p> :
                        <AppTable columns={columns} data={news} handleChoose={handleChooseNews} />
                    }
                </Grid>
            </Grid>
        </Container>
    );
}
