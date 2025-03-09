from celery import shared_task

@shared_task
def send_notification(user_id, message):
    print(f"Sending notification to user {user_id}: {message}")
