from django.contrib import admin

from .models import Question, Option
# Register your models here.
@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('id','question','created_by', 'created_on')



@admin.register(Option)
class OptionAdmin(admin.ModelAdmin):
    list_display = ('id','option','question','created_by','created_on')
