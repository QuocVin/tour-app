# Generated by Django 3.2.5 on 2021-10-05 01:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tourapp', '0002_auto_20210929_2313'),
    ]

    operations = [
        migrations.AddField(
            model_name='booking',
            name='static',
            field=models.CharField(choices=[('HUY TOUR', 'Người dùng hủy đặt tour'), ('DAT TOUR', 'Người dùng đặt tour này')], default='DAT TOUR', max_length=10),
        ),
        migrations.AlterField(
            model_name='user',
            name='avatar',
            field=models.ImageField(default='static/upload/avatarDefault.jpg', null=True, upload_to='static/upload/%Y/%m'),
        ),
    ]
