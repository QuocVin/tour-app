import React, { useEffect, useState } from 'react';
import {
    makeStyles,
    List,
    ListItem,
    ListItemText,
    Typography,
    Divider,
    Container,
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardMedia,
    CardContent,
    CssBaseline,
    TextField,
    FormControlLabel,
    Checkbox,
    Link,
    Grid,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    Select,
    InputLabel,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import {
    useHistory, useLocation
} from 'react-router-dom';
import Pagination from '@material-ui/lab/Pagination';
import API, { endpoints } from '../../helpers/API';
import { PublicRoutes } from '../../routes/public-route'

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
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));

export default function Test() {
    const classes = useStyles();
    const history = useHistory();
    const [newsTour, setNewsTour] = useState([]);
    const [title, setTitle] = useState('');


    const [loading, setLoading] = useState(false)


    useEffect(() => {
        async function init() {
            setLoading(true)
            await fetchNewsTour()
            // await fetchAddress()
            setLoading(false)
        }
        init()
    }, [])

    // const fetchAddress = async () => {
    //     setTimeout(() => {
    //         API.get(endpoints['address']).then(res => {
    //             setAddressList(res.data)
    //             console.info(res.data)
    //         })
    //     }, 500);
    // }

    const fetchNewsTour = async () => {
        setTimeout(() => {
            API.get(endpoints['news-tour']).then(res => {
                setNewsTour(res.data.results)
            })
        }, 500);
    }

    const handleNewsTour_click = (n) => {
        const _path = PublicRoutes.NewsTourDetail.path.replace(":id", n.id)
        history.push(_path, {
            newstour: n,
        })
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

    return (

        <Container maxWidth='sm'>
            {/* <Pagination count={Math.ceil(count / 6)} page={page} onChange={handleChange} /> */}

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
                    />
                </Grid>

                {/* tìm kiếm address */}
                {/* <Grid item xs={5}>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="address" variant='outlined'>Địa chỉ</InputLabel>
                        <Select
                            native
                            // value={address}
                            onChange={handleChangeAddress}
                            inputProps={{
                                name: 'address',
                                id: 'address',
                            }}
                        >
                            <option aria-label="None" value="" />
                            {addressList.map((a) => (
                                <option value={a.id} key={a.id}>{a.name}</option>
                            ))}
                        </Select>
                    </FormControl>
                </Grid> */}

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
                            <CardActions>
                                <Button size="small" color="primary">
                                    Share
                                </Button>
                                <Button size="small" color="primary">
                                    Learn More
                                </Button>
                            </CardActions>
                        </Card>
                    )
                )
            }




        </Container>


    );
}
