from django.db import models

# Create your models here.
# Item object with name and description
class Item(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name