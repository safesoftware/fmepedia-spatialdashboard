from mod_pywebsocket import msgutil
from datetime import datetime
import time
import sys

providerConnBus = ''
consumerConnBus = []

def web_socket_do_extra_handshake(request):
	print '-----------------------------'
	print 'Connected'
	print request.method
	print request.uri
	print request.ws_origin
	print '-----------------------------'

	# deal with subprotocol problem
	request.ws_requested_protocols = 'None' 
	request.ws_protocol = 'None'

def web_socket_transfer_data(request):
	global providerConnBus
	global consumerConnBus
	
	connType = msgutil.receive_message(request)
	if connType == 'provider':
		#print connType
		providerConnBus = request
	elif connType == 'consumer':
		#print connType
		consumerConnBus.append(request)
	else:
		#print connType
		sys.exit()
	if connType == 'provider':
		while True:
			#print connType
			mess = msgutil.receive_message(providerConnBus)
			#print "Received '%s'" % mess
			#print mess
			if mess and mess[0:1] == '{':
				for conn in consumerConnBus:
					#print 'sending'
					try:
						msgutil.send_message(conn, mess)
					except:
						consumerConnBus.remove(conn)
						#print 'Dropping a connection'
	else:
		while True:
			pass
