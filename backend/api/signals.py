from django.dispatch import receiver
from django_rest_passwordreset.signals import reset_password_token_created
from django.core.mail import send_mail

@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    send_mail(
        "Password Reset",
        f"Use this token: {reset_password_token.key}",
        "insync.webchat@gmail.com",
        [reset_password_token.user.email]
    )