import os
import shutil
import uuid

ParentDirectory = '.'
SnapshotDirectory = "./snapshots"

def GenerateSnapshot():
    FolderName = f"{SnapshotDirectory}/S{str(uuid.uuid1()).capitalize()[:4]}"

    if not os.path.exists(FolderName):
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
    else:
        GenerateSnapshot()

GenerateSnapshot()