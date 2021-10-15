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
import { useStyles } from './Customer-styles';
import { useStore } from "react-redux";
import cookies from 'react-cookies';
import { useHistory } from 'react-router';
import AppTable from '../../components/Table';


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

function createData(stt, name, username, email, phone, address) {
    return { stt, name, username, email, phone, address };
}

export default function Customer() {
    const classes = useStyles();
    const history = useHistory();
    const [loading, setLoading] = useState(false)

    const [users, setUsers] = useState([])

    useEffect(() => {
        async function init() {
            setLoading(true)
            await fetchUser()
        }
        init()
    }, [])

    const fetchUser = async () => {
        setTimeout(() => {
            const _path = endpoints['user'] + endpoints['customer']
            API.get(_path).then(res => {
                setUsers(
                    res.data.map((b, idx) =>
                        createData(idx + 1, b.first_name + ` ${b.last_name}`, b.username, b.email, b.phone, b.address),
                    )
                );
                setLoading(false)
            })
        }, 500);
    }

    return (

        <Container maxWidth='lg'>
            <div>Customer</div>
            <AppTable columns={columns} data={users}/>
         
        </Container>


    );
}
