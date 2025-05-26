from django.contrib import admin
from .models import Item, ItemGroup


@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description')
    search_fields = ('name',)

@admin.register(ItemGroup)
class ItemGroupAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

