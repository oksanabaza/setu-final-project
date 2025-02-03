from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, TIMESTAMP, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from backend.database import Base

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

    websites = relationship("Website", back_populates="owner")

class Website(Base):
    __tablename__ = "websites"

    website_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    url = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP, server_default=func.now())

    owner = relationship("User", back_populates="websites")
    tasks = relationship("ScrapingTask", back_populates="website")

class ScrapingTask(Base):
    __tablename__ = "scraping_tasks"

    task_id = Column(Integer, primary_key=True, index=True)
    website_id = Column(Integer, ForeignKey("websites.website_id"), nullable=False)
    status = Column(String, default="pending")
    progress = Column(Integer, default=0)
    started_at = Column(TIMESTAMP)
    completed_at = Column(TIMESTAMP)

    website = relationship("Website", back_populates="tasks")
    extracted_data = relationship("ExtractedData", back_populates="task")

class ExtractedData(Base):
    __tablename__ = "extracted_data"

    data_id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("scraping_tasks.task_id"), nullable=False)
    data = Column(JSON, nullable=False)
    extracted_at = Column(TIMESTAMP, server_default=func.now())

    task = relationship("ScrapingTask", back_populates="extracted_data")
