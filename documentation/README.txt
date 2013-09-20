San Francisco - AIS Stream - Direct Connect - Web Sockets
-----------------

A. EXTEND PYTHON

Download pywebsockets:
  http://code.google.com/p/pywebsocket/
  c:\apps\FMEServer\Server\fme\fme.exe python setup.py install
  <nb>future: run python externally to save an engine, used in ais_reader.fmw
  
Download Setuptools:
  http://pypi.python.org/pypi/setuptools
  c:\apps\FMEServer\Server\fme\fme.exe python setup.py install
  
Download websocket-client:
  http://pypi.python.org/pypi/websocket-client/0.7.0
  c:\apps\FMEServer\Server\fme\fme.exe python setup.py install

B. CONFIGURE WORKSPACE and HTML
  
Modify paths in:
  resources\start_ws_server.bat
  workspaces\ais_reader.fmw 

Modify web socket host in:
  workspaces\ais_reader.fmw > pythonCreator
  ais.html
  
Add ws web client to public root dir (webapps\ROOT):
  ais.html
  
B. RUN IT
-----

Run ais_reader.fmw from Workbench.
Open the ais.html in a web browser.
You should see ships moving.
Stop ais_reader.fmw and the web socket window.
Publish to FME Server.
Run from FME Server.