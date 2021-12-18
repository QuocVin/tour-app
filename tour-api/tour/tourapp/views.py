# Tập tin này để xử lý request và trả về các response (tương tự controller trong
# MVC, là thành phần Views trong MVT)
import json
import math

from django.core.serializers.json import DjangoJSONEncoder
from django.db.models import Model
from django.http import JsonResponse
from rest_framework import viewsets, generics, permissions, status
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.views import APIView
from django.conf import settings

from .serializers import *
from django.core import serializers


# Đăng ký user (tích hợp OAuth2)
# Sử dụng ViewSet để tự cấu hình thay vì các lớp view được hiện thực sẵn
# Sử dụng generics.CreateAPIView để hiện thực các phương thức create của viewset
# Sử dụng generics.RetrieveAPIView để lấy thông tin 1 user thông qua id
# Để ràng buộc chỉ user đã đăng nhập mới lấy được thông tin ta ghi đè lại phương
# thức get_permission
class UserViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.UpdateAPIView):
    # Phương thức để trả về swagger ko lỗi (do swagger không hỗ trợ nested
    # serializer -> hiển thị dấu "." trong tên.trường_nested bị lỗi)
    def get_parsers(self):
        if getattr(self, 'swagger_fake_view', False):
            return []
        return super().get_parsers()

    # Chỉ định câu truy vấn
    queryset = User.objects.filter(is_active=True)
    # Chỉ định lớp serializer
    serializer_class = UserSerializer
    parser_classes = [MultiPartParser]

    # Chỉ định quyền user đã đăng nhập
    def get_permissions(self):
        # Chỉ riêng đối với thao tác get data user hiện tại phải chứng thực
        if self.action == 'get_current-user':
            return [permissions.IsAuthenticated()]
        # Thao tác như đăng ký ko cần chứng thực
        return [permissions.AllowAny()]

    # Tạo API get dữ liệu user sau khi đã chứng thực (đã đăng nhập)
    @action(methods=['get'], detail=False, url_path='current-user')
    def get_current_user(self, request):
        return Response(self.serializer_class(request.user).data,
                        status.HTTP_200_OK)

    # Tạo API lấy dữ liệu khách hàng
    @action(methods=['get'], detail=False, url_path='customer')
    def get_customer(self, request):
        if request.query_params.__contains__('email'):
            query = User.objects.filter(
                role='NGUOI DUNG',
                email__icontains=request.query_params.__getitem__('email'),
            )
            return Response(list(query.values()), status.HTTP_200_OK)
        if request.query_params.__contains__('id'):
            query = User.objects.filter(
                role='NGUOI DUNG',
                id=request.query_params.__getitem__('id'),
            )
            return Response(list(query.values()), status.HTTP_200_OK)
        return Response({"invalid request": "not found"},
                        status.HTTP_400_BAD_REQUEST)

    # Tạo API lấy dữ liệu nhân viên
    @action(methods=['get'], detail=False, url_path='employee')
    def get_employee(self, request):
        if request.query_params.__contains__('email'):
            query = User.objects.filter(
                role='NHAN VIEN',
                email__icontains=request.query_params.__getitem__('email'),
            )
            return Response(list(query.values()), status.HTTP_200_OK)

        if request.query_params.__contains__('id'):
            query = User.objects.filter(
                role='NHAN VIEN',
                id=request.query_params.__getitem__('id'),
            )
            return Response(list(query.values()), status.HTTP_200_OK)
        return Response({"invalid request": "not found"},
                        status.HTTP_400_BAD_REQUEST)

    # API lấy thông tin khách hàng đã thực hiện booking
    @action(methods=['get'], detail=False, url_path='is-booking')
    def check_booking(self, request):
        if request.query_params.__contains__('id'):
            query = User.objects.filter(
                id=request.query_params.__getitem__('id'),
                role='NGUOI DUNG',
            )
            return Response(list(query.values()))
        return Response({"invalid request": "not found"},
                        status.HTTP_400_BAD_REQUEST)

    def create(self, request, *args, **kwargs):

        # ghi đè lại create
        user = self.get_serializer(data=request.data)

        # dữ liệu được serializer hợp lệ
        user.is_valid(raise_exception=True)

        # lưu xuống database
        self.perform_create(user)

        role = request.data.get('role')
        if role is not None:
            if role == User.EMPLOYEE:
                Employee.objects.create(user_id=user.data.get('id'))
            if role == User.CUSTOMER:
                Customer.objects.create(user_id=user.data.get('id'))

        headers = self.get_success_headers(user.data)
        return Response(user.data, status=status.HTTP_200_OK, headers=headers)


# API để lấy thông tin client_id, client_secret xin token chứng thực (đăng nhập)
class AuthInfo(APIView):
    def get(self, request):
        return Response(settings.OAUTH2_INFO, status.HTTP_200_OK)


class EmployeeViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer


class CustomerViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer


class NewsTourPagination(PageNumberPagination):
    page_size = 6


class NewsTourViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.ListAPIView, generics.RetrieveAPIView, generics.UpdateAPIView):
    queryset = NewsTour.objects.all()
    serializer_class = NewsTourSerializer
    pagination_class = NewsTourPagination

    # tìm kiếm bài viết có thông tin về tour thông qua tourId - view người dùng
    @action(methods=['get'], detail=False, url_path='have-tour')
    def have_tour(self, request):
        if request.query_params.__contains__('tour') and request.query_params.__contains__('employee'):
            query = NewsTour.objects.filter(
                tour=request.query_params.__getitem__('tour'),
                employee=request.query_params.__getitem__('employee'),
                # static='DANG MO',
            )
            return Response(list(query.values()))
        return Response({"invalid request": "not found"},
                        status.HTTP_400_BAD_REQUEST)

    # tìm kiếm bài viết qua title - view admin
    @action(methods=['get'], detail=False, url_path='search-title')
    def search_title(self, request):
        # tìm kiếm các bài viết mà nhân viên đã viết - view quản trị
        if request.query_params.__contains__('title') and request.query_params.__contains__('employee'):
            query = NewsTour.objects.filter(
                title__icontains=request.query_params.__getitem__('title'),
                employee=request.query_params.__getitem__('employee'),
            )
            return Response(list(query.values()))
        else:
            # tìm kiếm các bài viết qua title
            if request.query_params.__contains__('title'):
                query = NewsTour.objects.filter(
                    title__icontains=request.query_params.__getitem__('title'),
                )
                return Response(list(query.values()))
        return Response({"invalid request": "not found"},
                        status.HTTP_400_BAD_REQUEST)

    # tìm kiếm bài viết qua title - view guest
    @action(methods=['get'], detail=False, url_path='search-title-guest')
    def search_title_guest(self, request):
        if request.query_params.__contains__('title'):
            query = NewsTour.objects.filter(
                title__icontains=request.query_params.__getitem__('title'),
                static='DANG MO',
            )
            return Response(list(query.values()))
        return Response({"invalid request": "not found"},
                        status.HTTP_400_BAD_REQUEST)


class TourViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.ListAPIView, generics.RetrieveAPIView, generics.UpdateAPIView):
    queryset = Tour.objects.all()
    serializer_class = TourSerializer

    def create(self, request, *args, **kwargs):

        tour = Tour(title=request.data.get('title'), descriptions=request.data.get('descriptions'),
                    price1=request.data.get('price1'), price2=request.data.get('price2'),
                    dateStart=request.data.get('dateStart'), dateEnd=request.data.get('dateEnd'),
                    static=request.data.get('static'))
        tour.save()
        tour.type.add(request.data.get('type'))
        for a in request.data.get('address'):
            if a != ',':
                tour.address.add(a)

        return Response(status=status.HTTP_200_OK)

    # tìm kiếm tour qua title
    @action(methods=['get'], detail=False, url_path='search-title')
    def search_title(self, request):
        # tìm kiếm các bài viết qua title
        if request.query_params.__contains__('title'):
            query = Tour.objects.filter(
                title__icontains=request.query_params.__getitem__('title'),
                # static='DANG MO',
            )
            return Response(list(query.values()))
        return Response({"invalid request": "not found"},
                        status.HTTP_400_BAD_REQUEST)


class AddressViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer


class TypeViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Type.objects.all()
    serializer_class = TypeSerializer


class BookingViewSet(viewsets.ViewSet, generics.CreateAPIView,
                          generics.ListAPIView, generics.UpdateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

    # kiểm tra người dùng đã thực hiện booking trước đó chưa
    @action(methods=['get'], detail=False, url_path='check-booking')
    def check_booking(self, request):
        if request.query_params.__contains__('tour') and request.query_params.__contains__('customer'):
            query = Booking.objects.filter(
                customer=request.query_params.__getitem__('customer'),
                tour=request.query_params.__getitem__('tour')
            )
            # return JsonResponse({
            #     'result': list(query.values())
            # })
            return Response(list(query.values()))
        return Response({"invalid request": "not found"},
                        status.HTTP_400_BAD_REQUEST)

    # lịch sử giao dịch theo giao diện người dùng
    @action(methods=['get'], detail=False, url_path='current-user')
    def booking_current_user(self, request):
        if request.query_params.__contains__('customer'):
            query = Booking.objects.filter(
                customer=request.query_params.__getitem__('customer')
            )
            return Response(list(query.values()))
        return Response({"invalid request": "not found"},
                        status.HTTP_400_BAD_REQUEST)

    # các giao dịch liên quan đến nhân viên
    @action(methods=['get'], detail=False, url_path='current-employee')
    def booking_current_employee(self, request):
        if request.query_params.__contains__('employee'):
            query = Booking.objects.filter(
                employee=request.query_params.__getitem__('employee')
            )
            return Response(list(query.values()))
        return Response({"invalid request": "not found"},
                    status.HTTP_400_BAD_REQUEST)

    # danh sách booking đã thực hiện trong bài viết
    @action(methods=['get'], detail=False, url_path='news-have')
    def news_booking(self, request):
        if request.query_params.__contains__('tour') and request.query_params.__contains__('employee'):
            query = Booking.objects.filter(
                employee=request.query_params.__getitem__('employee'),
                tour=request.query_params.__getitem__('tour')
            )
            return Response(list(query.values()))
        return Response({"invalid request": "not found"},
                        status.HTTP_400_BAD_REQUEST)

    # chart - thống kê booking theo năm
    @action(methods=['get'], detail=False, url_path='year-booking')
    def chart_booking2(self, request):
        month = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        if request.query_params.__contains__('year'):
            query = Booking.objects.filter(
                dateBooking__year=request.query_params.__getitem__('year')
            )
            data1 = []
            for m in month:
                data1.append(query.filter(dateBooking__month=m).count())

            return Response(data1)
        return Response({"invalid request": "not found"},
                        status.HTTP_400_BAD_REQUEST)