from pydantic import BaseModel, Field, field_validator


class StudentRegister(BaseModel):
    full_name: str = Field(min_length=3, max_length=150)
    nisn: str
    class_name: str
    major: str
    email: str
    password: str = Field(min_length=8)

    @field_validator("nisn")
    @classmethod
    def validate_nisn(cls, value):
        if not value.isdigit() or len(value) != 10:
            raise ValueError("NISN harus terdiri dari 10 angka")
        return value

    @field_validator("class_name")
    @classmethod
    def validate_class(cls, value):
        if value not in ["X", "XI", "XII"]:
            raise ValueError("Kelas harus X, XI, atau XII")
        return value
class AdminLogin(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    password: str = Field(min_length=1, max_length=128)
