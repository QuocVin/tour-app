import React, { useEffect, useState } from 'react';
import {
    TextField,
    Typography,
    Grid,
    Container,
    Button,
    Card,
    CardActionArea,
    CardMedia,
    CardContent
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import Pagination from '@material-ui/lab/Pagination';
import API, { endpoints } from '../../helpers/API';
import { PublicRoutes } from '../../routes/public-route'
import SearchIcon from '@material-ui/icons/Search';
import { useStyles } from './Home-styles';

export default function Test() {
    const classes = useStyles();
    const history = useHistory()
    const [newsTour, setNewsTour] = useState([]);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(1);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function init() {
            await fetchNewsTourByPage()
        }
        init()
    }, [])

    // lấy danh sách cái bài viết
    const fetchNewsTourByPage = async (value) => {
        setLoading(true)
        setTimeout(() => {
            const _path = endpoints['news-tour'] + (value ? `?page=${value}` : `?page=1`)
            API.get(_path).then(res => {
                setNewsTour(res.data.results)
                setCount(res.data.count)
                setLoading(false)
            })
            setLoading(false)
        }, 500);
    }

    // chuyển trang sau khi chọn bài viết
    const handleNewsTour_click = (n) => {
        const _path = PublicRoutes.NewsTourDetail.path.replace(":id", n.id)
        history.push(_path, {
            newstour: n,
        })
    };

    // chuyển trang
    const handleChange = (event, value) => {
        setPage(value);
        fetchNewsTourByPage(value);
    };

    // tìm kiếm bài viết thông qua title bài viết
    const fetchNewsTourByTitle = async () => {
        setTimeout(() => {
            setLoading(true)
            const _path = endpoints['news-tour'] + endpoints['search-title'] + `?title=${title}`
            API.get(_path).then(res => {
                setNewsTour(res.data)
                setLoading(false)
                // console.info(res.data)
            })
        }, 500);
    }

    // chọn nút tìm kiếm
    const handleChangeTitle = (e) => {
        setTitle(e.target.value)
    };
    const handleSearch = () => {
        fetchNewsTourByTitle()
    };

    // xử lý nút enter khi tìm kiếm
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (

        <Container maxWidth='lg' >
            <Grid container xs={12} className={classes.action}>
                {/* tìm kiếm title */}
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

                {/* chuyển trang */}
                <Grid item xs={5} >
                    <Pagination count={Math.ceil(count / 6)} page={page} onChange={handleChange} className={classes.pagination} size='large'/>
                </Grid>
            </Grid>

            {/* các bài viết */}
            <Grid container xs={12} spacing={10} >
                {loading ? <p>Loading ...</p> :
                    (
                        newsTour.map((n, idx) =>
                            <Grid item xs={6}>
                                <Card className={classes.root} key={idx + n.id} onClick={() => handleNewsTour_click(n)}>
                                    <CardActionArea>
                                        <CardMedia
                                            className={classes.media}
                                            image={n.image}
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="h2">
                                                {n.title}
                                            </Typography>
                                            <Typography gutterBottom variant="body" >
                                                đăng ngày {n.dateCreate}
                                            </Typography>
                                            <Typography variant="body2" component="p" className={classes.mediaContent}>
                                                {n.descriptions.slice(0, 170) + ' . . . Xem chi tiết'}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        )
                    )
                }

            </Grid>

        </Container>


    );
}
