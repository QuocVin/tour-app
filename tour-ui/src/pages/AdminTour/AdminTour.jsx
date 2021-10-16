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
import { useStyles } from './AdminTour-styles';
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
        id: 'title',
        label: 'Tiêu đề',
        minWidth: 100,
        align: 'left',
    },
    {
        id: 'dateStart',
        label: 'Ngày đăng',
        minWidth: 100,
        align: 'left',
    },
    {
        id: 'dateEnd',
        label: 'Hạn',
        minWidth: 100,
        align: 'left',
    },
    {
        id: 'price1',
        label: 'Vé người lớn',
        minWidth: 100,
        align: 'right',
    },
    {
        id: 'price2',
        label: 'Vé trẻ em',
        minWidth: 150,
        align: 'right',
    },
    {
        id: 'pointStart',
        label: 'Điểm xuất phát',
        minWidth: 150,
        align: 'left',
    },
    {
        id: 'pointEnd',
        label: 'Điểm đến',
        minWidth: 150,
        align: 'left',
    },
    {
        id: 'static1',
        label: 'Trạng thái',
        minWidth: 150,
        align: 'left',
    },
];

function createData(stt, title, dateStart, dateEnd, price1, price2, pointStart, pointEnd, static1) {
    return { stt, title, dateStart, dateEnd, price1, price2, pointStart, pointEnd, static1 };
}

export default function AdminTour() {
    const classes = useStyles();
    const history = useHistory();
    const [loading, setLoading] = useState(false)
    const [title, setTitle] = useState('');

    const [tour, setTour] = useState([])

    useEffect(() => {
        async function init() {
            // setLoading(true)
            await fetchTour()
        }
        init()
    }, [])

    const fetchTour = async () => {
        setLoading(true)
        setTimeout(() => {
            const _path = endpoints['tour']
            API.get(_path).then(res => {
                setTour(
                    res.data.map((b, idx) =>
                        createData(idx + 1, b.title, b.dateStart, b.dateEnd, b.price1 + ' VNĐ'
                            , b.price2 + ' VNĐ', b.address[0].name, b.address[1].name, b.static)
                    )
                );
                setLoading(false)
            })
        }, 500);
    }

    const handleChangeTitle = (e) => {
        setTitle(e.target.value)
    };

    const handleSearch = () => {
        fetchTour()
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const handleChooseTour = (userId) => {
        // const _pathAPI = endpoints['user'] + endpoints['employee'] + `?id=${userId}`;
        // API.get(_pathAPI).then(res => {
        //     const _pathPage = ProtectRoutes.EmployeeDetail.path.replace(":id", userId)
        //     history.push(_pathPage, {
        //         user: res.data[0],
        //     })
        // })
        console.info('choose')
    }

    // chọn nút tạo mới
    const handleCreate = () => {
        const _path = ProtectRoutes.TourNew.path;
        history.push(_path);
    };

    return (

        <Container maxWidth='lg'>
            <Typography variant="h3">Quản lý tour</Typography>
            {/* tìm kiếm */}
            <Grid container xs={12} spacing={2}>
                <Grid item xs={5}>
                    <TextField
                        variant="outlined"
                        fullWidth
                        name="title"
                        label="tiêu đề bài viết . . ."
                        type="text"
                        id="title"
                        value={title}
                        onChange={handleChangeTitle}
                        onKeyDown={handleKeyDown}
                    />
                </Grid>
                <Grid item xs={7}>
                    <Button
                        // fullWidth
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
                <AppTable columns={columns} data={tour} handleChoose={handleChooseTour} />
            }

        </Container>


    );
}
