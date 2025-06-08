from rest_framework import serializers
from stagiaires.models import User, Intern, Instructor, Administrator, Internship, Interview, Report, ReportTask, Document, Task, AssignmentTask, WorkHoursLog

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['identifier', 'mail', 'name', 'firstname', 'contact', 'image', 'cv', 'role']

class InternSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Intern
        fields = ['user', 'etablishment', 'sector', 'level']

class InstructorSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Instructor
        fields = ['user', 'management', 'department', 'position']

class AdministratorSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Administrator
        fields = ['user', 'management', 'department', 'position']

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['id', 'name', 'type', 'path']

class InternshipSerializer(serializers.ModelSerializer):
    intern = InternSerializer()
    instructor = InstructorSerializer()

    class Meta:
        model = Internship
        fields = ['id', 'start_date', 'end_date', 'intern', 'instructor', 'theme', 'status', 'is_finished']

class InterviewSerializer(serializers.ModelSerializer):
    internship = InternshipSerializer()

    class Meta:
        model = Interview
        fields = ['id', 'date', 'time', 'room', 'internship', 'subjects', 'status']

class ReportSerializer(serializers.ModelSerializer):
    document = DocumentSerializer()
    interview = InterviewSerializer()

    class Meta:
        model = Report
        fields = ['id', 'title', 'date', 'status', 'comments', 'document', 'interview']

class ReportTaskSerializer(serializers.ModelSerializer):
    report = ReportSerializer()

    class Meta:
        model = ReportTask
        fields = ['id', 'report']

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'priority', 'status', 'progression', 'start_date', 'end_date']

class AssignmentTaskSerializer(serializers.ModelSerializer):
    task = TaskSerializer()

    class Meta:
        model = AssignmentTask
        fields = "__all__"

class WorkHoursLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkHoursLog
        fields = ['id', 'date', 'hours_worked']