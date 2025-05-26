from rest_framework import serializers
from .models import Item, ItemGroup

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'

class ItemGroupSerializer(serializers.ModelSerializer):
    items = ItemSerializer(many=True, read_only=True)
    class Meta:
        model = ItemGroup
        fields = '__all__'
