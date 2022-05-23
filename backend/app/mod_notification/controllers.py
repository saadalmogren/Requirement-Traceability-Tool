from flask import Blueprint, jsonify, request, abort, make_response
from app.mod_auth.auth import requires_auth, AuthError, check_log_in
from app.mod_notification.models import Notification
from app.mod_user.models import User

mod_notification = Blueprint('notification', __name__)
@mod_notification.route('/notifications', methods=['DELETE'])
@check_log_in
def delete_notification(username):
    notify = request.args.get('notify_id', None, type=str)

    if notify is None or username is None:
        abort(422)
    notify = Notification.query.get(notify)
    if notify is None:
        print('jk')
        abort(404)
    if notify.username != username:
        abort(401)
    notify.delete()

    return jsonify({
        'success': True
    })