import { makeStyles } from "@material-ui/core/styles";


export const useStyles = makeStyles((theme) => ({
    img: {
        width: '90%',
        height: 450,
        marginTop: 20,
        marginBottom: 20,
    },
    descriptions: {
        marginTop: 20,
    },
    tour: {
        maxHeight: 560,
        borderRadius: 25,
        backgroundColor: '#cce6be',
        textAlign: '-webkit-center'
    },
    tourTitle: {
        padding: '10px 31px 31px 30px',
    },
    tourInfo: {
        paddingLeft: 20,
        paddingRight: 20,
    },
    booking: {
        justifyContent: 'center'
    },
    btnBooking: {
        backgroundColor: '#28b832',
        marginTop: 30,
        width: '85%',
    },
}));