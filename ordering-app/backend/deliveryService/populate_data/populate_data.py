from medifly.models import Medication, Hospital, Customer

with open('populate_data/drugs.txt', 'rt') as lines:
    for line in lines.readlines():
        to_add = Medication(name=line[:-1])
        to_add.save()

hospital = Hospital.objects.create_user(username='example-hospital', password='asdf', latitude=43.23, longitude=-79, hospital_name="Example Hospital")
for drug in ["First Aid Kit", "Tourniquet", "Epinephrine", "Antiseptic", "Antibiotics"]:
    hospital.inventory.add(Medication.objects.get(name=drug))

hospital.save()

hospital2 = Hospital.objects.create_user(username='other-hospital', password='asdf', latitude=43.23, longitude=-80, hospital_name="Other Hospital")
for drug in ["Aspirin", "First Aid Kit"]:
    hospital2.inventory.add(Medication.objects.get(name=drug))

hospital2.save()

user = Customer.objects.create_user(username='toady', password='asdf', registration_complete=True)
user.emergency_medication.add(Medication.objects.get(name="First Aid Kit"))
user.emergency_medication.add(Medication.objects.get(name="Aspirin"))
user.save()