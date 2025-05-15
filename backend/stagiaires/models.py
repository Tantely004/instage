from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.contrib.auth.hashers import make_password

# ===================== #
#     Custom Manager    #
# ===================== #
class CustomUserManager(BaseUserManager):
    def create_user(self, identifier, password=None, **extra_fields):
        if not identifier:
            raise ValueError("L'identifiant est requis.")
        if not password:
            raise ValueError("Un mot de passe est requis.")
        user = self.model(identifier=identifier, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, identifier, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(identifier, password, **extra_fields)


# ===================== #
#        USER           #
# ===================== #
class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ('intern', 'Intern'),
        ('instructor', 'Instructor'),
        ('administrator', 'Administrator'),
    ]

    identifier = models.CharField(max_length=100, unique=True)
    mail = models.EmailField(unique=True)
    name = models.CharField(max_length=100)
    firstname = models.CharField(max_length=100)
    contact = models.CharField(max_length=20)
    image = models.ImageField(upload_to='user_images/', null=True, blank=True)
    cv = models.FileField(upload_to='user_cvs/', null=True, blank=True)
    password = models.CharField(max_length=128)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'identifier'
    REQUIRED_FIELDS = ['mail', 'name', 'firstname', 'contact', 'role']

    objects = CustomUserManager()

    def save(self, *args, **kwargs):
        if self.password and not self.password.startswith('pbkdf2_sha256'):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.identifier} - {self.role}"

    def get_username(self):
        return self.identifier


# ===================== #
#   RÔLES SPÉCIFIQUES   #
# ===================== #

class Intern(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    etablishment = models.CharField(max_length=100)
    sector = models.CharField(max_length=100)
    level = models.CharField(max_length=100)

    def __str__(self):
        return f"Intern: {self.user.identifier}"


class Instructor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    management = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    position = models.CharField(max_length=100)

    def __str__(self):
        return f"Instructor: {self.user.identifier}"


class Administrator(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    management = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    position = models.CharField(max_length=100)

    def __str__(self):
        return f"Admin: {self.user.identifier}"
