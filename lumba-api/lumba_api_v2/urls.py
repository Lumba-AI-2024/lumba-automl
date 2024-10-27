"""
URL configuration for lumba_api_v2 project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('workspace/', include('workspace.urls')),
    path('file/', include('dataset.urls')),
    path('modeling/', include('ml_model.urls')),
    path('preprocess/', include('data_cleaning_endpoint.urls')),
    path('profiling/', include('profiling.urls')),
    path('authentication/', include('authentication.urls')),
    path('automl/', include('automl.urls'))
]
