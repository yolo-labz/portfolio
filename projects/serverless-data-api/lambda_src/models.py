from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Optional

from pydantic import BaseModel, Field


class ItemCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    category: str = Field(..., pattern=r"^[a-z_]+$")
    price: float = Field(..., gt=0, le=999999.99)
    tags: list[str] = Field(default_factory=list)


class ItemUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    category: Optional[str] = Field(None, pattern=r"^[a-z_]+$")
    price: Optional[float] = Field(None, gt=0, le=999999.99)
    tags: Optional[list[str]] = None


class ItemResponse(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    category: str
    price: float
    tags: list[str] = []
    created_at: str
    updated_at: str
