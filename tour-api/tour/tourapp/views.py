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

    # tìm kiếm bài viết có thông tin về tour thông qua tourId
    @action(methods=['get'], detail=False, url_path='have-tour')
    def have_tour(self, request):
        if request.query_params.__contains__('tour') and request.query_params.__contains__('employee'):
            query = NewsTour.objects.filter(
                tour=request.query_params.__getitem__('tour'),
                employee=request.query_params.__getitem__('employee'),
            )
            return Response(list(query.values()))
        return Response({"invalid request": "not found"},
                        status.HTTP_400_BAD_REQUEST)


class TourViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Tour.objects.all()
    serializer_class = TourSerializer


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