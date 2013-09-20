from mod_pywebsocket import msgutil
from datetime import datetime
import time
import sys

providerConnCustom = ''
consumerConnCustom = []

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
	global providerConnCustom
	global consumerConnCustom

	connType = msgutil.receive_message(request)
	if connType == 'provider':
		#print connType
		providerConnCustom = request
	elif connType == 'consumer':
		#print connType
		consumerConnCustom.append(request)
	else:
		#print connType
		sys.exit()
	if connType == 'provider':
		while True:
			#print connType
			mess = msgutil.receive_message(providerConnCustom)
			#print "Received '%s'" % mess
			#print mess
			if mess and mess[0:1] == '{':
				for conn in consumerConnCustom:
					#print 'sending'
					try:
						msgutil.send_message(conn, mess)
					except:
						consumerConnCustom.remove(conn)
						#print '!!!!!! CONSUMER REMOVED after attempting to send:'
						#print mess
	else:
		while True:
			pass
