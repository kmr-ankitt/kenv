import os
from passlib.context import CryptContext
from cryptography import fernet
from dotenv import load_dotenv

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

load_dotenv()
SECRET_KEY = os.getenv("FERNET_KEY")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def encrypt_secret(secret: str) -> str:
    fernet_key = fernet.Fernet(SECRET_KEY)
    encrypted_secret = fernet_key.encrypt(secret.encode())
    return encrypted_secret.decode()


def decrypt_secret(encrypted_secret: str) -> str:
    fernet_key = fernet.Fernet(SECRET_KEY)
    decrypted_secret = fernet_key.decrypt(encrypted_secret.encode())
    return decrypted_secret.decode()
