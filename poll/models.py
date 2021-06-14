from django.db import models

from django.contrib.auth.models import User
# Create your models here.

class Question(models.Model):
    question = models.TextField()
    created_on = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, default=None)

    def __str__(self):
        return self.question

class Option(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    option = models.CharField(max_length=30)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="option_creator", default=None)
    created_on = models.DateTimeField(auto_now_add=True)
    # votes = models.IntegerField(default=0)
    voter = models.ManyToManyField(User, blank=True)    

    def __str__(self):
        return f'{self.option}' 

    @property
    def count_voter(self):
        return self.voter.all().count()

""" related_name: The related_name attribute specifies the name of the reverse relation from the User model back to your model. If you don't specify a related_name , Django automatically creates one using the name of your model with the suffix _set , for instance Use """