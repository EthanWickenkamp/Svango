from django.db import models
from django.utils.text import slugify

# Create your models here.



class ItemGroup(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name
    
# Item object with name and description
class Item(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    group = models.ForeignKey(ItemGroup, on_delete=models.CASCADE, related_name='items', null=True)

    def __str__(self):
        return self.name