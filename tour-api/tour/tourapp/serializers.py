"""
Tập tin này dùng để cấu hình các lớp serializer cho các model chỉ định nhằm
chuyển các dữ liệu json thành object và ngược lại để tương tác trên môi trường
internet. Mỗi lớp model khi được sử dụng trong api sẽ có một lớp serializer
tương ứng
"""
from rest_framework.serializers import ModelSerializer
from .models import *


# Tạo người dùng cơ bản
class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email', 'first_name', 'last_name',
                  'role', 'address', 'phone', 'avatar']
        extra_kwargs = {
            'password': {'write_only': 'true'},
        }

    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user


class EmployeeSerializer(ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'


class CustomerSerializer(ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'


class AddressSerializer(ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'


class TypeSerializer(ModelSerializer):
    class Meta:
        model = Type
        fields = '__all__'


class RateSerializer(ModelSerializer):
    class Meta:
        model = Rate
        fields = '__all__'


class NewsTourSerializer(ModelSerializer):
    # rate = RateSerializer(many=True)

    class Meta:
        model = NewsTour
        fields = ['id', 'title', 'descriptions', 'static',
                  'employee', 'tour', 'dateEnd', 'dateCreate', 'image']


class TourSerializer(ModelSerializer):
    address = AddressSerializer(many=True)
    type = TypeSerializer(many=True)

    class Meta:
        model = Tour
        fields = '__all__'


class BookingSerializer(ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'
