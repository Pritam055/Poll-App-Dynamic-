from django import template

register = template.Library()

@register.filter(name='plural')
def plural(vote):
    if vote == 0 or vote == 1:
        return f'{vote} vote'
    return f'{vote} votes'