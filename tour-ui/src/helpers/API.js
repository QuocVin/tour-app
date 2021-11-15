import axios from 'axios';

export let endpoints = {
    'user':                 '/user/',
    'current-user':         '/user/current-user/',
    'oauth2-info':          '/oauth2-info/',
    'login':                '/o/token/',
    'is-booking':           'is-booking/',

    'customer':             'customer/',
    'employee':             'employee/',
    'current-employee':     'current-employee/',

    'address':              '/address/',
    'type':                 '/type/',
    'tour':                 '/tour/',
    'tour-search':          'search-title/',

    'news-tour':            '/news-tour/',
    'search-title':         'search-title/',
    'search-title-guest':   'search-title-guest/',
    'tour-detail':          '/tour/:id/',
    'have-tour':            'have-tour/',
    'news-have':            'news-have/',
    
    'booking':              '/booking/',
    'check-booking':        'check-booking/',
    'booking-current-user': 'current-user/',
    'month-booking':        'month-booking/',
    'year-booking':         'year-booking/',
}

export default axios.create({
    baseURL: 'http://127.0.0.1:8000/',
})