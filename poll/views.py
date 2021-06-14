from django.contrib import auth
from django.db.models import constraints
from django.db.models.query import QuerySet
from django.forms.models import construct_instance
from django.http.response import JsonResponse, HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth.forms import PasswordResetForm, UserCreationForm, AuthenticationForm
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

from .models import Question, Option
from .forms import QuestionForm, OptionForm
from .decorators import unauthenticated_only
# Create your views here.
 
@unauthenticated_only
def register_user(request):

    if request.method=='POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('poll:login')
    else:
        form = UserCreationForm()
    context = {'form': form}
    return render(request, 'poll/register.html',context)

@unauthenticated_only
def login_user(request): 
    if request.method=='POST':
        form = AuthenticationForm(request=request, data=request.POST)
        if form.is_valid(): 
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user) 
                return redirect('poll:home')
    else:
        form= AuthenticationForm()
    context = {'form': form}
    return render(request, 'poll/login.html',context)

def logout_user(request):
    logout(request)
    return redirect('poll:login')

# home view
def home(request):
    """ print(request.user, type(request.user.username))
    q = Question.objects.get(id=1)
    print(q.created_by.username, type(q.created_by.username))
    print(q.created_by.username==request.user.username) """

    context = {
        'questions': Question.objects.all()
    }
    return render(request, 'poll/home.html', context)

# create new poll question
def create_poll(request):
    if request.method=='POST':
        form = QuestionForm(request.POST)
        if form.is_valid(): 
            try:
                q = form.cleaned_data['question']
                question = Question(question = q)
                question.created_by = request.user
                question.save() 
                return redirect('poll:home')
            except:
                return HttpResponse("You need to login to create poll")
    else:
        form = QuestionForm()
    return render(request, 'poll/create.html', {'qform':form})

# url: add-option/<int: qid>/
""" def add_option(request, qid): 
    if request.method=='POST':
        form = OptionForm(request.POST)
        
        if form.is_valid():
            option = form.save(commit=False)
            option.question = Question.objects.get(id=qid)
            form.save()
            form = OptionForm()
    else: 
        form = OptionForm()

    question = Question.objects.get(id=qid)
    options = Option.objects.filter(question = question)
    context = {
        'q': question,
        'form': form,
        'options':options
    }
    return render(request, 'poll/addOption.html', context)
 """
#  Adding Poll Option
def add_option(request, qid):
    if request.method=='POST':
        qid = request.POST.get('qid')
        option = request.POST.get('option')
        try:
            q = Question.objects.get(id=qid)
            obj = Option(question=q,option=option)
            obj.created_by = request.user
            obj.save() 

            options = Option.objects.filter(question = q).values()
            option_list = list(options) 
            """ option_list = []
            for o in options:
                item = {
                    'id':o.id,
                    'question': o.question,
                    'option': o.option,
                    'votes': o.votes
                }
                option_list.append(item)
            print(option_list) """
            return JsonResponse({ "options": option_list, 'status':'success'})
        except:
            return JsonResponse({"status":"fail"})
    else:
        form = OptionForm()

    question = Question.objects.get(id=qid)
    options = Option.objects.filter(question = question)
    context = {
        'q': question,
        'form': form,
        'options':options
    }
    return render(request, 'poll/addOption.html', context)
 

def load_vote_poll_data(request, qid):
    if request.is_ajax(): 
        question = Question.objects.get(id=qid)
        options = Option.objects.filter(question=question)
        data = []
        for obj in options: 
            item = {
                'id': obj.id,
                'option': obj.option,
                'created_on': obj.created_on,
                'created_by': obj.created_by.username,
                'vote_count': obj.count_voter,
                'voted': True if request.user in obj.voter.all() else False 
            }
            data.append(item)
        return JsonResponse({"data": data})

    # if request is not ajax
    question = Question.objects.get(id=qid) 
    context = {
        'q': question
    }
    return render(request, 'poll/vote.html', context) 

# when user votes
def poll_votting(request):
    if request.method=='POST':
        id = request.POST.get('id')
        try: 
            option = Option.objects.get(id=id) 
            print(option)
            print(request.user in option.voter.all())
            if request.user in option.voter.all():
                # already voted: then remove from v
                voted = False
                option.voter.remove(request.user)
            else:
                voted = True
                option.voter.add(request.user) 

            return JsonResponse({'status': 'success', 'voted': voted, 'vote_count': option.count_voter})
        except:
            return JsonResponse({'status':'fail'})
    return HttpResponse("GET request cannot accept")

# vote result data for display
def vote_result(request, qid): 
    q = Question.objects.get(id=qid)
    options = Option.objects.filter(question=q)
    # print(options)
    context = {
        'q': q,
        'options': options
    }
    return render(request,'poll/result.html', context)

# chart data for result display
def get_chart_data(request, qid):
    try:
        q = Question.objects.get(id=qid)
        options = Option.objects.filter(question=q)
        # preparing chart data
        labels = []
        data = []
        for i in options:
            labels.append(i.option)
            data.append(i.count_voter)  
        context = {
            'labels': labels,
            'data':data,
            'status':'success'
        }
        return JsonResponse(context)
    except: 
        return JsonResponse({'status':'fail'})


def delete_post(request):
    try:
        qid = request.POST.get('id')
        post = Question.objects.get(id=qid)
        post.delete()
        return JsonResponse({"status": "success"})
    except:
        return JsonResponse({"status": "fail"})

def get_option_data(request):
    if request.is_ajax():
        id = request.GET.get('id')
        try:
            opt = Option.objects.get(id=id)
            voter_list =list(opt.voter.all().values())
            return JsonResponse({"status":"success", "option":opt.option,"voter_list":voter_list})
        except:
            return JsonResponse({"status":"fail"})
