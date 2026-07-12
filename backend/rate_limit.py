from slowapi import Limiter
from slowapi.util import get_remote_address


# Un singur limiter comun pentru întreaga aplicație
limiter = Limiter(key_func=get_remote_address)