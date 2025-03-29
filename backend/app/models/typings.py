from enum import Enum

class RequestType(str, Enum):
    supply = 'supply'
    maintenance = 'maintenance'
    suggestion = 'suggestion'
    other = 'other'

class RequestStatus(str, Enum):
    open = 'open'
    in_progress = 'in_progress'
    resolved = 'resolved'
    closed = 'closed'

class RequestPriority(str, Enum):
    very_low = 'very_low'
    low = 'low'
    medium = 'medium'
    high = 'high'
    very_high = 'very_high'
