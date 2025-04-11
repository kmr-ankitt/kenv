from .register import router as register_router
from .login import router as login_router
from .me import router as me_router

routers = [register_router, login_router, me_router]
