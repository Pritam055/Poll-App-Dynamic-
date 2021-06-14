from django import forms

from .models import Question, Option

class QuestionForm(forms.ModelForm):
    class Meta: 
        model = Question
        fields = ['question']

        widgets = {
            'question': forms.Textarea(attrs = {'rows': 5})
        }
    
class OptionForm(forms.ModelForm):
    class Meta:
        model = Option
        fields = ['option']