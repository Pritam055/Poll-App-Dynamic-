from django.urls import path
from . import views

app_name = 'poll' 

urlpatterns = [
    path('', views.home, name='home'),
    path('register/', views.register_user, name='register'),
    path('login/' ,views.login_user, name='login'),
    path('logout/', views.logout_user, name='logout'),
    

    path('create/', views.create_poll, name='create'),
    path('add-option/<int:qid>/', views.add_option, name='add_option'),
    path('vote_page/<int:qid>/', views.load_vote_poll_data, name='vote_page'),
    path('votting/', views.poll_votting, name='vote_count'),
    path('result/<int:qid>/', views.vote_result, name='result'),
    path('delete-poll/', views.delete_post, name='delete'),
    path('option-data/', views.get_option_data, name='option-data'),
    path('chart-data/<int:qid>/', views.get_chart_data, name='chart-data'),
    

]   