from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def get_consultations():
    """Retrieve list of doctor home-visit consultations for mobile patient app."""
    return {
        "status": "success",
        "data": [
            {
                "id": 1,
                "doctor_name": "Dr. Andi Pratama, Sp.A",
                "specialization": "Pediatrician",
                "type": "Home Visit",
                "status": "Scheduled",
            }
        ],
    }
