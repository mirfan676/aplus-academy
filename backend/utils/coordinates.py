import math, random

def random_point_within_radius(lat, lng, radius_m=1000):
    radius_deg = radius_m / 111320.0
    u, v = random.random(), random.random()
    w = radius_deg * math.sqrt(u)
    t = 2 * math.pi * v
    lat_offset = w * math.cos(t)
    lng_offset = w * math.sin(t) / math.cos(math.radians(lat))
    return round(lat + lat_offset, 6), round(lng + lng_offset, 6)
