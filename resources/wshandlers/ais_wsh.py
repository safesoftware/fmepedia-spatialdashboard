from mod_pywebsocket import msgutil
from datetime import datetime
import time
import sys

providerConn = ''
consumerConn = []

def web_socket_do_extra_handshake(request):
	print '-----------------------------'
	print 'Connected'
	print request.method
	print request.uri
	print request.ws_origin
	print '-----------------------------'

	# deal with subprotocol problem
	request.ws_protocol = 'None'
	request.ws_requested_protocols = 'None' 

def web_socket_transfer_data(request):
	global providerConn
	global consumerConn

	connType = msgutil.receive_message(request)
	if connType == 'provider':
		#print connType
		providerConn = request
	elif connType == 'consumer':
		#print connType
		consumerConn.append(request)
	else:
		#print connType
		sys.exit()
	if connType == 'provider':
		while True:
			#print connType
			mess = msgutil.receive_message(providerConn)
			#print "Received '%s'" % mess
			#print mess
			if mess and mess[0:1] == '{':
				for conn in consumerConn:
					#print 'sending'
					try:
						msgutil.send_message(conn, mess)
					except:
						consumerConn.remove(conn)
						#print 'bye bye'
	else:
		while True:
			pass
