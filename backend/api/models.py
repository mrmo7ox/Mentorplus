from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.conf import settings



class MyUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Users need email to be created')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class MyUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    courses = models.ManyToManyField('Courses', blank=True, related_name='users')

    objects = MyUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return self.email

class Category(models.Model):
    name = models.CharField(max_length=255)
    def __str__(self):
        return self.name

class Courses(models.Model):
    name = models.CharField(max_length=255, null=True )
    description = models.TextField()
    duration = models.CharField(max_length=3, null=True )
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='courses')
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="created_courses")
    def __str__(self):
        return self.name

class Application(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='applications')
    course = models.ForeignKey('Courses', on_delete=models.CASCADE, related_name='applications')
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=32, default='pending')
    
    def str(self):
        return f"{self.user.email} -> {self.course.name} ({self.status})"