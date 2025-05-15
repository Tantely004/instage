from rest_framework import serializers
from stagiaires.models import User, Intern, Instructor, Administrator

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
