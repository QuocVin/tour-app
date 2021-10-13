from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-yusocd@a&50x9b^j%s@3duuy+f_25v+q&^r1+%75_lwj(hp%l3'

# OAuth2 thông tin application (EmploymentAgency), gửi kèm rq để xin token
OAUTH2_INFO = {
    'client_id': 'dJKwH80k35lpumEIB9kISAo01OpulgNeS0TgR35s',
    'client_secret': '96RmvkV0TO8HTQIG5AG4uyVwdB0sWfKBXhuogLpcxGRdUkUM6ToY7Dp0gXMo0IoiPXixBeNbvIMvpS7RSEfMhFL6qoiy8UPXczv1iRlPCbLZSf6ePEEtNLYhs4b1yBWo'
}

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'tourapp.apps.TourappConfig',
    # Trình soạn thảo richtext
    'ckeditor',
    'ckeditor_uploader',
    # Làm rest api
    'rest_framework',
    # Chứng thực với oauth2
    'oauth2_provider',
    # Công cụ hỗ trợ debug, tạo docs api với swagger
    'drf_yasg',
    'debug_toolbar',
    # Cấu hình chia sẻ tài nguyên giữa các máy chủ
    'corsheaders'
]

REST_FRAMEWORK = {
    # # Dùng rest framework để phân trang
    # 'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    # # Mỗi respond trả về 2 trang
    # 'PAGE_SIZE': '6',
    # Cấu hình lớp sử dụng để chứng thực
    'DEFAULT_AUTHENTICATION_CLASSES': ('oauth2_provider.contrib.rest_framework.OAuth2Authentication', ),
}

# Thêm cái này để khi tương tác với ReactJS có thể parse dữ liệu
OAUTH2_PROVIDER = {
    'OAUTH2_BACKEND_CLASS': 'oauth2_provider.oauth2_backends.JSONOAuthLibCore'
}

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    # Công cụ debug để do hiệu năng, chỉ sử dụng khi development
    'debug_toolbar.middleware.DebugToolbarMiddleware',
    # Cấu hình để truy cập API từ client (chia sẻ tài nguyên)
    'corsheaders.middleware.CorsMiddleware'
]

# Cho phép những domain nào truy cập vào hệ thống
CORS_ALLOW_ALL_ORIGINS = True
# Cấu hình này giới hạn chỉ (vài) domain được truy cập
# CORS_ALLOWED_ORIGINS = ['http://localhost:3000/']

# Các địa chỉ IP cho phép server được liệt kê hiển thị debug toolbar
INTERNAL_IPS = [
    '127.0.0.1'
]

ROOT_URLCONF = 'tour.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'tour.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'tourdb',
        'USER': 'root',
        'PASSWORD': 'Abc1234%^&',
        'HOST': ''
    }
}

# Khai báo lớp user được sử dụng để chứng thực
AUTH_USER_MODEL = 'tourapp.User'

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/3.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.2/howto/static-files/

STATIC_URL = '/static/'
MEDIA_ROOT = '%s/tourapp/' % BASE_DIR
CKEDITOR_UPLOAD_PATH = 'ckeditor/'

# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
