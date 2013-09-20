from mod_pywebsocket import msgutil
from datetime import datetime
import time
import sys

providerConnPlane = ''
consumerConnPlane = []

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
	global providerConnPlane
	global consumerConnPlane

	connType = msgutil.receive_message(request)
	if connType == 'provider':
		#print connType
		providerConnPlane = request
	elif connType == 'consumer':
		#print connType
		consumerConnPlane.append(request)
	else:
		#print connType
		sys.exit()
	if connType == 'provider':
		while True:
			#print connType
			mess = msgutil.receive_message(providerConnPlane)
			#print "Received '%s'" % mess
			#print mess
			if mess and mess[0:1] == '{':
				for conn in consumerConnPlane:
					#print 'sending'
					try:
						msgutil.send_message(conn, mess)
					except:
						consumerConnPlane.remove(conn)
						print '!!!!!! CONSUMER REMOVED after attempting to send:'
						print mess
	else:
		while True:
			pass
