import React, { useEffect, useState } from 'react';
import {
    Typography,
    Container,
    Grid,
    TextField,
    Button,
} from '@material-ui/core';
import { useStyles } from './Dashboard-styles';
import API, { endpoints } from '../../helpers/API';
import { Bar } from 'react-chartjs-2';

const month = [
    'tháng 1', 'tháng 2', 'tháng 3', 'tháng 4', 'tháng 5', 'tháng 6',
    'tháng 7', 'tháng 8', 'tháng 9', 'tháng 10', 'tháng 11', 'tháng 12',
]

export default function Dashboard() {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [count, setCount] = useState(0);
    const [year, setYear] = useState('2021');

    useEffect(() => {
        async function init() {
            setLoading(true)
            await fetchCountByYear()
        }
        init()
    }, [])

    // chart thống kê theo năm
    const fetchCountByYear = () => {
        setTimeout(() => {
            const _pathAPI = endpoints['booking'] + endpoints['year-booking'] + `?year=${year}`
            API.get(_pathAPI).then(res => {
                setCount(res.data)
            })
            setLoading(false);
        }, 500);
    }

    const handleChange = (event) => {
        setYear(event.target.value);
    }

    const chartData = {
        labels: month,
        datasets: [
            {
                label: 'booking',
                data: count,
                // data: [
                //     1111,
                //     2222,
                //     3333,
                //     1122,
                //     3322,
                //     2233,
                //     1111,
                //     2222,
                //     3333,
                //     1122,
                //     3322,
                //     2233,
                // ],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 1
            }
        ]
    }

    const handleSearch = () => {
        fetchCountByYear()
    };

    // xử lý nut enter khi tìm kiếm
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (

        <Container maxWidth='md'>

            <div className='chart'>
                <Typography className={classes.title} variant="h4">Hoạt động trong năm</Typography>

                {/* tìm kiếm theo năm */}
                <Typography variant="body">Thống kê theo năm</Typography>
                <Grid container  className={classes.tool}>
                    {/* thông tin về bài viết */}
                    <Grid item xs={4}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            value={year}
                            onChange={handleChange}
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
                            Thống kê
                        </Button>
                    </Grid>
                </Grid>

                {loading ? <p>loading. . .</p> : (
                    <Bar
                        data={chartData}
                        options={{
                            plugins: {
                                legend: {
                                    display: true,
                                    position: 'right',
                                },
                                // title: {
                                //     display: true,
                                //     text: 'Tiêu đề charts',
                                // },
                            },
                        }} />
                )}


            </div>
        </Container>


    );
}