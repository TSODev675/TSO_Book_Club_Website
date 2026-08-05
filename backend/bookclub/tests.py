from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.core import mail
from django.test import override_settings
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework import status
from rest_framework.test import APITestCase


@override_settings(
    EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend',
    SECURE_SSL_REDIRECT=False,
)
class AuthenticationFlowTests(APITestCase):
    def test_health_check_reaches_database(self):
        response = self.client.get('/health/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), {'status': 'ok'})

    def test_registration_verification_and_login(self):
        payload = {
            'username': 'reader',
            'email': 'reader@example.com',
            'first_name': 'Test',
            'last_name': 'Reader',
            'password': 'A-strong-test-password-42',
            'password2': 'A-strong-test-password-42',
        }
        response = self.client.post('/api/auth/register/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(len(mail.outbox), 1)

        response = self.client.post('/api/auth/token/', {
            'username': payload['username'], 'password': payload['password'],
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        user = User.objects.get(username=payload['username'])
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        response = self.client.get(f'/api/auth/verify-email/{uid}/{token}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.post('/api/auth/token/', {
            'username': payload['username'], 'password': payload['password'],
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.json())
        self.assertIn('refresh', response.json())
