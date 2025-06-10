from django.db import models
from django.contrib.auth.models import *
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

# ===================== #
#       INTERNSHIP      #
# ===================== #
class InternshipStatusChoices(models.TextChoices):
    PROGRESSING = 'progressing', 'Progressing'
    COMPLETED = 'completed', 'Completed'
    CANCELLED = 'cancelled', 'Cancelled'

class InternshipTypeChoices(models.TextChoices):
    HIRING = 'hiring', 'Hiring'
    ACADEMIC = 'academic', 'Academic'

class Internship(models.Model):
    id = models.AutoField(primary_key=True)
    start_date = models.DateField()
    end_date = models.DateField()
    intern = models.ForeignKey(Intern, on_delete=models.CASCADE)
    instructor = models.ForeignKey(Instructor, on_delete=models.CASCADE)
    theme = models.CharField(max_length=200)
    type = models.CharField(
        max_length=20,
        choices=InternshipTypeChoices.choices,
        default=InternshipTypeChoices.ACADEMIC,
    )
    status = models.CharField(
        max_length=20,
        choices=InternshipStatusChoices.choices,
        default=InternshipStatusChoices.PROGRESSING,
    )
    is_finished = models.BooleanField(default=False)

    def __str__(self):
        return f"Internship: {self.theme} for {self.intern.user.identifier}"

# ===================== #
#       INTERVIEW       #
# ===================== #
class InterviewStatusChoices(models.TextChoices):
    PLANNED = 'planned', 'Planned'
    IN_PROGRESS = 'in_progress', 'In Progress'
    COMPLETED = 'completed', 'Completed'
    CANCELLED = 'cancelled', 'Cancelled'

class Interview(models.Model):
    id = models.AutoField(primary_key=True)
    date = models.DateField()
    time = models.TimeField()
    room = models.CharField(max_length=100)
    internship = models.ForeignKey(Internship, on_delete=models.CASCADE)
    subjects = models.JSONField(default=list)
    status = models.CharField(
        max_length=20,
        choices=InterviewStatusChoices.choices,
        default=InterviewStatusChoices.PLANNED,
    )

    def __str__(self):
        return f"Interview on {self.date} for {self.internship.theme}"

# ===================== #
#       REPORT          #
# ===================== #
class ReportStatusChoices(models.TextChoices):
    DRAFT = 'draft', 'Draft'
    SUBMITTED = 'submitted', 'Submitted'
    REVIEWED = 'reviewed', 'Reviewed'

class Report(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=200)
    date = models.DateField()
    status = models.CharField(
        max_length=20,
        choices=ReportStatusChoices.choices,
        default=ReportStatusChoices.DRAFT,
    )
    comments = models.JSONField(default=list)
    document = models.ForeignKey('Document', on_delete=models.CASCADE, null=True, blank=True)
    interview = models.ForeignKey(Interview, on_delete=models.CASCADE)
    submitted_date = models.DateTimeField(null=True, blank=True)  # Champ ajouté

    def __str__(self):
        return f"Report: {self.title} on {self.date}"

# ===================== #
#     REPORT TASK       #
# ===================== #
class ReportTask(models.Model):
    id = models.AutoField(primary_key=True)
    report = models.ForeignKey(Report, on_delete=models.CASCADE)

    def __str__(self):
        return f"Task for Report: {self.report.title}"

# ===================== #
#       DOCUMENT        #
# ===================== #
class Document(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)
    type = models.CharField(max_length=100)
    path = models.FileField(upload_to='documents/')

    def __str__(self):
        return f"Document: {self.name}"

# ===================== #
#         TASK          #
# ===================== #
class TaskStatusChoices(models.TextChoices):
    OPEN = 'open', 'Open'
    PROGRESSING = 'progressing', 'Progressing'
    COMPLETED = 'completed', 'Completed'
    CANCELLED = 'cancelled', 'Cancelled'

class TaskPriorityChoices(models.TextChoices):
    LOW = 'low', 'Low'
    MEDIUM = 'medium', 'Medium'
    HIGH = 'high', 'High'

class Task(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=200)
    description = models.TextField()
    priority = models.CharField(
        max_length=20,
        choices=TaskPriorityChoices.choices,
        default=TaskPriorityChoices.MEDIUM,
    )
    status = models.CharField(
        max_length=20,
        choices=TaskStatusChoices.choices,
        default=TaskStatusChoices.OPEN,
    )
    progression = models.FloatField(default=0.0)
    start_date = models.DateField()
    end_date = models.DateField()

    def __str__(self):
        return f"Task: {self.title}"

# ===================== #
#   ASSIGNMENT TASK     #
# ===================== #
class AssignmentTask(models.Model):
    id = models.AutoField(primary_key=True)
    intern = models.ForeignKey(Intern, on_delete=models.CASCADE)
    completed_date = models.DateTimeField(null=True, blank=True)
    task = models.ForeignKey(Task, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return f"AssignmentTask: {self.task.title} for {self.intern.user.identifier}"
    
# ===================== #
#       PROJECT         #
# ===================== #
class Project(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=100)
    internship = models.ForeignKey(Internship, on_delete=models.CASCADE, null=True)

class AssignmentProject(models.Model):
    intern = models.ForeignKey(Intern, on_delete=models.CASCADE, related_name='assignments', null=True)
    instructor = models.ForeignKey(Instructor, on_delete=models.CASCADE, related_name='supervised_assignments', null=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='assignments', null=True)
    created_at = models.DateTimeField(auto_now_add=True)

# ===================== #
#       PLANNING        #
# ===================== #
class Planning(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=100)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()

# ===================== #
#   WORK HOURS LOG : Un modèle pour suivre les heures de travail des stagiaires,#
# nécessaire pour calculer cumulatedHour.#
# ===================== #
class WorkHoursLog(models.Model):
    id = models.AutoField(primary_key=True)
    intern = models.ForeignKey(Intern, on_delete=models.CASCADE)
    date = models.DateField()
    hours_worked = models.FloatField()

    def __str__(self):
        return f"Work Log: {self.hours_worked} hours on {self.date} for {self.intern.user.identifier}"