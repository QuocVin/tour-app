import axios from 'axios';

export let endpoints = {
    'user':                 '/user/',
    'current-user':         '/user/current-user/',
    'oauth2-info':          '/oauth2-info/',
    'login':                '/o/token/',

    'news-tour':            '/news-tour/',
    'tour-detail':          '/tour/:id/',
    'have-tour':            'have-tour/',
    
    'booking':              '/booking/',
    'check-booking':        'check-booking/',
    'booking-current-user': 'current-user/',


}

export default axios.create({
    baseURL: 'http://127.0.0.1:8000/',
})