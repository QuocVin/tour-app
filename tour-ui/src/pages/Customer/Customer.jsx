import React, { useEffect, useState } from 'react';
import {
    Grid,
    Typography,
    Container,
    Button,
    TextField,
} from '@material-ui/core';
import API, { endpoints } from '../../helpers/API';
import { useStyles } from './Customer-styles';
import { useHistory } from 'react-router';
import AppTable from '../../components/Table';
import SearchIcon from '@material-ui/icons/Search';
import { ProtectRoutes } from '../../routes/protect-route';

const columns = [
    { id: 'stt', label: 'STT', maxWidth: 20, align: 'center', },
    {
        id: 'name',
        label: 'Tên người dùng',
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

export default function Customer() {
    const classes = useStyles();
    const history = useHistory();
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('');

    const [users, setUsers] = useState([])

    useEffect(() => {
        async function init() {
            setLoading(true)
            await fetchUser()
        }
        init()
    }, [])

    // lấy thông tin người dùng + tìm kiếm người dùng thông qua request
    const fetchUser = async () => {
        setTimeout(() => {
            const _path = endpoints['user'] + endpoints['customer'] + `?email=${email}`
            API.get(_path).then(res => {
                setUsers(
                    res.data.map((b, idx) =>
                        createData(idx + 1, b.first_name + ` ${b.last_name}`, b.username, b.email, b.phone, b.address, b.id),
                    )
                );
                setLoading(false)
            })
        }, 500);
    }

    // xử lý lấy value trong ô input nhập email
    const handleChangeEmail = (e) => {
        setEmail(e.target.value)
    };

    // chọn nút tìm kiếm
    const handleSearch = () => {
        fetchUser()
    };

    // xử lý nút Enter khi tìm kiếm
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    // chọn nút tạo mới
    const handleCreate = () => {
        const _path = ProtectRoutes.CustomerNew.path;
        history.push(_path);
    };

    // chọn người dùng trong bảng
    const handleChooseUser = (userId) => {
        const _pathAPI = endpoints['user'] + endpoints['customer'] + `?id=${userId}`;
        API.get(_pathAPI).then(res => {
            const _pathPage = ProtectRoutes.CustomerDetail.path.replace(":id", userId)
            history.push(_pathPage, {
                userId: res.data[0].id,
            })
        })
    }

    return (
        <Container maxWidth='lg'>
            <Typography variant="h3">Danh sách khách hàng</Typography>
            {/* tìm kiếm */}
            <Grid container xs={12} >
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

            {/* bản thông tin */}
            {loading ? <p>Loading ...</p> :
                <AppTable columns={columns} data={users} handleChoose={handleChooseUser} />
            }
        </Container>


    );
}
