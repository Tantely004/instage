from rest_framework import serializers
from .models import User, Intern, Framer, Administrator

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['identifier', 'mail', 'name', 'firstname', 'contact', 'image', 'cv', 'role']


class InternSerializer(serializers.ModelSerializer):
    class Meta:
        model = Intern
        fields = ['identifier', 'mail', 'name', 'firstname', 'contact', 'image', 'cv', 'role',
                  'etablishment', 'sector', 'level']


class FramerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Framer
        fields = ['identifier', 'mail', 'name', 'firstname', 'contact', 'image', 'cv', 'role',
                  'management', 'department', 'position']


class AdministratorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Administrator
        fields = ['identifier', 'mail', 'name', 'firstname', 'contact', 'image', 'cv', 'role',
                  'management', 'department', 'position']
