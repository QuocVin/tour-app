// import React, { useEffect, useState } from 'react';
// import {
//     Typography,
//     Grid,
//     Container,
// } from '@material-ui/core';
// import { useStyles } from './Dashboard-styles';
// import API, { endpoints } from '../../helpers/API';
// import useSubmitForm from '../../helpers/CustomHooks'
// import { useHistory, useLocation } from 'react-router';
// import { PublicRoutes } from '../../routes/public-route';
// import AppTable from '../../components/Table';

// const columns = [
//     { id: 'stt', label: 'STT', maxWidth: 20, align: 'center', },
//     {
//         id: 'static1',
//         label: 'Trạng thái',
//         minWidth: 100,
//         align: 'center',
//     },
//     {
//         id: 'people1',
//         label: 'Người lớn',
//         minWidth: 100,
//         align: 'right',
//     },
//     {
//         id: 'people2',
//         label: 'Trẻ em',
//         minWidth: 100,
//         align: 'right',
//     },
//     {
//         id: 'total',
//         label: 'Tổng tiền',
//         minWidth: 150,
//         align: 'right',
//         format: (value) => value.toFixed(2),
//     },
// ];

// function createData(stt, static1, people1, people2, total, tourId, employeeId) {
//     return { stt, static1, people1, people2, total, tourId, employeeId };
// }

// export default function Dashboard() {
//     const classes = useStyles();
//     const history = useHistory()
//     const [loading, setLoading] = useState(false)
//     const [booking, setBooking] = useState([]);

//     useEffect(() => {
//         async function init() {
//             setLoading(true)
//             await fetchBooking()
//         }
//         init()
//     }, [])

//     // lấy danh sách booking
//     const fetchBooking = () => {
//         setTimeout(() => {
//             const _pathAPI = endpoints['booking']
//             API.get(_pathAPI).then(res => {
//                 setBooking(
//                     res.data.map((b, idx) =>
//                         createData(idx + 1, b.static, b.people1 + ' người', b.people2 + ' bé', b.totalPrice + ' VNĐ', b.tour, b.employee),
//                     )
//                 )
//             })
//             setLoading(false);
//         }, 500);
//     }

//     // chuyển về trang đăng tin tức tour đã booking
//     const handleChooseBooking = (tourId, employeeId) => {
//         const _pathAPI = endpoints['news-tour'] + endpoints['have-tour'] + `?tour=${tourId}&employee=${employeeId}`;
//         API.get(_pathAPI).then(res => {
//             const _pathPage = PublicRoutes.NewsTourDetail.path.replace(":id", res.data[0].id)
//             history.push(_pathPage, {
//                 newstour: res.data[0],
//             })
//         })
//     }

//     return (

//         <Container maxWidth='sm'>

//             <Grid container xs={12} spacing={1}>
//                 {/* thống kê */}
//                 {/* <Grid item xs={7}>

//                 </Grid> */}
//                 {/* lịch sử hoạt động */}
//                 <Grid item xs={12}>
//                     {/* <Typography variant="h4">Lịch sử hoạt động</Typography> */}

//                     {/* các giao dịch liên quan */}
//                     <Typography variant="h5">Các giao dịch với khách hàng</Typography>
//                     {loading ? <p>Loading ...</p> :
//                         <AppTable columns={columns} data={booking} handleChooseBooking={handleChooseBooking} />
//                     }
//                 </Grid>
//             </Grid>

//         </Container>


//     );
// }



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