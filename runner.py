import SharedData
import Waiters
import time
from RTimer import RepeatedTimer
from FrontServer import FrontWatchServer


def processQueue():
    if SharedData.can_process and len(SharedData.queue) > 0:
        SharedData.can_process = False
        SharedData.current_id = next(iter(SharedData.queue))
        SharedData.process(SharedData.current_id)
        SharedData.queue.remove(SharedData.current_id)
        res = {
            "Id": SharedData.current_id,
            "status": "DONE",
            "last_date": str(time.ctime()),
        }
        Waiters.all_waiters.deliver_to_waiter(Waiters.WAIT_FOR_QUEUE, res)
        SharedData.can_process = True


if __name__ == '__main__':
    try:
        rt = RepeatedTimer(5, processQueue)
        fws = FrontWatchServer()
        fws.run()
    except KeyboardInterrupt:
        print('Goodbye.')
