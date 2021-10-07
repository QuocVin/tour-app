# Tập tin này dùng để cấu hình các model ánh xạ xuống cơ sở dữ liệu
from django.contrib.auth.models import AbstractUser
from django.db import models
from ckeditor.fields import RichTextField


# Kế thừa lớp user của django để sử dụng các chức năng chứng thực của nó
class User(AbstractUser):
    """
    Những trường có sẵn từ AbstractUser: id, password, last_login, is_superuser,
    username, first_name, last_name, email, is_staff, is_active, date_joined
    """

    class Meta:
        db_table = 'user'

    # Biến static để đánh dấu vai trò người dùng
    EMPLOYEE = 'NHAN VIEN'
    CUSTOMER = 'NGUOI DUNG'
    ROLE = [
        (EMPLOYEE, 'nhan vien'),
        (CUSTOMER, 'nguoi dung'),
    ]

    email = models.CharField(max_length=50, null=False, unique=True)
    phone = models.CharField(max_length=15, null=True)
    avatar = models.ImageField(upload_to='static/upload/%Y/%m', null=True,
                               default='static/upload/avatarDefault.jpg')
    address = models.CharField(max_length=150)
    role = models.CharField(
        max_length=10,
        choices=ROLE,
        default=''
    )


# # Nhân viên
class Employee(models.Model):
    class Meta:
        db_table = 'employee'

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        primary_key=True,
    )


# # Khách hàng
class Customer(models.Model):
    class Meta:
        db_table = 'customer'

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        primary_key=True,
    )
    # quan hệ n-n
    rate = models.ManyToManyField('rate')


# Thông tin tour
class Tour(models.Model):
    class Meta:
        db_table = 'tour'

    # Biến static lưu trạng thái
    CLOSE = 'DA DONG'
    OPEN = 'DANG MO'

    STATIC = [
        (CLOSE, 'Tour đã đóng đăng ký'),
        (OPEN, 'Tour còn mở đăng ký'),
    ]

    dateStart = models.DateField(auto_now_add=True)
    dateEnd = models.DateField()
    descriptions = RichTextField()
    title = models.CharField(max_length=80)
    # giá người lớn
    price1 = models.IntegerField(default=50)
    # giá trẻ em
    price2 = models.IntegerField(default=30)
    static = models.CharField(
        choices=STATIC,
        max_length=10,
        default=OPEN
    )
    # Các trường n-n chỉ lưu khóa không lưu thông tin gì thêm
    address = models.ManyToManyField('address')
    type = models.ManyToManyField('type')


class Address(models.Model):
    class Meta:
        db_table = 'address'

    name = models.CharField(max_length=50)


class Type(models.Model):
    class Meta:
        db_table = 'type'

    name = models.CharField(max_length=50)


class NewsTour(models.Model):
    class Meta:
        db_table = 'news'

    CLOSE = 'DA DONG'
    OPEN = 'DANG MO'

    STATIC = [
        (CLOSE, 'Bài viết đã hết hạn'),
        (OPEN, 'Bài viết vẫn còn đăng'),
    ]

    title = models.CharField(max_length=80)
    descriptions = RichTextField()
    dateCreate = models.DateField(auto_now_add=True)
    dateEnd = models.DateField()        # thời gian hiệu lực
    static = models.CharField(
        choices=STATIC,
        max_length=10,
        default=OPEN
    )
    image = models.ImageField(upload_to='static/newstour/%Y/%m', null=True)

    # khóa ngoại
    employee = models.ForeignKey(
        Employee,
        on_delete=models.CASCADE,
    )
    tour = models.ForeignKey(
        Tour,
        on_delete=models.CASCADE,
    )

    # quan hệ n-n
    rate = models.ManyToManyField('rate')


class Rate(models.Model):
    class Meta:
        db_table = 'rate'

    like = models.BooleanField(default=True)
    comment = models.TextField(max_length=100, default="")


class Booking(models.Model):
    class Meta:
        db_table = 'booking'

    DISABLE = 'HUY TOUR'
    ENABLE = 'DAT TOUR'

    STATIC = [
        (DISABLE, 'Người dùng hủy đặt tour'),
        (ENABLE, 'Người dùng đặt tour này'),
    ]

    static = models.CharField(
        choices=STATIC,
        max_length=10,
        default=ENABLE
    )
    # số lượng người lớn
    people1 = models.IntegerField(default=1)
    # số lượng trẻ em
    people2 = models.IntegerField(default=0)
    totalPrice = models.IntegerField(default=0)

    # khóa ngoại
    employee = models.ForeignKey(
        Employee,
        on_delete=models.CASCADE,
    )
    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
    )
    tour = models.ForeignKey(
        Tour,
        on_delete=models.CASCADE,
    )



