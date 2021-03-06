# Generated by Django 3.2.5 on 2021-10-22 07:59

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('tourapp', '0004_rename_totleprice_booking_totalprice'),
    ]

    operations = [
        migrations.AddField(
            model_name='booking',
            name='dateBooking',
            field=models.DateField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='user',
            name='role',
            field=models.CharField(choices=[('NGUOI DUNG', 'nguoi dung'), ('NHAN VIEN', 'nhan vien'), ('QUAN LY', 'quan ly')], default='', max_length=10),
        ),
    ]
