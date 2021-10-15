import React, { useEffect, useState } from 'react';
import {
    makeStyles,
    List,
    ListItem,
    TextField,
    Typography,
    Grid,
    Container,
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardMedia,
    CardContent
} from '@material-ui/core';
import {
    useHistory, useLocation
} from 'react-router-dom';
import Pagination from '@material-ui/lab/Pagination';
import API, { endpoints } from '../../helpers/API';
import { PublicRoutes } from '../../routes/public-route'
import SearchIcon from '@material-ui/icons/Search';

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
}));

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
            setLoading(true)
            await fetchNewsTourByPage()
        }
        init()
    }, [])

    // const fetchNewsTour = async () => {
    //     setTimeout(() => {
    //         API.get(endpoints['news-tour']).then(res => {
    //             setNewsTour(res.data.results)
    //             setCount(res.data.count)
    //             setLoading(false)
    //         })
    //     }, 500);
    // }

    const fetchNewsTourByPage = async (value) => {
        setTimeout(() => {
            const _path = endpoints['news-tour'] + (value ? `?page=${value}` : `?page=1`)
            API.get(_path).then(res => {
                setNewsTour(res.data.results)
                setCount(res.data.count)
                setLoading(false)
            })
        }, 500);
    }

    const handleNewsTour_click = (n) => {
        const _path = PublicRoutes.NewsTourDetail.path.replace(":id", n.id)
        history.push(_path, {
            newstour: n,
        })
    };

    const handleChange = (event, value) => {
        setPage(value);
        fetchNewsTourByPage(value);
    };

    const handleChangeTitle = (e) => {
        setTitle(e.target.value)
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

    const handleSearch = () => {
        fetchNewsTourByTitle()
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (

        <Container maxWidth='sm'>
            <Grid container xs={12} spacing={2}>
                {/* tìm kiếm title */}
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
                        onChange={handleChangeTitle}
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
                </Grid>


            </Grid>


            <Pagination count={Math.ceil(count / 6)} page={page} onChange={handleChange} />

            {loading ? <p>Loading ...</p> :
                (
                    newsTour.map((n, idx) =>
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
                                    <Typography gutterBottom variant="caption" component="h2" >
                                        {n.dateCreate}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" component="p">
                                        {n.descriptions}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    )
                )}




        </Container>


    );
}
