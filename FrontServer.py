import tornado.escape
import tornado.web
import tornado.ioloop
from tornado import gen
import os
import json
import SharedData
import Waiters


class RootHandler(tornado.web.RequestHandler):
    @gen.coroutine
    def get(self):
        self.render("default.html", messages=[])
        pass


class GetAllIdsHandler(tornado.web.RequestHandler):
    @gen.coroutine
    def get(self, *args, **kwargs):
        self.write(json.dumps(SharedData.getAllIds()))
        pass


class GetQueueHandler(tornado.web.RequestHandler):
    @gen.coroutine
    def get(self):
        res = {"queue": [{"Id": x, "status": "QUEUED"} for x in SharedData.queue]}
        self.write(res)
        self.flush()

        while not self.request.connection.stream.closed():
            self.future = Waiters.all_waiters.subscribe_waiter(Waiters.WAIT_FOR_QUEUE)
            res = yield self.future

            self.write({"queue": res})
            self.flush()
            pass

        self.finish()
        pass

    @gen.coroutine
    def post(self, *args, **kwargs):
        rj = tornado.escape.json_decode(self.request.body)
        print(rj)
        if "Id" in rj:
            SharedData.queue.add(rj["Id"])
            rj["status"] = "QUEUED"
            Waiters.all_waiters.deliver_to_waiter(Waiters.WAIT_FOR_QUEUE, rj)

        if "Ids" in rj:
            SharedData.queue.update(rj["Ids"])
            rj["status"] = "QUEUED"
            Waiters.all_waiters.deliver_to_waiter(Waiters.WAIT_FOR_QUEUE, rj)

        self.write(rj)
        pass


class FrontWatchServer:
    def __init__(self):
        self.app = tornado.web.Application(
            [
                (r"/", RootHandler),
                (r"/default.html", RootHandler),
                (r"/queue", GetQueueHandler),
                (r"/getIds", GetAllIdsHandler),
            ],
            cookie_secret="__TODO:_GENERATE_YOUR_OWN_RANDOM_VALUE_HERE__",
            template_path=os.path.join(os.path.dirname(__file__), "static"),
            static_path=os.path.join(os.path.dirname(__file__), "static"),
            xsrf_cookies=False,
            debug=True,
        )
        pass

    def run(self):
        self.app.listen(9999)
        tornado.ioloop.IOLoop.current().start()
        pass
