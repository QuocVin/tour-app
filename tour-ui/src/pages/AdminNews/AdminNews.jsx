import React, { useEffect, useState } from 'react';
import {
    Grid,
    Typography,
    Container,
    Button,
    TextField,
} from '@material-ui/core';
import API, { endpoints } from '../../helpers/API';
import { useStyles } from './AdminNews-styles';
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
        id: 'dateCreate',
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
        id: 'descriptions',
        label: 'Mô tả',
        maxWidth: 200,
        align: 'left',
    },
    {
        id: 'static1',
        label: 'Trạng thái',
        minWidth: 150,
        align: 'left',
    },
];

function createData(stt, title, dateCreate, dateEnd, descriptions, static1, userId) {
    return { stt, title, dateCreate, dateEnd, descriptions, static1, userId };
}

export default function AdminNews() {
    const classes = useStyles();
    const history = useHistory();
    const [loading, setLoading] = useState(false)
    const [title, setTitle] = useState('');

    const [news, setNews] = useState([])

    useEffect(() => {
        async function init() {
            await fetchNews()
        }
        init()
    }, [])

    // lấy danh sách bài viết
    const fetchNews = async () => {
        setLoading(true)
        setTimeout(() => {
            const _path = endpoints['news-tour'] + endpoints['search-title'] + `?title=${title}`
            API.get(_path).then(res => {
                setNews(
                    res.data.map((b, idx) =>
                        createData(idx + 1, b.title, b.dateCreate, b.dateEnd, b.descriptions, b.static, b.id)
                    )
                );
                setLoading(false)
            })
        }, 500);
    }

    // xử lý tìm kiếm bài viết bằng title
    const handleChangeTitle = (e) => {
        setTitle(e.target.value)
    };
    const handleSearch = () => {
        fetchNews()
    };

    // xử lý nút enter khi tìm kiếm
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    // chọn bài viết
    const handleChooseNews = (newsId) => {
        const _pathAPI = endpoints['news-tour'] + `${newsId}/`;
        API.get(_pathAPI).then(res => {
            const _pathPage = ProtectRoutes.NewsTourDetail.path.replace(":id", newsId)
            history.push(_pathPage, {
                newsId: res.data.id,
                tourId: res.data.tour,
            })
        })
    }

    // chọn nút tạo mới
    const handleCreate = () => {
        const _path = ProtectRoutes.NewsTourCre.path;
        history.push(_path);
    };

    return (

        <Container maxWidth='lg'>
            <Typography variant="h3">Quản lý tin du lịch</Typography>
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
                <AppTable columns={columns} data={news} handleChoose={handleChooseNews} />
            }

        </Container>


    );
}
