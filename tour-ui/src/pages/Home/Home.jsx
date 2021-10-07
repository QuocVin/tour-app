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
    CardContent
} from '@material-ui/core';
import {
    useHistory, useLocation
} from 'react-router-dom';
import Pagination from '@material-ui/lab/Pagination';
import API, { endpoints } from '../../helpers/API';
import { PublicRoutes} from '../../routes/public-route'

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

    const [loading, setLoading] = useState(false)


    useEffect(() => {
        async function init() {
            setLoading(true)
            await fetchNewsTour()
        }
        init()
    }, [])

    const fetchNewsTour = async () => {
        setTimeout(() => {
            API.get(endpoints['news-tour']).then(res => {
                setNewsTour(res.data.results)
                setCount(res.data.count)
                setLoading(false)
                // console.info('joblist: ', res.data.results)
            })
        }, 500);
    }

    const handleNewsTour_click = (n) => {
        // console.info('jobDetail_click: ', j)
        const _path = PublicRoutes.NewsTourDetail.path.replace(":id", n.id)
        history.push(_path, {
            newstour: n,
        })
    };

    const handleChange = (event, value) => {
        // console.info('page truoc:', page)
        // setPage(value);
        // console.info('page sau:', page)
        // fetchJobsByPage(page);
    };

    const handlePage_click = (page) => {
        // setPage(page);
    }


    return (

        <Container maxWidth='sm'>



            <div>count: {count}</div>
            {/* <Typography>Page: {page}</Typography> */}
            {/* <Pagination count={Math.ceil(count / 3)} page={page} onChange={handleChange} /> */}

            {loading ? <p>Loading ...</p> :
                (
                    newsTour.map((n, idx) =>
                        <Card className={classes.root} key={idx + n.id} onClick={() => handleNewsTour_click(n) }>
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
                )}




        </Container>


    );
}
