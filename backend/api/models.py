from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.validators import UnicodeUsernameValidator

class MyUser(AbstractUser):
    username = models.CharField(
        max_length=100,
        unique=True,
        validators=[UnicodeUsernameValidator()],)
    full_name = models.CharField(max_length=100)

