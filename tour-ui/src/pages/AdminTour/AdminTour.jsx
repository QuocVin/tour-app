import React, { useEffect, useState } from 'react';
import {
    Grid,
    Typography,
    Container,
    Button,
    TextField,
} from '@material-ui/core';
import API, { endpoints } from '../../helpers/API';
import { useStyles } from './AdminTour-styles';
import { useHistory } from 'react-router';
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
    // {
    //     id: 'pointStart',
    //     label: 'Điểm xuất phát',
    //     minWidth: 150,
    //     align: 'left',
    // },
    // {
    //     id: 'pointEnd',
    //     label: 'Điểm đến',
    //     minWidth: 150,
    //     align: 'left',
    // },
    {
        id: 'static1',
        label: 'Trạng thái',
        minWidth: 150,
        align: 'left',
    },
];

// function createData(stt, title, dateStart, dateEnd, price1, price2, pointStart, pointEnd, static1, userId) {
//     return { stt, title, dateStart, dateEnd, price1, price2, pointStart, pointEnd, static1, userId };
// }

function createData(stt, title, dateStart, dateEnd, price1, price2, static1, userId) {
    return { stt, title, dateStart, dateEnd, price1, price2, static1, userId };
}

export default function AdminTour() {
    const classes = useStyles();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');

    const [tour, setTour] = useState([])

    useEffect(() => {
        async function init() {
            // setLoading(true)
            await fetchTour()
        }
        init()
    }, [])

    // lấy danh sách tour
    const fetchTour = async () => {
        setLoading(true)
        setTimeout(() => {
            // const _path = endpoints['tour']
            const _path = endpoints['tour'] + endpoints['tour-search'] + `?title=${title}`
            API.get(_path).then(res => {
                setTour(
                    res.data.map((b, idx) =>
                        // createData(idx + 1, b.title, b.dateStart, b.dateEnd, b.price1 + ' VNĐ'
                        //     , b.price2 + ' VNĐ', b.address[0].name, b.address[1].name, b.static, b.id)
                        createData(idx + 1, b.title, b.dateStart, b.dateEnd, b.price1 + ' VNĐ'
                            , b.price2 + ' VNĐ', b.static, b.id)
                    )
                );
                setLoading(false)
            })
        }, 500);
    }

    // tìm kiếm bằng title
    const handleChangeTitle = (e) => {
        setTitle(e.target.value)
    };
    const handleSearch = () => {
        fetchTour()
    };

    // xử lý nút enter khi tìm
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    // chọn tour trong danh sách
    const handleChooseTour = (tourId) => {
        const _pathAPI = endpoints['tour'] + `${tourId}/`;
        API.get(_pathAPI).then(res => {
            const _pathPage = ProtectRoutes.TourDetail.path.replace(":id", tourId)
            history.push(_pathPage, {
                tourId: res.data.id,
            })
        })
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
            <Grid container xs={12}>
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
                <AppTable columns={columns} data={tour} handleChoose={handleChooseTour} />
            }
        </Container>
    );
}
