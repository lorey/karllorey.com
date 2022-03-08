<!--
.. title: Add all models to Django admin automatically
.. slug: add-all-models-to-django-admin-automatically
.. date: 2020-03-24 11:01:51 UTC+01:00
.. tags: Python, Django, Tech, Clean Code
.. category: Tech
.. link: 
.. description: 
.. type: text
-->

To show, edit, and work with a model inside the Django admin site,
you usually have to add each desired model manually by adding a line to `{your app}/admin.py`.
For example, to add your `Project` class to your Admin site, 
you have to add the following to your `admin.py` file:

```python
from django.contrib import admin
from myproject.myapp.models import Project

admin.site.register(Project)
```

Over time, especially during development when you create new objects a lot,
this can become quite tedious.
So I cam up with a quick hack to add all models to your Django admin site automatically.
<!-- TEASER_END -->
Instead of registering all classes manually, 
we simply use inspection to add all classes of our models module.
This is what you need to add to the `admin.py` file inside your app:

```python
import inspect

from django.contrib import admin

from myproject.myapp import models

for name, obj in inspect.getmembers(models):
    if inspect.isclass(obj):
        admin.site.register(obj)
```

This code uses inspection to automatically add all classes inside your models.
Note that you cannot have any other classes inside models withough extending the above code.
I would recommend to use this during development only
and add all classes manually in production.