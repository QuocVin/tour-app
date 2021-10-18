import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: '#d9e0e6',
    },
    media: {
        height: 280,
    },
    mediaContent: {
        marginTop: 10,
        height: 50,
    },
    action: {
        marginLeft: 100,
        marginBottom: 20,
    },
    pagination: {
        float: 'right',
        margin: 7,
    },
    search: {
        height: 55,
        width: 55,
    },
}));