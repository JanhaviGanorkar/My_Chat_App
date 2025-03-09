``` bash 

chat_backend/
│── manage.py
│── .env
│── requirements.txt
│── config/
│   │── __init__.py
│   │── settings.py
│   │── urls.py
│   │── wsgi.py
│   │── asgi.py
│   │── celery.py
│── apps/
│   │── __init__.py
│   │── authentication/
│   │   │── __init__.py
│   │   │── models.py
│   │   │── serializers.py
│   │   │── views.py
│   │   │── urls.py
│   │   │── permissions.py
│   │   │── signals.py
│   │── chat/
│   │   │── __init__.py
│   │   │── models.py
│   │   │── serializers.py
│   │   │── views.py
│   │   │── urls.py
│   │   │── consumers.py
│   │   │── routing.py
│   │   │── tasks.py
│   │── friends/
│   │   │── __init__.py
│   │   │── models.py
│   │   │── serializers.py
│   │   │── views.py
│   │   │── urls.py
│── redis/
│   │── redis.conf
│── static/
│── media/
│── logs/
│   │── chat.log
│── scripts/
│   │── run_celery.sh
│   │── start_redis.sh
│── tests/
│   │── test_auth.py
│   │── test_chat.py
│── docker/
│   │── Dockerfile
│   │── docker-compose.yml
│── .gitignore
│── README.md

```