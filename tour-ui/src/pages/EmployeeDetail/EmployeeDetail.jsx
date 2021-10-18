import React, { createRef, useEffect, useState } from 'react';
import {
    Button,
    CssBaseline,
    TextField,
    Grid,
    Typography,
    Container,
    Snackbar,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
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

function createData(stt, title, descriptions, dateCreate, dateEnd, static1, userId) {
    return { stt, title, descriptions, dateCreate, dateEnd, static1, userId };
}

function createBooking(stt, static1, people1, people2, total, tourId, employeeId) {
    return { stt, static1, people1, people2, total, tourId, employeeId };
}

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function InfoCustomer() {
    const classes = useStyles();
    const avatar = createRef();
    const history = useHistory()
    const { state } = useLocation();
    const [user, setUser] = useState([]);

    const [openSuccess, setOpenSuccess] = useState(false);
    const [loading, setLoading] = useState(false)

    const [title, setTitle] = useState('')
    const [booking, setBooking] = useState([]);
    const [news, setNews] = useState([]);

    useEffect(() => {
        async function init() {
            setLoading(true)
            await fetchUser()
            await fetchNews()
            await fetchBooking()
        }
        init()
    }, [])

    // lấy thông tin nhân viên
    const fetchUser = () => {
        setTimeout(() => {
            const _pathAPI = endpoints['user'] + endpoints['employee'] + `?id=${state?.userId}`;
            API.get(_pathAPI).then(res => {
                setUser(res.data[0])
            })
        }, 500);
    }

    // lấy thông tin các bài viết đã đăng
    const fetchNews = () => {
        setTimeout(() => {
            const _pathAPI = endpoints['news-tour'] + endpoints['search-title'] + `?employee=${state?.userId}&title=${title}`;
            API.get(_pathAPI).then(res => {
                setNews(
                    res.data.map((b, idx) =>
                        createData(idx + 1, b.title, b.descriptions, b.dateCreate, b.dateEnd, b.static, b.id)
                    )
                )
            })
        }, 500);
    }

    // lấy thông tin các booking liên quan
    const fetchBooking = () => {
        setTimeout(() => {
            const _pathAPI = endpoints['booking'] + endpoints['current-employee'] + `?employee=${state?.userId}`;
            API.get(_pathAPI).then(res => {
                setBooking(
                    res.data.map((b, idx) =>
                        createBooking(idx + 1, b.static, b.people1 + ' người', b.people2 + ' bé', b.totalPrice + ' VNĐ', b.tour_id, b.employee_id),
                    )
                )
            })
            setLoading(false);
        }, 500);
    }

    // api patch thay đổi thông tin các nhân nhân viên
    const changeInfo = async () => {
        const formData = new FormData();

        for (let k in inputs) {
            formData.append(k, inputs[k]);
        }

        if (avatar.current.files.length !== 0) {
            formData.append("avatar", avatar.current.files[0]);
        }

        for (var key of formData.keys()) {
            console.log(key, formData.get(key));
        }
        try {
            const _path = endpoints["user"] + `${state?.userId}/`
            let res = await API.patch(_path, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (res)
                setOpenSuccess(true);
        } catch (err) {
            console.log("ERROR:\n", err);
        }
    };

    const { inputs, handleInputChange, handleSubmit } = useSubmitForm(changeInfo);

    // chọn nút quay về
    const handleBlack = () => {
        const _path = ProtectRoutes.Employee.path;
        history.push(_path);
    };

    // xử lý chuyển trang khi chọn bài viết
    const handleChooseNews = (newsId) => {
        const _pathAPI = endpoints['news-tour'] + `${newsId}/`;
        API.get(_pathAPI).then(res => {
            const _pathPage = ProtectRoutes.NewsTourDetail.path.replace(":id", newsId)
            history.push(_pathPage, {
                newsId: res.data.id,
                tourId: res.data.tour,
            })
            console.info('data', res.data.tour)
        })
    }

    // chuyển về trang đăng tin tức tour đã booking
    const handleChooseBooking = (tourId, employeeId) => {
        const _pathAPI = endpoints['news-tour'] + endpoints['have-tour'] + `?tour=${tourId}&employee=${employeeId}`;
        API.get(_pathAPI).then(res => {
            const _pathPage = PublicRoutes.NewsTourDetail.path.replace(":id", res.data[0].id)
            history.push(_pathPage, {
                newstour: res.data[0],
            })
        })
    }

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

    // xử lý sau khi hiện thông báo
    const handleCloseAlert = () => {
        setOpenSuccess(false);
        window.location.reload();
    };


    return (
        <Container maxWidth='lg'>
            <CssBaseline />
            <Typography variant="h3">Nhân viên {user.username}</Typography>
            <Grid container xs={12} spacing={1}>
                {/* thông tin người dùng */}
                <Grid item xs={4}>
                    <Typography variant="h5">Thông tin</Typography>
                    <form className={classes.form} onSubmit={handleSubmit}>
                        {/* <form className={classes.form} > */}
                        <Grid container spacing={2}>
                            {/* Thông tin người dùng */}
                            {loading ? <p>loading . . .</p> :
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
                            }
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
                        <AppTable columns={columnsBooking} data={booking} handleChooseBooking={handleChooseBooking} />
                    }
                </Grid>
            </Grid>

            <Typography variant="h5">Các bài viết đã đăng</Typography>
            {/* tìm kiếm */}
            <Grid container xs={12}>
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
                        className={classes.search}
                        onClick={handleSearch}
                    >
                        <SearchIcon />
                    </Button>
                </Grid>

                <Grid item xs={5}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.btnCreate}
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

            {/* xử lý thông báo khi thực hiện cập nhập */}
            <Snackbar open={openSuccess} autoHideDuration={6000} onClose={handleCloseAlert}>
                <Alert onClose={handleCloseAlert} severity="success">
                    Bạn đã cập nhập thành công
                </Alert>
            </Snackbar>
        </Container>
    );
}
