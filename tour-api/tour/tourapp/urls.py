"""
Tập tin này dùng để cấu hình url của app, sau khi đã qua url của root
"""
from django.contrib import admin
from django.urls import path, re_path, include
from rest_framework.routers import DefaultRouter
from . import views


"""
Các lệnh này sẽ tự sinh route api không cần cấu hình thủ công, default router
sẽ render ra trang api của django mà ko cần xử lý gì thêm

Register một route mới sử dụng:
router.register('tên', views.LớpViewSet, basename='tùy_chọn_thôi')

Sau đó nó sẽ tự sinh (tùy thuộc cấu hình trong views) 2 enpoints và 5 urls 
/tên/ - GET
/tên/ - POST
/tên/{tên_id} - GET
/tên/{tên_id} - PUT
/tên/{tên_id} - DELETE
"""
router = DefaultRouter()
router.register("user", views.UserViewSet)
router.register("customer", views.CustomerViewSet)
router.register("employee", views.EmployeeViewSet)
router.register("news-tour", views.NewsTourViewSet)
router.register("tour", views.TourViewSet)
router.register("booking", views.BookingViewSet)
router.register("address", views.AddressViewSet)
router.register("type", views.TypeViewSet)


urlpatterns = [
    # Sử dụng route của rest framework để tự sinh endpoint crud cơ bản
    path('', include(router.urls)),
    # Trang admin mặc định
    path('admin/', admin.site.urls),
    # Tự define url để lấy client_id/secret dùng chứng thực lấy token
    path('oauth2-info/', views.AuthInfo.as_view()),
]
