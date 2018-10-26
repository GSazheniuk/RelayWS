import time
import uuid


can_process = True
queue = set()
all_ids = []
current_id = ""


def process(queue_id):
    for x in all_ids:
        if x["Id"] == queue_id:
            print("Processing %s" % queue_id)
            x["last_date"] = str(time.ctime())


def getAllIds():
    if len(all_ids) == 0:
        all_ids.extend([{"Id": str(uuid.uuid4()), "last_date": ""} for x in range(51)])

    return all_ids
