from django.shortcuts import redirect

def unauthenticated_only(fun):
    def wrapper_function(request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect('poll:home')
        else:
            return fun(request, *args, **kwargs)

    return wrapper_function

