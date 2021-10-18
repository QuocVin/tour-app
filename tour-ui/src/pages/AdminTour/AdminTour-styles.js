import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
    search: {
        height: 55,
        width: 55,
    },
    btnCreate: {
        height: 55,
        width: 55,
        float: 'right'
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));



