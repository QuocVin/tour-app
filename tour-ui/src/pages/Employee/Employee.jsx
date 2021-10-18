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
import { useStyles } from './Employee-styles';
import { useStore } from "react-redux";
import cookies from 'react-cookies';
import { useHistory } from 'react-router';
import Pagination from '@material-ui/lab/Pagination';
import AppTable from '../../components/Table';
import SearchIcon from '@material-ui/icons/Search';
import { ProtectRoutes } from '../../routes/protect-route';


const columns = [
    { id: 'stt', label: 'STT', maxWidth: 20, align: 'center', },
    {
        id: 'name',
        label: 'Tên nhân viên',
        minWidth: 100,
        align: 'left',
    },
    {
        id: 'username',
        label: 'Tài khoản',
        minWidth: 100,
        align: 'left',
    },
    {
        id: 'email',
        label: 'Email',
        minWidth: 100,
        align: 'left',
    },
    {
        id: 'phone',
        label: 'Số điện thoại',
        minWidth: 100,
        align: 'right',
    },
    {
        id: 'address',
        label: 'Địa chỉ',
        minWidth: 150,
        align: 'left',
        // format: (value) => value.toFixed(2),
    },
];

function createData(stt, name, username, email, phone, address, userId) {
    return { stt, name, username, email, phone, address, userId };
}

export default function Employee() {
    const classes = useStyles();
    const history = useHistory();
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('');

    const [users, setUsers] = useState([])

    // tải trang
    useEffect(() => {
        async function init() {
            // setLoading(true)
            await fetchUser()
        }
        init()
    }, [])

    // lấy dữ liệu danh sách nhân viên
    const fetchUser = async () => {
        setLoading(true)
        setTimeout(() => {
            const _path = endpoints['user'] + endpoints['employee'] + `?email=${email}`
            API.get(_path).then(res => {
                setUsers(
                    res.data.map((b, idx) =>
                        createData(idx + 1, b.last_name + ` ${b.first_name}` , b.username, b.email, b.phone, b.address, b.id),
                    )
                );
                setLoading(false)
            })
        }, 500);
    }

    // chức năng tìm kiếm nhân viên theo email
    const handleChangeEmail = (e) => {
        setEmail(e.target.value)
    };
    const handleSearch = () => {
        fetchUser()
    };

    // xử lý nut enter khi tìm kiếm
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    // chọn nhân viên trong bảng
    const handleChooseUser = (userId) => {
        const _pathAPI = endpoints['user'] + endpoints['employee'] + `?id=${userId}`;
        API.get(_pathAPI).then(res => {
            const _pathPage = ProtectRoutes.EmployeeDetail.path.replace(":id", userId)
            history.push(_pathPage, {
                userId: res.data[0].id,
            })
        })
    }

    // chọn nút tạo mới
    const handleCreate = () => {
        const _path = ProtectRoutes.EmployeeNew.path;
        history.push(_path);
    };

    return (

        <Container maxWidth='lg'>
            <Typography variant="h3">Quản lý nhân viên</Typography>
            {/* tìm kiếm */}
            <Grid container xs={12} spacing={2}>
                <Grid item xs={5}>
                    <TextField
                        autoComplete="username"
                        variant="outlined"
                        fullWidth
                        name="title"
                        label="email người dùng . . ."
                        type="text"
                        id="title"
                        value={email}
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

            {/* bản thông tin */}
            {loading ? <p>Loading ...</p> :
                <AppTable columns={columns} data={users} handleChoose={handleChooseUser} />
            }

        </Container>


    );
}
