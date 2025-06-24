from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import MyUser

@admin.register(MyUser)
class MyUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('full_name',)}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'full_name', 'email', 'password1', 'password2', 'groups'),
        }),
    )