# RelayWS
A very simple and yet effective implementation of Timer as backend and Tornado as web interface. The UI is communicating with backend via streaming request.

## Getting Started
Download or clone the repository and run 'runner.py'. Then open 'localhost:9999' in the browser. You would see the page with the list of UUIDs. Those are abstractions of processes that can be queued to run in the backend. You can either queue any specific ID by clicking the corresponding 'refresh' icon in the row, or you could check multiple and click the button from navigation on the left. By defult queue is setup to run with 5sec interval. After it has processed any single ID, you would see the spinning icon dissapear for that ID and 'Last process date' will be updated with current time.

### Prerequisites
This has been tested with Python 3.7, but it should work with any version starting from 3.5 and higher.

Following modules are required:
* [tornado](https://www.tornadoweb.org/en/stable/) - The web framework used
