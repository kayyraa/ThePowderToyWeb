import os
import shutil
from datetime import date, datetime

Date = datetime.now().strftime('%d-%m-%Y')
Time = datetime.now().strftime("%H-%M-%S")

ParentDirectory = '.'
SnapshotDirectory = "./snapshots"
FolderName = f"{SnapshotDirectory}/{Date} {Time}"

os.makedirs(FolderName, exist_ok=True)

Items = os.listdir(ParentDirectory)

for Item in Items:
    Source = os.path.join(ParentDirectory, Item)
    Destination = os.path.join(FolderName, Item)
    
    if os.path.abspath(Source).startswith(os.path.abspath(SnapshotDirectory)):
        continue
    
    if os.path.isdir(Source):
        shutil.copytree(Source, Destination, dirs_exist_ok=True)
    else:
        shutil.copy2(Source, Destination)
